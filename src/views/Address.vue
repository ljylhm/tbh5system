<template>
  <div class="create-account-container">
    <VHeader :msg="'收货信息'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'买号管理'"></VFooter>

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

          <!-- <van-field v-model="" label="收货人" /> -->

          <van-field readonly disabled :value="userInfo.name" label="收货人" />

          <van-field readonly disabled :value="userInfo.phone" label="电话" />

          <van-field
            readonly
            clickable
            name="picker"
            :value="showProvince"
            right-icon="arrow"
            label="省市选择"
            placeholder="点击选择城市"
            @click="showPicker = true"
          />

          <van-field
            v-model="form.address"
            rows="4"
            autosize
            label="详细地址"
            type="textarea"
            maxlength="50"
            placeholder="请输入地址"
            show-word-limit
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

  showProvince: string = "";
  form: any = {
    province: [],
    address: "",
  };
  userInfo: any = {};

  areaList = areaList;

  mounted() {
    getUserInfo().then((data) => {
      if (data && data.origin_data) {
        console.log("接收到的数据", data);
        this.userInfo = data.origin_data.data;
      }
    });
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
    this.showProvince = showProvince;
    this.showPicker = false;
  }

  // 取消选择地址的事件
  cancel() {
    this.showPicker = false;
  }

  toNext() {
    routerHelper.to("/forget");
  }

  onSubmit() {
    if(!this.form.address){
      Toast("请输入地址")
      return
    }

    if(!this.form.province || this.form.province.length <= 0){
      Toast("请输入省市区")
      return
    }
    editUserInfo(this.form).then(data=>{
      if(data && data.origin_data && data.origin_data.code == 1001){
        Toast("修改成功")
        routerHelper.to("/accountManage")
      }
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
    & > div{
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

    .create-account_btn_1 {
      background: #ff9900;
    }

    .create-account_btn_2 {
      background: #4882f0;
    }
  }
}
</style>
