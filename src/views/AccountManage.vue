<template>
  <div class="buyer-container">
    <VHeader :msg="'买号管理'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'买号管理'"></VFooter>

    <van-popup v-model="showEditBankCardModal">
      <div class="tip-modal-container">
        <div class="tip-modal-header">
          <span>修改收货地址</span>
          <span @click="closeEditBankCardModal">
            <van-icon name="cross" color="#fff"
          /></span>
        </div>
        <div class="tip-modal-content">
          <p>原提现银行卡</p>
          <p>中国农业银行 尾号 7388</p>
          <div class="tip-modal-content_select_title">选择提现银行卡</div>

          <div class="tip-modal-content_select_title">身份验证</div>
          <input class="tip-modal-content_input" placeholder="请输入支付密码" />

          <div class="tip-modal-operation">
            <div class="tip-modal-operation_btn tip-modal-operation_btn_1">
              确认提交
            </div>
            <div class="tip-modal-operation_btn tip-modal-operation_btn_2">
              返回修改
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <div class="buyer-item">
      <div class="buyer-item_left"></div>
      <div class="buyer-item_middle">
        <div>
          淘宝：<span class="zy-font">{{
            tbBuyerInfo && tbBuyerInfo.status == 0 ? "待审核" : tbBuyerInfo.status == 1 ? "审核通过" : "未添加"
          }}</span>
        </div>
        <div>
          买号：<span style="color: #000">{{ tbBuyerInfo.name || "--" }}</span>
        </div>
      </div>
      <div class="buyer-item_right">
        <div
          class="buyer-item_btn"
          @click="toCreateAccount(1)"
          v-if="!tbBuyerInfo.id"
        >
          添加
        </div>
      </div>
    </div>

    <div class="buyer-item">
      <div class="buyer-item_left buyer-item_left_jd"></div>
      <div class="buyer-item_middle">
        <div>
          京东：<span class="zy-font">{{
            jdBuyerInfo && jdBuyerInfo.status == 1   ? "审核通过" : "未添加"
          }}</span>
        </div>
        <div>
          买号：<span style="color: #000">{{ jdBuyerInfo.name || "--" }}</span>
        </div>
      </div>
      <div class="buyer-item_right">
        <div
          class="buyer-item_btn"
          @click="toCreateAccount(2)"
          v-if="!jdBuyerInfo.id"
        >
          添加
        </div>
      </div>
    </div>

    <div class="buyer-item">
      <div class="buyer-item_left buyer-item_left_common"></div>
      <div class="buyer-item_middle">
        <div>
          拼多多：<span class="zy-font">{{
            pddBuyerInfo && pddBuyerInfo.status == 1 ? "审核通过" : "未添加"
          }}</span>
        </div>
        <div>
          买号：<span style="color: #000">{{ pddBuyerInfo.name || "--" }}</span>
        </div>
      </div>
      <div class="buyer-item_right">
        <div
          class="buyer-item_btn"
          @click="toCreateAccount(3)"
          v-if="!pddBuyerInfo.id"
        >
          添加
        </div>
      </div>
    </div>

    <div class="buyer-item">
      <div class="buyer-item_left buyer-item_left_common"></div>
      <div class="buyer-item_middle">
        <div>
          收货地址：
          <span class="zy-font" v-if="userInfo.address">已填写</span>
          <span v-else>--</span>
        </div>
        <div>地址：</div>
      </div>
      <div class="buyer-item_right">
        <div
          class="buyer-item_btn"
          @click="addAddress"
          v-if="!userInfo.address"
        >
          添加
        </div>
        <div class="buyer-item_btn" @click="detailAddress" v-else>查看</div>
      </div>
    </div>

    <div class="buyer-tip_container">
      <div class="buyer-tip_title">
        <em></em>
        <h3>审核标准</h3>
      </div>

      <div class="buyer-tip_list">
        <p>● 每人只能绑定1个淘宝帐号</p>
        <p>● 淘宝帐号的实名信息与平台信息一致；</p>
        <p>
          ● 信誉级别≥3心、注册时长≥1年、买号周平均信誉值≤3、支付宝关联账户数≤2；
        </p>
        <p>● 淘宝买号审核通过后可继续添加京东和拼多多买号。</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import VFooter from "@/components/VFooter.vue";
import { getBuyerList } from "@/service/buyer";
import { routerHelper } from "@/router";
import RouterHelper from "@/lib/router";
import { getUserInfo } from "@/service/login";
import { Dialog } from "vant";

@Component({
  components: {
    HelloWorld,
    Header,
    VHeader,
    VFooter,
  },
})
export default class Home extends Vue {
  showEditBankCardModal: boolean = false;
  show: boolean = true;

  userInfo: any = {};
  created() {
    this.getBuyerInfo();
    getUserInfo().then((data) => {
      if (data && data.origin_data) {
        console.log("接收到的数据", data);
        this.userInfo = data.origin_data.data;
      }
    });
  }

  form = {
    type: 1,
    sex: 0,
    img_url: "",
  };

  buyerInfo: any = [];

  tbBuyerInfo: any = {};
  jdBuyerInfo: any = {};
  pddBuyerInfo: any = {};

  buyerInfo:IBuyerInfo[] = []

  tbInfo:IBuyerInfo = Object.assign({},DEFAULT_BUYERINFO) 
  jdInfo:IBuyerInfo = Object.assign({},DEFAULT_BUYERINFO) 
  pddInfo:IBuyerInfo = Object.assign({},DEFAULT_BUYERINFO) 

