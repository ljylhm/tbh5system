<template>
  <div class="user-order-container">
    <VHeader :msg="'提现申请'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <div class="user-order-header-1">
      <div class="user-ordre-next_btn" @click="toNext">返回</div>
    </div>

    <div class="apply-pay-content">
      <div>存款余额：{{ userData.amount || "0.00" }}元</div>
      <div>提现方式：银行卡</div>
      <div>提款金额：</div>
      <div class="apply-pay-input">
        <input
          placeholder="请输入提现金额"
          v-model="advanceForm.amount"
          type="number"
        />
      </div>
      <div>输入密码：</div>
      <div class="apply-pay-input">
        <input
          type="password"
          placeholder="请输入支付密码"
          v-model="advanceForm.pay_password"
        />
      </div>
      <div>
        <div class="apply-pay-btn" @click="advanceAction">确认提现</div>
      </div>
    </div>

    <div class="apply-pay-list">
      <div class="apply-pay-list-header">提现记录</div>
      <div class="apply-pay-list-content" v-if="list.length > 0">
        <table border="1" color="#ddd" width="100%">
          <thead style="background: #f2f2f2">
            <td class="apply-pay-list-1">提现金额</td>
            <td class="apply-pay-list-2">申请时间</td>
            <td class="apply-pay-list-3">提现状态</td>
          </thead>
          <tbody>
            <tr v-for="(item,key) in list" :key="key">
              <td class="apply-pay-list-1 zy-font">
                {{item.amount}}元
              </td>
              <td class="apply-pay-list-2">{{item.created_at}}</td>
              <td class="apply-pay-list-3">{{
                item.status == "0" ? "待审核" : item.status == "1" ? "已到账" : "提现失败"
              }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else style="text-align:center;color:#ddd;font-size:14px;padding:15px 0px">
        暂无提现记录
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

  userData: any = {};

  list: any[] = [];

  created() {
    getUserInfo().then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.userData = data.data;
      }
    });
    this.getAdvanceList()
  }

  advanceAction() {
    if (!this.advanceForm.amount) {
      Toast("请输入提现金额");
      return;
    }

    if (!this.advanceForm.pay_password) {
      Toast("请输入支付密码");
      return;
    }

    advanceAction(this.advanceForm).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          Toast.success("提现成功");
        } else {
          Toast(data.origin_data.msg || "提现失败");
        }
      } else {
        Toast("提现失败");
      }
    });
  }

  getAdvanceList() {
    getAdvanceList().then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.list = data.data.list;
      }
    });
  }

  advanceForm = {
    pay_password: "",
    amount: "",
  };

  toNext() {
    routerHelper.to("/cashManage");
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
    .apply-pay-input {
      border: 1px solid #ddd;
      font-size: 14px;
      padding: 10px;
      & input {
        width: 100%;
      }
    }
    .apply-pay-btn {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #457ee8;
      display: block;
      color: #fff;
      margin-top: 20px;
      font-size: 18px;
      border-radius: 25px;
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
