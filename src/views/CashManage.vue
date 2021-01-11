<template>
  <div class="cash-container">
    <VHeader :msg="'买号管理'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <van-popup v-model="showEditBankCardModal">
      <div class="tip-modal-container">
        <div class="tip-modal-header">
          <span>修改默认银行卡号</span>
          <span @click="closeEditBankCardModal">
            <van-icon name="cross" color="#fff"
          /></span>
        </div>
        <div class="tip-modal-content">
          <p>原提现银行卡</p>
          <p>中国农业银行 尾号 7388</p>
          <div class="tip-modal-content_select_title">选择提现银行卡</div>
          <div>
            <select class="tip-modal-content_select">
              <option
                v-for="(i, index) in bankData"
                :key="index"
                :value="i.value"
              >
                {{ i.label }}
              </option>
            </select>
          </div>

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

    <van-popup v-model="showWarnModal">
      <div class="tip-modal-container-1">
        <div class="tip-modal-header">
          <span>具体如下</span>
          <span @click="closeEditBankCardModal">
            <van-icon name="cross" color="#000" @click="closeWarnModal"
          /></span>
        </div>

        <div class="tip-modal-content">
          <div>
            <div class="tip-modal-content-left">1</div>
            <div class="tip-modal-content-right">
              <p class="tip-font">货款无需提现：</p>
              <p>对于成功提交的订单，货款会由卖家在次日14：00前支付</p>
            </div>
          </div>

          <div>
            <div class="tip-modal-content-left">2</div>
            <div class="tip-modal-content-right">
              <p class="tip-font">佣金提现照旧：</p>
              <p>任务佣金按照原有方式，从平台申请提现。</p>
            </div>
          </div>

          <div>
            <div class="tip-modal-content-left">3</div>
            <div class="tip-modal-content-right">
              <p class="tip-font">货款超时反馈：</p>
              <p>
                如在次日14：00后仍然没有收到货款，请在系统提现记录表格的对应订单处反馈。
              </p>
            </div>
          </div>
        </div>

        <div class="tip-modal-footer">
          <span style="font-weight: bold">备注</span
          >：请登录网银确认货款未到账后再向平台反馈。
        </div>
      </div>
    </van-popup>

    <div class="cash-tip-top zy-font">手机端只显示最近3天的纪录</div>
    <div class="cash-tip-top">
      买家提现须知
      <em class="quest_icon" @click="openWarnModal">?</em>
    </div>

    <div class="cash-bank">
      <div class="bank-card_icon"></div>
      <div class="bank-card_content">
        <p>默认提现银行卡：{{ bankInfo.bank ? bankInfo.bank : "" }}</p>
        <p>
          尾号
          <span class="zy-font">{{
            bankInfo.card_no ? bankInfo.card_no.slice(-4) : ""
          }}</span>
        </p>
      </div>
      <div class="bank-card_btn">
        <div @click="deleteBank" v-if="bankInfo && bankInfo.id && bankInfo.status == 1">删除</div>
        <div v-else-if="bankInfo && bankInfo.id && bankInfo.status == 0">审核中</div>
        <div @click="openEditBankCardModal" v-else>创建</div>
      </div>
    </div>

    <div class="cash-record-item">
      <span>收支明细记录</span>
      <span class="cash-record-right" @click="toMoneyPage">查看全部</span>
    </div>

    <div class="cash-record-item">
      <span>卖家提现记录</span>
      <span class="cash-record-right" @click="toCashOut">查看全部</span>
    </div>

    <div class="cash-record-item">
      <span>平台提现</span>
      <span class="cash-record-right" @click="toApplyPay">前往申请</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import VFooter from "@/components/VFooter.vue";
import { Dialog, ImagePreview, Toast } from "vant";
import { routerHelper } from "@/router";
import { getBank,deleteBank } from "@/service/bank";

@Component({
  components: {
    HelloWorld,
    Header,
    VHeader,
    VFooter,
  },
})
export default class Home extends Vue {
  showSexSheet: boolean = false;
  showWarnModal: boolean = false;