  // 跳到创建买手号网页
  toCreateAccount(type: number) {
    routerHelper.to("/createAccount", {
      type,
    });
  }

  checkForPlatType(status:number){
      if(status == 0) return "审核中"
      if(status == 1) return "审核通过"
  }

  // 获取买手信息
  getBuyerInfo() {
    getBuyerList().then((data) => {
      if (data && data.data) {
        this.buyerInfo = data.data;
        this.buyerInfo.forEach((item: any) => {
          if (item.type == "1") this.tbBuyerInfo = item;
          if (item.type == "2") this.jdBuyerInfo = item;
          if (item.type == "3") this.pddBuyerInfo = item;
        });
      }
    });
  }

  openEditBankCardModal() {
    this.showEditBankCardModal = true;
  }

  closeEditBankCardModal() {
    this.showEditBankCardModal = false;
  }

  addAddress() {
    routerHelper.to("/address");
  }

  // 查看地址详情
  detailAddress() {
    const address = this.userInfo.address;
    Dialog({
      title: "收货地址",
      message: address,
    });
  }

  handleBuyerInfo(type: any) {
    if (this.buyerInfo && this.buyerInfo.length > 0) {
      return this.buyerInfo.filter((item: any) => {
        return item.type == type;
      });
    }
  }
}
</script>

<style lang="scss">
@mixin flex($direction) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: $direction;
}

@mixin setHeight($height) {
  height: $height;
  line-height: $height;
}

.zy-font {
  color: red;
}

.buyer-container {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  .buyer-item {
    box-sizing: border-box;
    padding: 20px 10px;
    background: #fff;
    margin-bottom: 10px;
    @include flex(flex-start);
    align-items: center;
    font-size: 14px;
    .buyer-item_btn {
      width: 64px;
      @include setHeight(30px);
      text-align: center;
      background: #f90;
      border-radius: 16px;
      color: #fff;
    }
    .buyer-item_left {
      width: 40px;
      height: 40px;
      background: url(http://img.baishou123.cn/public/wap/img/taobao1.png)
        no-repeat center center;
      background-size: 100% 100%;
    }
    .buyer-item_left_jd {
      background: url(http://img.baishou123.cn/public/wap/img/jingdong2.png)
        no-repeat center center;
      background-size: 100% 100%;
    }
    .buyer-item_left_common {
      background: url(http://img.baishou123.cn/public/wap/img/pingjia3.png)
        no-repeat center center;
      background-size: 100% 100%;
    }

    .buyer-item_middle {
      flex: 1;
      height: 100%;
      text-align: left;
      margin-left: 15px;
    }
    .buyer-item_right {
      width: 80px;
      height: 100%;
    }
  }

  .buyer-tip_container {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px 10px 30px;
    background: #fff;
    .buyer-tip_title {
      @include flex(flex-start);
      align-items: center;
      em {
        width: 4px;
        height: 13px;
        background: #f90;
        margin: 0px 5px 0px 0px;
        border-radius: 5px;
      }
      h3 {
        font-size: 14px;
      }
      text-align: left;
    }
    .buyer-tip_list {
      height: auto;
      overflow-y: auto;
      border: 2px dashed #ddd;
      width: 100%;
      padding: 2%;
      margin-top: 10px;
      line-height: 22px;
      text-align: left;
      font-size: 14px;
    }
  }
}

.tip-modal-container {
  width: 300px;
  height: auto;
  .tip-modal-header {
    width: 100%;
    background: #4882f0;
    color: #fff;
    font-size: 14px;
    @include flex(space-between);
    box-sizing: border-box;
    padding: 0px 10px;
    height: 40px;
    align-items: center;
  }

  .tip-modal-content {
    box-sizing: border-box;
    padding: 10px;
    font-size: 14px;
    .tip-modal-content_select_title {
      margin-top: 20px;
    }
    .tip-modal-content_select {
      margin-top: 10px;
      width: 100%;
      height: 40px;
      border: 1px solid #ddd;
    }

    .tip-modal-content_input {
      margin-top: 10px;
      width: 100%;
      height: 40px;
      border: 1px solid #ddd;
    }
    p {
      margin-bottom: 6px;
    }

    .tip-modal-operation {
      @include flex(space-around);
      align-items: center;
      margin-top: 10px;
      .tip-modal-operation_btn {
        width: 80px;
        text-align: center;
        @include setHeight(30px);
        color: #fff;
        font-size: 14px;
        border-radius: 15px;
      }
      .tip-modal-operation_btn_1 {
        background: #f90;
      }
      .tip-modal-operation_btn_2 {
        background: #4882f0;
      }
    }
  }
}

.tip-modal-container-1 {
  width: 300px;

  border: 1px solid #f90;
  .tip-modal-header {
    width: 100%;
    color: #999;
    font-size: 14px;
    @include flex(space-between);
    box-sizing: border-box;
    height: 40px;
    padding: 10px;
    box-sizing: border-box;
    align-items: center;
  }

  .tip-modal-content {
    width: 100%;
    font-size: 14px;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px dashed #ddd;
    & > div {
      width: 100%;
      margin-bottom: 10px;
      @include flex(flex-start);
    }
    .tip-modal-content-left {
      width: 20px;
      margin-top: 5px;
      @include setHeight(20px);
      background: #ddd;
      text-align: center;
      color: #fff;
    }

    .tip-modal-content-right {
      flex: 1;
      margin-left: 15px;
    }
  }

  .tip-modal-footer {
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
  }
}
</style>
