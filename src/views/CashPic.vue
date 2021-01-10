<template>
  <div class="user-order-container">
    <VHeader :msg="'查看截图'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <div class="user-order-header-1">
      <div class="user-ordre-next_btn" @click="toNext">返回</div>
    </div>

    <div class="cash-pic-content">
      <div><span class="cash-pic-lable">转账人：</span>{{detailInfo.feedName}}</div>
      <div><span class="cash-pic-lable">转账金额：</span>{{detailInfo.feedMoney}}元</div>
      <div>
        <span class="cash-pic-lable">转账截图：</span
        ><span
          class="zy-font"
          @click="
            openPreview(
              detailInfo.feedImage
            )
          "
          >点击查看大图</span
        >
      </div>
      <div
        class="cash-pic-image"
        style="margin: 0 auto"
        @click="
          openPreview(
             detailInfo.feedImage
          )
        "
      >
        <img
          class="cash-pic-image"
          :src="detailInfo.feedImage"
        />
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
import {
  confirmGoods,
  getOrderList,
  getTransFer,
  upDateTransFer,
} from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { getMissionStatus } from "@/lib/helper";
import { ImagePreview, Toast } from "vant";
import { getCache } from "@/lib/cache";

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

  detailInfo: any = {};

  created() {
     const value = getCache("FEED_VALUE");
    if (value) {
      this.detailInfo = JSON.parse(value)
    }
  }

  openPreview(img: string) {
    ImagePreview([img]);
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
    window.removeEventListener("scroll", () => {},true);
  }

  listData = [];
  end_bottom = false;

  form = {
    type: 1,
    sex: 0,
    img_url: "",
  };

  mapToStatus(status: any) {
    if (status == 0) return "未转账";
    if (status == 1) return "已转账";
    if (status == 2) return "转账失败";
    if (status == 3) return "未到账";
    if (status == 4) return "待您回复";
    if (status == 5) return "转账成功";
  }

  tabHeaderList = [
    {
      name: "全部",
      value: "",
    },
    {
      name: "等待转账",
      value: "0",
    },
    {
      name: "已转账",
      value: "1",
    },
    {
      name: "转账失效",
      value: "2",
    },
    {
      name: "未到账",
      value: "3",
    },
    {
      name: "待您回复",
      value: "4",
    },
    {
      name: "转账成功",
      value: "5",
    },
  ];

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

  currentStatus: any = "";

  tabChange(name: string, title: string) {
    this.currentStatus = name;
    const form =
      this.currentStatus == ""
        ? {}
        : {
            status: name,
          };
    getTransFer(form).then((data) => {
      if (data && data.data && data.data.list) {
        this.list = data.data.list;
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

  searchOrderForm = {
    page: 1,
    limit: 10,
  };

  getUserOrder() {
    getOrderList(this.searchOrderForm).then((data: any) => {
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

  onRefresh() {
    // this.isLoading = false
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  // 更新转账状态
  updateTransFerStatus(id: any, status: any) {
    upDateTransFer(id, status).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.list.forEach((item: any) => {
          if (item.id == id) {
            item.status = status;
          }
        });
      }
    });
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

  toNext() {
    routerHelper.to("/cashOut");
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

  .cash-pic-content {
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
    margin-top: 12px;
    text-align: left;
    background: #fff;
    .cash-pic-lable {
      font-weight: 600;
    }
    .cash-pic-image {
      width: 140px;
      height: 140px;
    }
    & > div {
      margin-bottom: 10px;
    }
  }
}
</style>