  showEditBankCardModal: boolean = false;

  bankData = [
    {
      label: "光大银行",
      value: "1",
    },
    {
      label: "工商银行",
      value: "2",
    },
    {
      label: "建设银行",
      value: "3",
    },
    {
      label: "中国银行",
      value: "4",
    },
    {
      label: "农业银行",
      value: "5",
    },
    {
      label: "交通银行",
      value: "6",
    },
    {
      label: "招商银行",
      value: "7",
    },
    {
      label: "中信银行",
      value: "8",
    },
    {
      label: "民生银行",
      value: "9",
    },
    {
      label: "广发银行",
      value: "10",
    },
    {
      label: "兴业银行",
      value: "11",
    },
    {
      label: "华夏银行",
      value: "12",
    },
    {
      label: "平安银行",
      value: "13",
    },
    {
      label: "浦发银行",
      value: "14",
    },
    {
      label: "邮政银行",
      value: "15",
    },
  ];

  bankInfo: any = {};

  mounted() {
    getBank().then((data: any) => {
      if (data && data.data && data.data.bank) {
        this.bankInfo = data.data.bank;
      }
    });
  }

  // 删除银行卡
  deleteBank() {
    Dialog.confirm({
      title: "删除",
      message: "是否删除当前银行卡",
    })
      .then(() => {
         deleteBank(this.bankInfo.id).then(data=>{
           if(data && data.origin_data && data.origin_data.code == 1001){
             Toast("删除成功")
             location.reload()
           }
         })
      })
      .catch(() => {
        // on cancel
      });
  }

  openEditBankCardModal() {
    routerHelper.to("/bindBank");
    // this.showEditBankCardModal = true;
  }

  closeEditBankCardModal() {
    this.showEditBankCardModal = false;
  }

  openWarnModal() {
    this.showWarnModal = true;
  }

  closeWarnModal() {
    this.showWarnModal = false;
  }

  toCashOut() {
    routerHelper.to("/cashOut");
  }

  toMoneyPage() {
    routerHelper.to("/chareManage");
  }

  toApplyPay(){
    routerHelper.to("/applyPay")
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

.tip-font {
  color: #447eea;
}

.cash-container {
  width: 100vw;
  height: 100vh;
  text-align: left;
  background: #f2f2f2;
  .cash-tip-top {
    width: 100%;
    @include setHeight(50px);
    font-size: 14px;
    background: #fff;
    box-sizing: border-box;
    padding: 0px 15px;
    margin-bottom: 10px;
  }

  .cash-tip-top-1 {
    width: 100%;
    @include setHeight(50px);
    font-size: 14px;
    background: #fff;
    box-sizing: border-box;
    padding: 0px 15px;
  }

  .quest_icon {
    border: 1px solid red;
    border-radius: 100%;
    width: 15px;
    height: 15px;
    color: red;
    text-align: center;
    line-height: 15px;
    display: inline-block;
  }

  .cash-bank {
    @include flex(flex-start);
    align-items: center;
    box-sizing: border-box;
    padding: 28px 12px;
    background: #fff;
    font-size: 14px;
    .bank-card_icon {
      width: 40px;
      height: 40px;
      background: url(http://img.baishou123.cn/public/wap/img/cash1.png)
        no-repeat center center;
      background-size: 100% 100%;
    }
    .bank-card_content {
      margin-left: 20px;
      flex: 1;
    }
    .bank-card_btn {
      width: 80px;
      & > div {
        width: 80px;
        @include setHeight(30px);
        border-radius: 15px;
        text-align: center;
        color: #fff;
        background: #f90;
      }
    }
  }

  .cash-record-item {
    box-sizing: border-box;
    margin-top: 10px;
    padding: 10px 10px 10px 6px;
    border-left: 4px solid #447eea;
    background: #fff;
    font-size: 14px;
    @include flex(space-between);
    align-items: center;
    .cash-record-right {
      color: #4882f0;
    }
  }
}

.tip-modal-container {
  width: 300px;
  height: auto;
  text-align: left;
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
