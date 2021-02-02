<template>
  <div class="user-order-container">
    <VHeader :msg="'邀请奖励记录'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <div class="user-order-header-1">
      <div class="user-ordre-next_btn" @click="toNext">返回</div>
    </div>

    <div class="user-order-content">
      <div
        class="user-content_item_1"
        v-for="(item, key) in listData"
        :key="key"
      >
        <div style="color: #447ee9; font-weight: 800">
          {{ item.description || "--" }}
        </div>
        <div>消费Id：{{ item.charge_no }}</div>
        <div>任务编号：{{ item.task_id || "" }}</div>
        <div>
          佣金：<span class="zy-font">{{ item.amount || "0.00" }}元</span>
        </div>
        <div>剩余佣金：{{ item.next_amount || "0.00" }}元</div>
        <div>
          备注：<span class="zy-font">{{ item.description || "--" }}</span>
        </div>
        <div>消费时间： {{ item.created_at }}</div>
      </div>
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
import { confirmGoods, getChareList, getOrderList } from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { getInviteChargeList } from "@/service/invite";
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

  page: number = 1;
  limit: number = 20;

  debounce(fn:any, timeout = 500) {
      let timer:any
      const that = this
      return function () {
          let env = that
          clearTimeout(timer)
          timer = setTimeout(function () {
              fn.apply(env, arguments);
          }, timeout)
      }
  }

  created() {
    this.getChareList();

    window.addEventListener("scroll",this.debounce(()=>{
       if (getScrollTop() + getWindowHeight() + 30 >= getScrollHeight()) {
        const page = this.page + 1
        const form = {
          page: page,
          limit: 20,
        };
        getInviteChargeList(form).then((data:any) => {
          if (data && data.origin_data) {
            if (data.origin_data.code == 1001) {
              if(data.data.list.length > 0){
                this.listData = this.listData.concat(data.data.list)
              }else{
                this.end_bottom = true
              }
            }
          }
        });
      }
    }));
  }

  beforeDestory() {
    console.log("beforeDestory");
    // 卸载掉scroll监听事件
    window.removeEventListener("scroll", () => {},true);
  }

  getChareList() {
    getInviteChargeList().then((data:any) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          this.listData = data.data.list;
        }
      }
    });
  }

  listData = ["1"];
  end_bottom = false;

  toNext() {
    routerHelper.to("/");
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
  padding-bottom: 40px;
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
    .user-content_item_1 {
      margin: 10px 0px;
      box-sizing: border-box;
      padding: 10px 20px;
      text-align: left;
      background: #fff;
      font-size: 14px;
      position: relative;
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
}
</style>
