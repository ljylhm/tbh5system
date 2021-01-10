<template>
  <div class="user-order-container">
    <VHeader :msg="'工单管理'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'首页'"></VFooter>

    <div class="user-order-header-1">
      <div class="user-ordre-next_btn" @click="toNext">返回</div>
    </div>

    <div class="cast-out-content" v-if="customServicePublishData.length > 0">
      <div
        class="cast-out-item"
        v-for="(item, key) in customServicePublishData"
        :key="key"
      >
        <div class="bs-font" style="font-weight: 600">
          <!-- {{ mapToStatus(item.status) }} -->
        </div>
        <div>任务编号：{{ item.order_no }}</div>
        <div>订单编号：{{ item.order_number }}</div>
        <div>工单状态：{{ handleStatus(item.status) }}</div>
        <div>工单类型：{{ handleType(item.type) }}</div>
        <div>问题分类：{{ hanleQuesType(item.type, item.trouble_type) }}</div>
        <div>创建时间：{{ item.created_at || "--"}}</div>
        <div style="text-align: right">
          <van-button round type="info" size="small" style="margin-top: 20px" @click="toWorkOrderDetail(item.id)"
            >查看工单</van-button
          >
          <van-button
            round
            type="info"
            size="small"
            style="margin-left: 10px"
            @click="deleteWorkOrder(item.id)"
            >撤销工单</van-button
          >
        </div>
      </div>
    </div>

    <div v-else>
      <div
        style="
              font-size: 14px;
              color: #ddd;
              text-align: center;
              margin-top: 20px;
              background: transparent;
            "
      >
        暂无数据~
      </div>
    </div>

    <!-- <van-tabs @click="tabChange">
      <van-tab
        v-for="(item, key) in tabHeaderList"
        :key="key"
        :title="item.name"
        :name="item.value"
      >
       
      </van-tab>
    </van-tabs> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import VFooter from "@/components/VFooter.vue";
