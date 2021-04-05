<template>
  <div class="user-order-container">
    <VHeader :msg="'邀请人详细'" :showExitBtn="true"></VHeader>
    <!-- <VFooter :msg="'资金管理'"></VFooter> -->

    <div class="user-order-header-1">
      <div class="user-ordre-next_btn" @click="toNext">返回</div>
    </div>

    <van-popup
      v-model="showPicker"
      position="bottom "
      :style="{ height: '50%' }"
    >
      <van-picker
        title="标题"
        show-toolbar
        :columns="areaList"
        @confirm="confirm"
        @cancel="cancel"
      />
    </van-popup>

    <div class="apply-pay-content">
      <div>昵称：{{ buyerInfoList.name }}</div>
      <div>
        电话{{ buyerInfoList.phone }}元
      </div>
      <div>支付宝{{ buyerInfoList.nick }}元</div>
      <div>支付宝信息图</div>
      <div class="flex-s small-img">
        <img
          :src="buyerInfoList.alipay_pic"
          alt=""
          @click="previewImage(buyerInfoList.alipay_pic)"
        />
      </div>
      <div>真实姓名：{{ buyerInfoList.full_name }}</div>
      <div>身份证号：{{ buyerInfoList.card }}</div>
      <div>手持身份证照片</div>

      <div>淘宝买号昵称：{{ buyerInfoList.buname }}</div>
      <div>淘宝买号性别：{{ buyerInfoList.sex == 0 ? "男" : "女" }}</div>
      <div>淘宝买号验证截图</div>
      <div class="flex-s small-img">
        <img
          v-for="(item, index) in buyerInfoList.img_url"
          :src="item"
          :key="index"
          alt=""
          @click="previewImage(item)"
        />
      </div>
      <div>银行：{{ buyerInfoList.bank }}</div>
      <div>银行卡卡号：{{ buyerInfoList.card_no }}</div>
      <div>银行卡开户人：{{ buyerInfoList.bname }}</div>
      <div>银行卡开户地址：{{ buyerInfoList.address }}</div>
      <div>银行卡开户地址：{{ buyerInfoList.bank_address }}</div>

      <div class="apply-pay-btn-content" v-if="buyerInfoList.status == 0">
        <div class="apply-pay-btn apply-pay-btn-1" @click="checkBuyerPass">
          通过
        </div>
        <div class="apply-pay-btn apply-pay-btn-2" @click="checkBuyerNoPass">
          不通过
        </div>
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
import { checkBuyerInfo, getBuyerInfo, getBuyerList } from "@/service/buyer";
import {
  advanceAction,
  confirmGoods,
  getAdvanceList,
  getChareList,
  getOrderList,
} from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { getMissionStatus } from "@/lib/helper";
import { getUserInfo } from "@/service/login";
import { getInviteList } from "@/service/invite";
import { ImagePreview, Toast } from "vant";

@Component({
  components: {
    HelloWorld,
    Header,
    VHeader,
    VFooter,
  },
})
export default class Home extends Vue {
  isLoading: boolean = true; // 正在加载中
  finished: boolean = false; // 是否完成
  showPicker: boolean = false; // 展示弹框

  areaList = ["账户余额", "邀请余额"];
  userData: any = {};

  list: any[] = [];

  buyerInfoList: any = {
    active: 0,
    address: "",
    alipay_pic: "",
    bank: "",
    bank_address: "",
    bname: "",
    buname: "",
    card: "",
    card_no: "",
    card_pic: "",
    created_at: "",
    description: null,
    full_name: "",
    id: 0,
    img_url: "",
    invited: 0,
    max_invite: 0,
    name: "",
    nick: "",
    password: "",
    pay_password: "",
    phone: "",
    province: null,
    qq: null,
    score: "",
    secret: "",
    sex: 0,
    status: 0,
    type: 1,
    updated_at: "",
    wx: null,
  };

  page: number = 1;
  limit: number = 20;
  id: any = 0;

