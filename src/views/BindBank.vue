<template>
  <div class="create-account-container">
    <VHeader :msg="'银行卡管理'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <van-popup
      v-model="showPicker"
      position="bottom "
      :style="{ height: '50%' }"
    >
      <van-area
        title="标题"
        :area-list="areaList"
        :columns-num="3"
        @confirm="confirm"
        @cancel="cancel"
      />
    </van-popup>

    <van-popup
      v-model="showBankPicker"
      position="bottom "
      :style="{ height: '50%' }"
    >
      <van-picker
        title="标题"
        show-toolbar
        :columns="bindBankData"
        @confirm="confirmBank"
        @cancel="cancelBank"
      />
    </van-popup>

    <div class="create-account-content">
      <div class="create-account-form">
        <van-form @submit="onSubmit">
          <!-- <van-field
            readonly
            clickable
            name="picker"
            :value="showProvince"
            right-icon="arrow"
            label="收货人"
            placeholder="点击选择城市"
            @click="showPicker = true"
          /> -->

          <van-field
            readonly
            clickable
            name="picker"
            :value="bindForm.bank "
            right-icon="arrow"
            label="银行"
            placeholder="点击选择银行"
            @click="showBankPicker = true"
          />

          <van-field v-model="bindForm.name" label="开户人" placeholder="请输入开户人" />

          <van-field v-model="bindForm.card_no" label="银行卡号" placeholder="请输入银行卡号" />

          <van-field
            readonly
            clickable
            name="picker"
            :value="bindForm.address"
            right-icon="arrow"
            label="开户地"
            placeholder="点击选择城市"
            @click="showPicker = true"
          />

          <van-field v-model="bindForm.bank_address" label="开户行" placeholder="开户行" />

          <van-field
            v-model="bindForm.pay_password"
            label="支付密码"
            type="password"
            placeholder="请输入支付密码"
          />
        </van-form>

        <div class="create-account-operation">
          <div
            class="create-account_btn create-account_btn_1"
            @click="onSubmit"
          >
            确定提交
          </div>
          <div class="create-account_btn create-account_btn_2" @click="toNext">
            返回
          </div>
        </div>
      </div>
    </div>

    <div class="create-account-tip">
      <div>1.请务必保持此处收货信息与购物的收货信息保持一致</div>
      <div>2.如因此处信息与购物的收货信息不一致所造成的损失，由您自行承担</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import VFooter from "@/components/VFooter.vue";
import { ImagePreview, Toast } from "vant";
import { upLoadImage } from "@/lib/uploadImage";
import { routerHelper } from "@/router";
import { completeImgUrl } from "@/lib/helper";
import { addBuyer, editUserInfo } from "@/service/buyer";
import { openAlertError } from "@/lib/notice";

import areaList from "@/lib/area";
import RouterHelper from "@/lib/router";
import { getUserInfo } from "@/service/login";
import { addBank } from "@/service/bank";

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
  platType: any = 1;
  showPicker = false;
  showBankPicker = false;

  showProvince: string = "";
  showBank: string = "";
  form: any = {
    province: [],
    address: "",
  };
  userInfo: any = {};

  areaList = areaList;

  bindForm: any = {
    bank: "",
    card_no: "",
    name: "",
    address: "",
    pay_password: "",
    bank_address: ""
  };

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
    },{
      label: "深圳发展银行",
      value: "16",
    },{
      label: "恒丰银行",
      value: "17",
    },{
      label:"浙商银行",
      value: "18",
    },{
      label:"渤海银行",
      value: "19",
    }
  ];

  bindBankData: string[] = [];

  mounted() {
    getUserInfo().then((data) => {
      if (data && data.origin_data) {
        console.log("接收到的数据", data);
        this.userInfo = data.origin_data.data;
      }
    });

    this.bindBankData = this.bankData.map((item: any) => item.label);
    console.log("xxxxx", this.bindBankData);
  }

  confirmBank(data: any) {
    this.showBank = data;
    this.bindForm.bank = data
    this.showBankPicker = false;
  }

  cancelBank() {
    this.showBankPicker = false;
  }

  // 确认选择地址的事件
  confirm(data: any) {
    let showProvince: string = "";
    if (data && data.length > 0) {
      this.form.province = [];
      data.forEach((item: any) => {
        showProvince = showProvince + item.name + " ";
        this.form.province.push(item.name);
      });
    }
    this.bindForm.address = showProvince
    this.showProvince = showProvince;
    this.showPicker = false;
  }

  // 取消选择地址的事件
  cancel() {
    this.showPicker = false;
  }

  toNext() {
    routerHelper.to("/cashManage");
  }

  onSubmit() {

    if (!this.bindForm.bank) {
      Toast("请选择银行");
      return;
    }

    if (!this.bindForm.name) {
      Toast("请输入开户人");
      return;
    }

    if (!this.bindForm.card_no) {
      Toast("请输入银行卡");
      return;
    }

    if (!this.bindForm.address) {
      Toast("请输入开户地");
      return;
    }

    if (!this.bindForm.pay_password) {
      Toast("请输入支付密码");
      return;
    }
    addBank(this.bindForm).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        Toast("修改成功");
        routerHelper.to("/cashManage");
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

.create-account-container {
  .create-account-content {
    box-sizing: border-box;
    padding-left: 20px;
  }
  .create-account-tip {
    border: 1px dashed #ddd;
    width: 345px;
    font-size: 12px;
    text-align: left;
    box-sizing: border-box;
    padding: 10px;
    margin: 20px auto;
    font-weight: 600;
    & > div {
      margin-bottom: 5px;
    }
  }
  .create-account-form {
    color: #000;
    text-align: left;
    .create-account-item {
      @include flex(flex-start);
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      .create-account-item_label {
        width: 100px;
      }
      .create-account-item_input {
        flex: 1;
        margin-left: 15px;
        text-align: left;
        input {
          width: 200px;
          height: 34px;
          border: 1px solid #ddd;
          padding: 0px 5px;
        }
        input::-webkit-input-placeholder {
          font-size: 12px;
        }
      }
    }

    .create-account-image {
      font-size: 14px;
      padding-top: 10px;
      text-align: left;
      .create-account-image_content {
        margin-top: 10px;
        @include flex(flex-start);
      }
      .create-account-image_pic {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .create-account-operation {
    @include flex(center);
    align-items: center;
    margin-top: 10px;

    .create-account_btn {
      width: 100px;
      @include setHeight(30px);
      text-align: center;
      margin-right: 10px;
      border-radius: 15px;
      color: #fff;
      font-size: 14px;
    }

    .create-bank_btn_1 {
      background: #ff9900;
    }

    .create-account_btn_2 {
      background: #4882f0;
    }
  }
}
</style>
