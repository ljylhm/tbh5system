<template>
  <div class="user-order-container">
    <VHeader :msg="'评价任务'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'首页'"></VFooter>

    <div class="user-order-content">
      <van-tabs @click="tabChange">
        <van-tab
          v-for="(item, index) in tabHeaderList"
          :key="index"
          :title="item.label"
          :name="item.value"
        >
          <div v-if="listData.length > 0">
            <div
              class="user-content_item"
              v-for="(item, key) in listData"
              :key="key"
            >
              <div>
                任务：<span class="zy-font">{{ item.order_no || "--" }}</span>
              </div>
              <div>
                价格：<span class="zy-font">{{ item.price || "--" }}</span
                >元
              </div>
              <div>
                佣金：<span class="zy-font">{{
                  item.evaluate_fee || "--"
                }}</span
                >元
              </div>
              <div>
                创建时间: <span class="zy-font">{{ item.created_at }}</span>
              </div>
              <div
                style="text-align: right"
                v-if="item.is_evaluate == 1 || item.is_evaluate == 4"
              >
                <van-button
                  type="primary"
                  color="#4882f0"
                  round
                  size="small"
                  @click="toCommentList(item.order_id)"
                  >评价任务</van-button
                >
              </div>

              <div
                style="text-align: right"
                v-if="item.is_evaluate == 9 || item.is_evaluate == 10"
              >
                <van-button
                  type="primary"
                  color="#4882f0"
                  round
                  size="small"
                  @click="feedBack(item.order_id)"
                  >反馈</van-button
                >
              </div>
            </div>
          </div>

          <div v-else class="no-list-content">暂无数据</div>
        </van-tab>
      </van-tabs>
      <div class="user-list_bottom" v-if="listData.length > 0 && end_bottom">
        已经到底了~
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
  cancelOrder,
  confirmGoods,
  feedBack,
  getCommentList,
  getOrderList,
} from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { getMissionStatus } from "@/lib/helper";
import { Toast } from "vant";

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

  created() {
    this.getBuyerInfo();

    this.getUserOrder();

    const deFn = () => {
      if (getScrollTop() + getWindowHeight() + 30 >= getScrollHeight()) {
        ++this.searchOrderForm.page;
        getOrderList(this.searchOrderForm).then((data: any) => {
          if (data && data.data && data.data.list) {
            if (data.data.list.length > 0) {
              this.listData = this.listData.concat(data.data.list);
            } else {
              --this.searchOrderForm.page;
              this.end_bottom = true;
            }
          }
        });
      }
    };

    window.addEventListener("scroll", this.debounce(deFn));
  }

  beforeDestory() {
    console.log("beforeDestory");
    // 卸载掉scroll监听事件
    window.removeEventListener("scroll", () => {}, true);
  }

  listData = [];
  end_bottom = false;

  tabHeaderList = [
    {
      label: "所有任务",
      value: "-1",
    },
    // {
    //   label: "未设置评价",
    //   value: "0",
    // },
    {
      label: "等待评价",
      value: "1",
    },
    {
      label: "商家待审核评价",
      value: "2",
    },
    {
      label: "管理员待审核评价",
      value: "3",
    },
    {
      label: "等待追评",
      value: "4",
    },
    {
      label: "商家待审核追评",
      value: "5",
    },
    {
      label: "管理员待审核追评",
      value: "6",
    },
    {
      label: "完成评价",
      value: "7",
    },
    {
      label: "完成追评",
      value: "8",
    },
    {
      label: "评价不通过",
      value: "9",
    },
    {
      label: "追评不通过",
      value: "10",
    },
    {
      label: "已取消评价",
      value: "11",
    },
    {
      label: "已取消追评",
      value: "12",
    },
    {
      label: "已忽略评价",
      value: "13",
    },
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

  toCommentList(id: any) {
    routerHelper.to("/CommentMission", {
      id,
    });
  }

  feedBack(id: any) {
    feedBack(id).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        Toast("已经反馈");
        getCommentList(this.searchOrderForm).then((data: any) => {
          if (data && data.data && data.data.list) {
            if (data.data.list) {
              this.listData = data.data.list;
            } else {
              this.end_bottom = true;
            }
          }
        });
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
    is_evaluate: -1,
  };

  getUserOrder() {
    getCommentList(this.searchOrderForm).then((data: any) => {
      console.log("获取评价的数据", data);
      if (data && data.data && data.data.list) {
        if (data.data.list.length > 0) {
          // const t = data.data.list.map((item: any) => {
          //   item.option = JSON.parse(item.option)[0];
          //   return item;
          // });
          this.listData = this.listData.concat(data.data.list);
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

  tabChange(name: any, title: any) {
    this.searchOrderForm = {
      limit: 10,
      page: 1,
      is_evaluate: name,
    };
    getCommentList(this.searchOrderForm).then((data: any) => {
      if (data && data.data && data.data.list) {
        if (data.data.list) {
          this.listData = data.data.list;
        } else {
          this.end_bottom = true;
        }
      }
    });
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

  .user-list_bottom {
    text-align: center;
    padding: 15px 0px;
    font-size: 14px;
    color: #ddd;
  }

  .no-list-content {
    font-size: 14px;
    color: #ddd;
    text-align: center;
    padding-top: 12px;
  }
}
</style>
