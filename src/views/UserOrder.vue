<template>
  <div class="user-order-container">
    <VHeader :msg="'接手管理'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'接手管理'"></VFooter>

    <!-- <div class="user-order-header">
      <div class="user-order-header_item">审核不通过</div>
      <div class="user-order-header_item">待收货</div>
      <div class="user-order-header_item">待评价</div>
    </div> -->

    <van-tabs @click="tabChange">
      <van-tab
        v-for="(item, key) in tabHeaderList"
        :key="key"
        :title="item"
        :name="key"
      >
        <div class="user-order-content" v-if="listData.length > 0">
          <div
            class="user-content_item"
            v-for="(item, key) in listData"
            :key="key"
          >
            <div>
              <span class="bs-font">{{ getMissionStatus(item.status) }}</span>
              <span style="margin-left: 60px" class="zy-font"
                >({{ getFlowTypes(item.option.flow_type) }})</span
              >
            </div>
            <div>{{ item.order_no }}</div>
            <div>商品单价： {{ Number(item.price) * Number(item.num) }}元</div>
            <div>
              佣金：{{ item.user_fee }}元<span class="zy-font"
                >(请注意下行信息)</span
              >
            </div>
            <div class="zy-font">
              商家代转全部佣金{{ item.user_fee }}元和本金明日到银行卡
            </div>
            <!-- <div>店铺名称：{{ item.shop_name }}</div> -->
            <div>
              接手时间：<span class="zy-font">{{
                dateFormate(item.buyer_time * 1000, "yyyy-MM-dd hh:mm")
              }}</span>
            </div>
            <div>
              买号：{{ item.buyer_name }}
              <span
                class="bs-font-2 zy-font"
                @click="getMissionRemarks(item.description)"
              >
                查看任务备注
              </span>
            </div>
            <div class="zy-font">
              实付:{{ Number(item.price) * Number(item.num) }} 佣金:{{
                item.user_fee
              }}
              实际到账银行卡:{{
                parseFloat(item.user_fee) +
                Number(item.price) * Number(item.num)
              }}
            </div>

            <div class="user-content_item_right">
              <!-- <div class="zy-font">淘宝多商品任务</div> -->
              <div class="bs-font">商家返款</div>

              <div style="margin: 5px" v-if="item.status == 7">
                <van-button
                  type="info"
                  size="small"
                  @click="confirmGoods(item.id, item.task_type, item)"
                  >收货</van-button
                >
              </div>

              <div
                style="margin: 5px"
                v-if="item.status == 0 || item.status == 1"
              >
                <van-button
                  type="info"
                  size="small"
                  @click="startMission(item.id, item.task_type)"
                  >开始任务</van-button
                >
              </div>
              <div v-if="item.status == 0 || item.status == 1">
                <van-button
                  type="info"
                  size="small"
                  color="#ff9900"
                  @click="cancelTask(item.id)"
                  >退出任务</van-button
                >
              </div>
            </div>
          </div>
          <div
            class="user-list_bottom"
            v-if="listData.length > 0 && end_bottom"
          >
            已经到底了~
          </div>
        </div>

        <div class="user-order-no-content" v-else>暂无数据</div>
      </van-tab>
    </van-tabs>

    <!-- <div class="user-order-money">
      <div class="user-order-money_left">合计挣： 本月：10.2</div>
      <div class="user-order-money_right">合计： 1262.300</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import VFooter from "@/components/VFooter.vue";
