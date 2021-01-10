<template>
  <div class="home">
    <VHeader :msg="'首页'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'首页'"></VFooter>
    <div class="person-container">
      <div class="person-container_top">
        <div class="person-container_avatur">
          <img
            src="https://imgqn.smm.cn/production/b/image/CiIiL20201211113642.png"
          />
        </div>
        <div class="person-container_info">
          <div>会员账号: {{ userData.name }}</div>
          <div>
            当前状态: {{ userData.status == 0 ? "待审核" : "审核通过" }}
          </div>
          <div>支付宝: {{ userData.nick || "--" }}</div>
        </div>
      </div>

      <div class="person-container_bottom">
        <div class="person-container_bottom_left">
          <div>账号余额（元）</div>
          <div>{{ userData.amount }}元</div>
        </div>
        <div class="person-container_bottom_right">
          <div>系统工单（0）</div>
          <div>
            <van-button
              type="primary"
              color="#F90"
              size="mini"
              @click="toWorkOrderList"
              >查看详情</van-button
            >
          </div>
        </div>
      </div>
    </div>

    <div class="person-icon">
      <div class="person-icon-left" @click="toComment">
        <div class="icon-comment"></div>
        <div class="person-icon-text">
          评价任务
          <span class="zy-font">({{ commentCount }})</span>
        </div>
      </div>
      <div class="person-icon-right" @click="toTx">
        <div class="cash-comment"></div>
        <div class="person-icon-text">平台提现</div>
      </div>
    </div>

    <div class="person-operation" v-if="!didGetMissioning">
      <div class="person-oper_btn_1">销量任务</div>
      <div class="person-oper_content">
        <div class="person-oper_content_left">
          <div
            class="person-oper_content_item"
            :class="{ 'person-oper_content_item_active': sale_type == 'tb' }"
            @click="typeSelect('tb')"
          >
            <span class="person-platform">淘宝</span>
            <span class="person-text"
              >接手机会
              <span class="person-num">{{ orderCount }}</span>
            </span>
          </div>

          <div class="person-oper_content_item person-oper_content_item_active">
            <span class="person-platform">流量任务</span>
            <span class="person-text"
              >接手机会
              <span class="person-num">{{ orderCount }}</span>
            </span>
          </div>
        </div>
        <div class="person-oper_content_right">
          <div
            class="person-oper_content_item"
            :class="{ 'person-oper_content_item_active': sale_type == 'jd' }"
            @click="typeSelect('jd')"
          >
            <span class="person-platform">京东</span>
            <span class="person-text"
              >接手机会
              <span class="person-num">{{ orderCount }}</span>
            </span>
          </div>

          <div
            class="person-oper_content_item"
            :class="{ 'person-oper_content_item_active': sale_type == 'pdd' }"
            @click="typeSelect('pdd')"
          >
            <span class="person-platform">拼多多</span>
            <span class="person-text"
              >接手机会
              <span class="person-num">{{ orderCount }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="person-money_container">
        <div class="person-money_icon"></div>
        <div class="person-money_input">
          <input placeholder="价格上限默认等于信用积分" />
        </div>
      </div>

      <div class="person-oper_btn_2" @click="getMission">接手任务</div>
    </div>

    <div class="person-loading" v-else>
      <div>等待分配任务</div>
      <div class="person-loading-icon">
        <van-loading color="#1989fa" />
      </div>
      <div>排队中，平台正在为你分配任务</div>
      <div class="person-loading-btn" @click="stopMission">停止接单</div>
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
import { getCommentList, getUserOrderNum, receiveOrder } from "@/service/order";
import { getUserInfo } from "@/service/login";
import { Dialog } from "vant";
import { Toast } from "vant";
import { routerHelper } from "@/router";

@Component({
  components: {
    HelloWorld,
    Header,
    VHeader,
    VFooter,
  },
})
export default class Home extends Vue {
  sale_type: string = "tb";

  didGetMissioning: boolean = false;

  buyerData: any = [];
  userData: any = {};

  tbBuyerId: number = 0;
  jdBuyerId: number = 0;
  pddBuyerId: number = 0;

  orderCount: any = 0;
  commentCount: any = 0;

  created() {
    getCommentList({
      limit: 10,
      page: 1,
      is_evaluate: 1,
    }).then((data: any) => {
      console.log("获取评价的数据", data);
      if (data && data.data && data.data.total) {
        this.commentCount = data.data.total;
      }
    });

    getUserInfo().then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.userData = data.data;
      }
    });

    getBuyerList().then((data) => {
      if (data && data.data && data.data.length > 0) {
        this.buyerData = data.data;
        this.buyerData.forEach((item: any) => {
          if (item.type == 1) this.tbBuyerId = item.id;
          if (item.type == 2) this.jdBuyerId = item.id;
          if (item.type == 3) this.pddBuyerId = item.id;
        });
      }
    });

    getUserOrderNum().then((data) => {
      if (data && data.data) {
        this.orderCount = data.data;
      }
    });
  }

  // 类型选择
  typeSelect(type: string) {
    if (type == "tb" && this.tbBuyerId) this.sale_type = type;
    if (type == "jd" && this.jdBuyerId) this.sale_type = type;
    if (type == "pdd" && this.pddBuyerId) this.sale_type = type;
  }

  private receiveTimer: any = "";

  // 接手任务
  getMission() {
    this.didGetMissioning = true;
    let id = 0;
    let type = 1;
    if (this.sale_type == "tb") {
      id = this.tbBuyerId;
      type = 1;
    }

    if (this.sale_type == "jd") {
      id = this.jdBuyerId;
      type = 2;
    }

    if (this.sale_type == "pdd") {
      id = this.pddBuyerId;
      type = 3;
    }

    if (!id) {
      Toast("请先添加买号~");
      return;
    }
    // this.receiveTimer = setInterval(() => {
    //   receiveOrder(type, id).then((data) => {
    //     if (data && data.origin_data && data.origin_data.code == 1001) {
    //       clearInterval(this.receiveTimer);
    //       this.stopMission();
    //       Dialog({
    //         title: "接单成功",
    //         message: "恭喜你已经接单成功了",
    //       });
    //     }
    //   });
    // }, 3000);

    let fn = () => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        receiveOrder(type, id).then((data) => {
          if (data && data.origin_data) {
            if (data.origin_data.code == 1001) {
              this.stopMission();
              Dialog({
                title: "接单成功",
                message: "恭喜你已经接单成功了",
              });
            } else if (data.origin_data.code == 1006) {
              // fn()
              this.stopMission();
            } else {
              this.stopMission();
              Toast(data.origin_data.msg || "未知异常");
            }
          } else {
            this.stopMission();
          }
        });
      }, 3000);
    };

    fn();
  }

  stopMission() {
    this.didGetMissioning = false;
    clearInterval(this.receiveTimer);
  }

  toTx() {
    routerHelper.to("/applyPay");
  }

  toComment() {
    routerHelper.to("/commentList");
  }

  toWorkOrderList(){
    routerHelper.to("/workOrderList");
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

.home {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  .home-banner_container {
    width: 100%;
    height: 400px;
    position: relative;
    background: url(http://img.baishou123.cn/data/upload/fen/2020-08-08/5f2eb50562970.png)
      no-repeat center;
    background-size: 100% 100%;
    .home-board-container {
      position: absolute;
      height: auto;
      top: 40px;
      right: 200px;
      background: #fff;
      .home-board_item {
        width: 300px;
        @include setHeight(50px);
        color: #000;
        @include flex(flex-start);
        align-items: center;
        border-bottom: 1px solid #dcdfdf;
        .home-board_item_logo {
          width: 15px;
          height: 15px;
          margin: 0px 15px;
          border-radius: 50%;
          border: 1px solid #ddd;
        }
        .home-board_item_content {
          // font-weight: 600;
        }
      }
      .home-board_search {
        width: 100%;
        height: 60px;
        position: relative;
        color: #fff;
        background: #081535;

        .home-board_search_content {
          width: 100%;
          height: 100%;
          text-align: left;
          padding-left: 40px;
          @include setHeight(60px);
        }
        .home-board_search_board {
          position: absolute;
          width: 80px;
          text-align: center;
          cursor: pointer;
          height: 100%;
          top: 0px;
          right: 0px;
          box-sizing: border-box;
          padding: 12px 20px;
          color: #fff;
          background: red;
        }
      }
    }
  }

  .ad-container {
    margin-top: 20px;
    @include flex(center);
    .ad-content {
      width: 1200px;
      @include flex(space-between);
      .ad-item {
        width: 570px;
        .ad-item_header {
          @include setHeight(40px);
          background: #4882f0;
          color: #fff;
          font-size: 14px;
        }
        .ad-item_content {
          @include flex(space-between);
          border: 1px solid #ddd;
          padding: 20px;
          .ad-logo_item {
            width: 110px;
            height: 120px;
            background: #eee;
            cursor: pointer;
            .ad-logo_item_pic {
              margin-top: 30px;
              & > i {
                font-size: 30px;
              }
            }
            .ad-logo_item_content {
              text-align: center;
              color: #000;
              margin-top: 12px;
              font-size: 14px;
              &:hover {
                color: #4882f0;
              }
            }
          }
        }
      }
    }
  }

  .person-container {
    .person-container_top {
      font-size: 14px;
      box-sizing: border-box;
      padding: 20px 20px 10px;
      background: #457ee8;
      height: auto;
      position: relative;
      @include flex(flex-start);
      align-items: center;
      .person-container_avatur {
        width: 80px;
        height: 80px;
        & img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .person-container_info {
        margin-left: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        text-align: left;
      }
    }

    .person-container_bottom {
      width: 100%;
      @include flex(flex-start);
      align-items: center;
      background: #457ee8;
      border-top: 1px solid #999;
      & > div {
        flex: 1;
        height: 60px;
      }
      .person-container_bottom_left {
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
        border-right: 1px solid #999;
      }

      .person-container_bottom_right {
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
        border-right: 1px solid #999;
      }
    }
  }

  .person-icon {
    margin-top: 12px;
    height: auto;
    font-size: 14px;
    background: #fff;
    border: 1px solid #ddd;

    @include flex(flex-start);
    & > div {
      flex: 1;
      padding: 20px 0px;
    }
    .person-icon-text {
      margin-top: 6px;
    }
    .person-icon-left {
      border-right: 1px solid #ddd;
      .icon-comment {
        width: 45px;
        height: 45px;
        margin: 0 auto;
        background: url("https://imgqn.smm.cn/production/b/image/GtnnH20201211113833.png")
          no-repeat center center;
        background-size: 100% 100%;
      }
    }

    .person-icon-right {
      .cash-comment {
        width: 45px;
        height: 45px;
        margin: 0 auto;
        background: url("http://img.baishou123.cn/public/wap/img/tu_22.jpg")
          no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }

  .person-operation {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px 10px 60px;
    background: #fff;
    border: 1px solid #ddd;

    .person-oper_btn_1 {
      width: 100%;
      background: #457ee8;
      padding: 2px 0px;
      color: #fff;
      text-align: center;
      font-weight: 600;
    }

    .person-oper_btn_2 {
      width: 100%;
      margin-top: 10px;
      background: #457ee8;
      @include setHeight(45px);
      color: #fff;
      text-align: center;
      font-weight: 600;
    }

    .person-oper_content {
      margin-top: 10px;
      @include flex(flex-start);
      & > div {
        flex: 1;
      }
      .person-oper_content_item {
        @include setHeight(30px);
        border: 1px dotted #ccc;
        border-radius: 3px;
        padding: 0px 5px;
        display: block;
        color: #999;
        font-weight: bold;
        font-size: 14px;
        @include flex(space-between);
        align-items: center;
        margin-bottom: 10px;
        .person-num {
          display: inline-block;
          padding-left: 10px;
        }
      }
      .person-oper_content_item_active {
        border: 1px solid #457ee8;
        font-weight: normal;
        .person-platform {
          color: #457ee8;
        }
        .person-text {
          color: #000;
          display: inline-block;
          padding-left: 10px;
        }
        .person-num {
          color: red;
        }
      }

      .person-oper_content_left {
        flex: 1;
        box-sizing: border-box;
        padding-right: 15px;
        border-right: 1px solid #ddd;
      }

      .person-oper_content_right {
        flex: 1;
        box-sizing: border-box;
        padding-left: 15px;
        border-right: 1px solid #ddd;
      }
    }

    .person-money_container {
      width: 100%;
      margin-top: 5px;
      border: 1px dotted #ccc;
      @include flex(flex-start);
      @include setHeight(40px);
      .person-money_icon {
        width: 40px;
        height: 40px;
        background: url(http://img.baishou123.cn/public/wap/images/img/jin_e.gif)
          no-repeat center center;
        background-size: 30px 30px;
      }
      .person-money_input {
        flex: 1;
        box-sizing: border-box;
        // padding: 10px 0px;
        input {
          width: 100%;
          height: 80%;
          padding: 0px 10px;
          box-sizing: border-box;
          color: #000;
          font-size: 14px;
        }
      }
    }
  }

  .person-loading {
    padding: 10px 0px 15px;
    background: #fff;
    color: #457ee8;
    font-weight: bold;
    .person-loading-icon {
      margin: 5px 0px;
    }
    .person-loading-btn {
      width: 200px;
      @include setHeight(40px);
      margin: 12px auto 0px;
      border-radius: 20px;
      color: #fff;
      background: #457ee8;
      text-align: center;
    }
  }
}
</style>