import { getBuyerList } from "@/service/buyer";
import {
  confirmGoods,
  getOrderList,
  getTransFer,
  upDateTransFer,
} from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { getMissionStatus } from "@/lib/helper";
import { Toast } from "vant";
import { setCache } from "@/lib/cache";
import { getWorkList, upDateWorkOrderStatus } from "@/service/order";
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
  isLoading: boolean = true; // 正在加载中
  finished: boolean = false; // 是否完成

  list: any[] = [];

  page: number = 1;
  limit: number = 20;

  debounce(fn: any, timeout = 500) {
    let timer: any;
    const that = this;
    return function() {
      let env = that;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(env, arguments);
      }, timeout);
    };
  }

  searchForm: any = {
    page: 1,
    limit: 20,
    type: "",
    trouble_type: "",
    order_no: "", // 任务编号
    order_number: "", // 订单编号
    user_type: 0,
  };

  statusType = [
    {
      value: "0",
      label: "待处理",
    },
    {
      value: "1",
      label: "跟进中",
    },
    {
      value: "2",
      label: "处理完成",
    },
    {
      value: "3",
      label: "已撤销",
    },
    {
      value: "4",
      label: "拒绝处理",
    },
  ];

  workOrderDataList: any = [
    {
      label: "订单信息错误",
      value: "1",
    },
    {
      label: "好评问题",
      value: "2",
    },
    {
      label: "其他导致卖家损失的行为",
      value: "3",
    },
    {
      label: "任务过程出错",
      value: "4",
    },
    {
      label: "提醒卖家发货",
      value: "5",
    },
  ];

  workOrderDataListOne: any = [
    {
      label: "订单号正确，买号错误",
      value: "1",
    },
    {
      label: "订单未付款",
      value: "2",
    },
    {
      label: "买号正确，订单号错误",
      value: "3",
    },
    {
      label: "收货地址错误",
      value: "4",
    },
    {
      label: "填错订单号",
      value: "5",
    },
    {
      label: "无对应订单或买号信息",
      value: "6",
    },
    {
      label: "用错买号",
      value: "7",
    },
    {
      label: "用错收货地址",
      value: "8",
    },
  ];

  workOrderDataListTwo: any = [
    {
      label: "没有按照要求进行好评",
      value: "1",
    },
    {
      label: "提醒买手确认收货",
      value: "2",
    },
    {
      label: "未写文字好评",
      value: "3",
    },
    {
      label: "未做晒图好评",
      value: "4",
    },
    {
      label: "在评价时给出负面的评价",
      value: "5",
    },
    {
      label: "在评价时给中差评",
      value: "6",
    },
  ];

  workOrderDataListThree: any = [
    {
      label: "分期付款产生手续费损失",
      value: "1",
    },
    {
      label: "花呗支付产生手续费损失",
      value: "2",
    },
    {
      label: "买手从淘宝客进入",
      value: "3",
    },
    {
      label: "农村淘宝支付产生佣金损失",
      value: "4",
    },
    {
      label: "使用花呗支付",
      value: "5",
    },
    {
      label: "使用信用卡支付",
      value: "6",
    },
    {
      label: "使用余额宝分期支付",
      value: "7",
    },
    {
      label: "淘宝客支付产生佣金损失",
      value: "8",
    },
    {
      label: "信用卡支付产生手续费损失",
      value: "9",
    },
    {
      label: "重复转账",
      value: "10",
    },
  ];

  workOrderDataListFour: any = [
    {
      label: "关键字错误",
      value: "1",
    },
    {
      label: "截图错误",
      value: "2",
    },
    {
      label: "买错商品",
      value: "3",
    },
    {
      label: "没有按照指定来路进入",
      value: "4",
    },
    {
      label: "其他出错的行为",
      value: "5",
    },
    {
      label: "提前确认收货",
      value: "6",
    },
    {
      label: "旺聊错误",
      value: "7",
    },
    {
      label: "违背备注",
      value: "8",
    },
    {
      label: "用错设备",
      value: "9",
    },
  ];

  workOrderDataListFive: any = [
    {
      label: "平台和淘宝上都没有发货",
      value: "1",
    },
    {
      label: "平台上发货了，淘宝上没有发",
      value: "2",
    },
    {
      label: "商家未上传好评图片",
      value: "3",
    },
    {
      label: "淘宝上发货了，平台上没有发",
      value: "4",
    },
  ];

  created() {
    const deFn = () => {
      if (getScrollTop() + getWindowHeight() + 30 >= getScrollHeight()) {
        ++this.page;

        const form =
          this.currentStatus !== ""
            ? {
                page: this.page + 1,
                limit: this.limit,
                status: this.currentStatus,
              }
            : {
                page: this.page + 1,
                limit: this.limit,
              };

        getTransFer({
          page: this.page + 1,
          limit: this.limit,
          status: this.currentStatus,
        }).then((data) => {
          if (data && data.data && data.data.list) {
            if (data.data.list.length > 0) {
              this.list = this.list.concat(data.data.list);
              this.page++;
            } else {
              this.end_bottom = true;
            }
          }
        });
      }
    };

    this.search();

    window.addEventListener("scroll", this.debounce(deFn));
  }

  toNext() {
    routerHelper.go(-1);
  }

  getTransFerAction() {
    getTransFer().then((data) => {
      if (data && data.data && data.data.list && data.data.list.length > 0) {
        this.list = data.data.list;
      }
    });
  }

  beforeDestory() {
    console.log("beforeDestory");
    // 卸载掉scroll监听事件
    window.removeEventListener("scroll", () => {}, true);
  }

  listData = [];
  end_bottom = false;

  currentStatus: any = "";
  customServicePublishData: any = [];
  total: number = 0;

  // 获取买手信息
  getBuyerInfo() {
    getBuyerList().then((data) => {});
  }

  search(type: any = "") {
    getWorkList(this.searchForm).then((data: any) => {
      if (data && data.data) {
        if (type) this.customServicePublishData = data.data.list;
        this.customServicePublishData = this.customServicePublishData.concat(
          data.data.list
        );
        this.total = data.data.total;
      }
    });
  }

  handleStatus(status: any) {
    if (this.statusType[status] && this.statusType[status]["label"]) {
      return this.statusType[status]["label"];
    }
  }

  handleType(task_no: number) {
    if (
      this.workOrderDataList[task_no - 1] &&
      this.workOrderDataList[task_no - 1].label
    ) {
      return this.workOrderDataList[task_no - 1].label;
    }
    return "";
  }

  hanleQuesType(e: number, order_no: number) {
    if (e == 1) {
      this.workQuestionData = this.workOrderDataListOne;
    }
    if (e == 2) {
      this.workQuestionData = this.workOrderDataListTwo;
    }
    if (e == 3) {
      this.workQuestionData = this.workOrderDataListThree;
    }
    if (e == 4) {
      this.workQuestionData = this.workOrderDataListFour;
    }
    if (e == 5) {
      this.workQuestionData = this.workOrderDataListFive;
    }

    if (
      this.workQuestionData[order_no - 1] &&
      this.workQuestionData[order_no - 1].label
    ) {
      return this.workQuestionData[order_no - 1].label;
    }

    return "";
  }

  workQuestionData: any = [];

  // 撤销工单
  deleteWorkOrder(id: any) {
    Dialog.confirm({
      title: "提示",
      message: "确定要撤销工单吗？",
    }).then((data) => {
      upDateWorkOrderStatus(id, 3).then((data) => {
        if (data && data.origin_data && data.origin_data.code == 1001) {
          Toast.success("撤销成功");
          this.searchForm.page = 1;
          this.search(1);
        }
      });
    });
  }

  toWorkOrderDetail(id:any){
    routerHelper.to("/workOrderDetailTwo",{
      id
    })
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

.bs-font {
  color: #447ee9;
}

.bs-font-1 {
  color: indianred;
}

.user-order-container {
  min-height: 100vh;
  background: #f2f2f2;
  .user-order-header {
    font-size: 14px;
    box-sizing: border-box;
    background: #fff;
    padding: 0px 10px;
    border: 1px solid #ddd;
    @include flex(flex-start);
    & > div {
      flex: 1;
      @include setHeight(40px);
    }
    .user-order-header_item_active {
      border-bottom: 2px solid #4882f0;
    }
  }

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

  .cast-out-content {
    background: #fff;
    font-size: 14px;
    text-align: left;
    .cast-out-item {
      box-sizing: border-box;
      padding: 20px;
      & > div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