import { getBuyerList } from "@/service/buyer";
import { cancelOrder, confirmGoods, getOrderList } from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { getMissionStatus } from "@/lib/helper";
import { dateFormate } from "@/lib/time";
import { Dialog, Toast } from "vant";

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

  scrollFn(){

    const deFn = this.debounce(() => {
      if (getScrollTop() + getWindowHeight() + 30 >= getScrollHeight()) {
        ++this.searchOrderForm.page;
        if (this.currentStatus == "") delete this.searchOrderForm.status;
        else {
          this.searchOrderForm.status = this.currentStatus;
        }

        let form = Object.assign({}, this.searchOrderForm);
        if (this.searchOrderForm.status == "") {
          delete form["status"];
        }
        getOrderList(form).then((data: any) => {
          if (data && data.data && data.data.list) {
            if (data.data.list.length > 0) {
              const t = data.data.list.map((item: any) => {
                item.option = JSON.parse(item.option)[0];
                return item;
              });
              this.listData = this.listData.concat(t);
            } else {
              --this.searchOrderForm.page;
              this.end_bottom = true;
            }
          }
        });
      }
    });

      deFn();
  }

  created() {
    this.getBuyerInfo();

    this.getUserOrder();

    
   window.addEventListener("scroll",this.scrollFn);
  }

  destroyed(){
    // 卸载掉scroll监听事件
    const fn = ()=>{
      console.log("移除成功~~");
    }
    window.removeEventListener("scroll",this.scrollFn);
  }

  listData = [];
  end_bottom = false;

  tabHeaderList = [
    "全部",
    "进行中",
    "待发货",
    "待评价",
    "已完成",
    "待完成",
    "已取消",
    "待收货",
  ];

  form = {
    type: 1,
    sex: 0,
    img_url: "",
  };

  flowTypes = [
    {
      value: "1",
      label: "APP自然搜索",
    },
    {
      value: "2",
      label: "PC自然搜索",
    },
    {
      value: "3",
      label: "APP淘口令",
    },
    {
      value: "4",
      label: "APP直通车",
    },
    {
      value: "5",
      label: "PC直通车",
    },
    {
      value: "6",
      label: "抖音任务",
    },
  ];

  currentStatus: string = "";

  // 取消任务
  cancelTask(id: any) {
    cancelOrder(id).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.getUserOrder();
        this.listData = [];
        Toast("退出成功");
      }
    });
  }

  tabChange(name: string, title: string) {
    this.currentStatus = name;
    this.searchOrderForm.page = 1;
    if (this.currentStatus === "") delete this.searchOrderForm.status;
    else {
      this.searchOrderForm.status = this.currentStatus;
    }
    let form = Object.assign({}, this.searchOrderForm);
    if (this.searchOrderForm.status == "") {
      delete form["status"];
    }
    getOrderList(form).then((data: any) => {
      if (data && data.data && data.data.list) {
        const t = data.data.list.map((item: any) => {
          item.option = JSON.parse(item.option)[0];
          return item;
        });
        this.listData = t;
      } else {
        --this.searchOrderForm.page;
        this.end_bottom = true;
      }
    });
  }

  getFlowTypes(id: string) {
    const data = this.flowTypes.filter((item) => item.value == id);
    if (data.length > 0) return data[0].label;
  }

  // 跳到创建买手号网页
  toCreateAccount(type: number) {
    routerHelper.to("/createAccount", {
      type,
    });
  }

  // 获取买手信息
  getBuyerInfo() {
    getBuyerList().then((data) => {});
  }

  searchOrderForm: any = {
    page: 1,
    limit: 10,
    status: "",
  };

  getUserOrder() {
    let form = Object.assign({}, this.searchOrderForm);
    if (this.searchOrderForm.status == "") {
      delete form["status"];
    }

    getOrderList(form).then((data: any) => {
      if (data && data.data && data.data.list) {
        if (data.data.list.length > 0) {
          const t = data.data.list.map((item: any) => {
            item.option = JSON.parse(item.option)[0];
            return item;
          });
          this.listData = this.listData.concat(t);
        } else {
          this.end_bottom = true;
        }
      }
    });
  }

  // 查看任务备注
  getMissionRemarks(message: string) {
    Dialog({
      title: "任务备注",
      message,
    });
  }

  onRefresh() {
    // this.isLoading = false
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  startMission(id: number, task_type: any) {
    if (task_type == 0) {
      routerHelper.to("/SaleMission", {
        id,
      });
    } else if (task_type == 1) {
      routerHelper.to("/FlowMission", {
        id,
      });
    }
  }

  // 取消任务
  cancelMission() {}

  getMissionStatus(id: any) {
    return getMissionStatus(id);
  }

  confirmGoods(id: any) {
    confirmGoods(id).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        Toast.success("收货成功");
        this.listData = [];
        this.getUserOrder();
      }
    });
  }

  dateFormate(time: string, fmt: string) {
    return dateFormate(time, fmt);
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

  .user-order-no-content {
    font-size: 14px;
    color: #ddd;
    text-align: center;
    margin-top: 20px;
    background: transparent;
  }

  .user-list_bottom {
    text-align: center;
    padding: 15px 0px;
    font-size: 14px;
    color: #ddd;
  }
}
</style>