  created() {
    getUserInfo().then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.userData = data.data;
      }
    });

    const { id } = routerHelper.getData();
    if (id) {
      this.id = id;
      getBuyerInfo(id).then((data) => {
        if (data && data.data) {
          this.buyerInfoList = data.data;
          this.buyerInfoList.img_url = JSON.parse(this.buyerInfoList.img_url)
        }
      });
    }

    this.getInviteList(this.calcPage(this.page));
  }

  beforeDestory() {
    console.log("beforeDestory");
    // 卸载掉scroll监听事件
    window.removeEventListener("scroll", () => {}, true);
  }

  calcPage(page: number) {
    return {
      page,
      limit: 20,
    };
  }

  debounce(fn: any, timeout = 500) {
    let timer: any;
    const that = this;
    return function () {
      let env = that;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(env, arguments);
      }, timeout);
    };
  }

  calcMoney() {
    if (this.userData.amount && this.userData.invited_amount) {
      return (
        Number(this.userData.amount) - Number(this.userData.invited_amount)
      );
    }
    return this.userData.amount || "0.00";
  }

  confirm(value: any) {
    if (value == "账户余额") {
      this.advanceForm.type = 0;
    } else {
      this.advanceForm.type = 1;
    }
    this.showPicker = false;
  }

  cancel() {
    this.showPicker = false;
  }

  getInviteList(form: any) {
    getInviteList(form).then((data: any) => {
      console.log("data", data);
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.list = this.list.concat(data.data.list);
      }
    });
  }

  advanceForm = {
    pay_password: "",
    amount: "",
    type: 0,
  };

  toNext() {
    routerHelper.to("/homeTg");
  }

  previewImage(pic_url: string) {
    ImagePreview([pic_url]);
  }

  checkBuyerPass() {
    if (this.id) {
      checkBuyerInfo(this.id, "pass").then((data) => {
        Toast("审核完成");
        const timer = setTimeout(() => {
          routerHelper.to("/inviteDetail");
          clearTimeout(timer);
        }, 2000);
      });
    }
  }

  checkBuyerNoPass() {
    if (this.id) {
      checkBuyerInfo(this.id, "nopass").then((data) => {
        Toast("审核完成");
        const timer = setTimeout(() => {
          routerHelper.to("/inviteDetail");
          clearTimeout(timer);
        }, 2000);
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

.flex-s {
  @include flex(flex-start);
  align-items: center;
}

.small-img {
  img {
    width: 80px;
    height: 80px;
  }
}

.zy-font {
  color: red;
}

.bs-font {
  color: #447ee9;
}

.bs-font-1 {
  color: indianred;
}

.user-order-container {
  min-height: 100vh;
  background: #f2f2f2;
  .user-order-header-1 {
    font-size: 14px;
    box-sizing: border-box;
    background: #fff;
    padding: 10px 10px;
    border: 1px solid #ddd;
    @include flex(flex-start);
    .user-ordre-next_btn {
      width: 80px;
      @include setHeight(30px);
      border-radius: 15px;
      text-align: center;
      color: #fff;
      background: #f90;
    }
  }

  .user-order-money {
    padding: 5px 10px;
    box-sizing: border-box;
    width: 100%;
    @include flex(space-between);
    margin: 10px 0px;
    align-items: center;
    background: #fff;
    font-size: 14px;
    & > div {
      flex: 1;
    }
    .user-order-money_left {
      text-align: left;
    }
    .user-order-money_right {
      text-align: right;
    }
  }

  .user-order-content {
    margin-bottom: 40px;
    .user-content_item {
      margin: 10px 0px;
      box-sizing: border-box;
      padding: 10px 20px;
      text-align: left;
      background: #fff;
      font-size: 14px;
      position: relative;
      font-weight: 600;
      & > div {
        margin-bottom: 8px;
      }

      .user-content_item_right {
        position: absolute;
        text-align: center;
        right: 5px;
        top: 5px;
      }
    }
  }

  .user-list_bottom {
    text-align: center;
    padding: 15px 0px;
    font-size: 14px;
    color: #ddd;
  }

  .apply-pay-content {
    color: #000;
    font-size: 14px;
    text-align: left;
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    .van-cell {
      width: 150px;
      padding: 0px;
    }
    .apply-pay-input {
      border: 1px solid #ddd;
      font-size: 14px;
      padding: 10px;
      & input {
        width: 100%;
      }
    }
    .apply-pay-btn-content {
      @include flex(space-between);
      align-items: center;
    }
    .apply-pay-btn {
      width: 40%;
      height: 40px;
      line-height: 40px;
      text-align: center;

      display: block;
      color: #fff;
      margin-top: 20px;
      font-size: 18px;
      border-radius: 25px;
    }

    .apply-pay-btn-1 {
      background: #457ee8;
    }
    .apply-pay-btn-2 {
      background: #f90;
    }
    & > div {
      margin-bottom: 10px;
    }
  }

  .apply-pay-list {
    width: 100%;
    margin-top: 10px;
    background: #fff;
    text-align: left;
    font-size: 14px;
    thead {
      width: 100%;
    }
    td {
      border: 1px solid #ddd;
    }
    .apply-pay-list-header {
      font-weight: 600;
      box-sizing: border-box;
      padding: 10px;
    }
    .apply-pay-list-1 {
      text-align: center;
      width: 25%;
      padding: 10px 0px;
    }
    .apply-pay-list-2 {
      text-align: center;
      width: 45%;
      padding: 10px 0px;
    }
    .apply-pay-list-3 {
      text-align: center;
      width: 30%;
      padding: 10px 0px;
    }
  }
}
</style>
