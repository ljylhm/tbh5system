<template>
  <div class="forget-container">
    <VHeader :msg="'重置密码'"></VHeader>
    <div class="forget-header">
      <div class="forget-header_item forget-header_item_active">
        验证会员信息
      </div>
      <div class="forget-header_item">重置登录密码</div>
    </div>
    <div class="forget-content">
      <van-form @submit="toReset">
        <div class="forget-content_item">
          <van-field
            v-model="form.phone"
            name="手机号"
            label="手机号"
            placeholder="请填写手机号"
            :rules="[{ validator: yzmPhone, message: yzmPhoneMsg }]"
          />
        </div>

        <div class="forget-content_item">
          <van-field
            v-model="form.fir_pass"
            type="password"
            name="密码"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ validator: yzmPassword, message: yzmPasswordMsg }]"
          />
        </div>

        <div class="forget-content_item">
          <van-field
            v-model="form.sec_pass"
            type="password"
            name="重复密码"
            label="重复密码"
            placeholder="请重复密码"
            :rules="[{ validator: yzmPassword2, message: yzmPassword2Msg }]"
          />
        </div>

        <div class="forget-content_item">
          <div class="forget-verify_code">
            <van-field
              v-model="form.verifyCode"
              name="验证码"
              label="验证码"
              placeholder="验证码"
              :rules="[{ validator: yzmValidator, message: '请填写验证码' }]"
            />
          </div>
          <div class="forget-verify_content" @click="renewRandom">
            {{ showRandom }}
          </div>
        </div>

        <div class="forget-content_item"> 
            <div class="login-role" style="font-size: 14px;margin-left:14px">
            <van-radio-group v-model="form.type" direction="horizontal">
              <div class="login-role-tab">选择注册类型</div>
              <van-radio name="0">买手</van-radio>
              <van-radio name="2">推广员</van-radio>
            </van-radio-group>
          </div>
        </div>

     

        <div class="forget-content_item">
          <div class="forget-verify_code">
            <van-field
              v-model="form.code"
              name="手机验证码"
              label="手机验证码"
              placeholder="手机验证码"
              :rules="[{ required: false, message: '请填写手机验证码' }]"
            />
          </div>

          <div class="forget-verify_content_1" @click="getVerifyCode">
            {{ send_msg }}
          </div>
        </div>

        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import GVerify from "@/lib/verify"; // @ is an alias to /src
import { resetPassword, sendMessageV2 } from "@/service/login";
import { Toast } from "vant";
import { clearToken } from "@/lib/cache";
import { routerHelper } from "../router";

interface IProps {}
const phone_rule = /^1[3456789]\d{9}$/;

@Component({
  components: {
    VHeader,
  },
})
export default class Forget extends Vue<IProps> {
  status = "edit";

  form = {
    name: "",
    phone: "",
    code: "",
    fir_pass: "",
    sec_pass: "",
    verifyCode: "",
    type: "0"
  };

  resetForm = {
    password: 123,
    passwordAgain: 123,
  };

  showRandom = "";
  send_msg = "获取验证码";
  sendStatus = 0;

  beforeCreated() {
    console.log("进入了这里...");
  }

  mounted() {
    var verifyCode = new GVerify("forget-verify");
    this.renewRandom();
  }

  renewRandom() {
    this.showRandom = this.generateRandomStr();
  }

  generateRandomStr() {
    const num_arr =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const res_arr: string[] = [];
    while (res_arr.length < 4) {
      const t = Math.floor(Math.random() * (num_arr.length - 1));
      const val = num_arr[t];
      if (!res_arr.includes(val)) res_arr.push(val);
    }
    return res_arr.join("");
  }

  yzmPhone(val: string) {
    if (!val) return false;
    if (!phone_rule.test(val)) return false;
    return true;
  }

  yzmPhoneMsg(val: string) {
    if (!val) return "请输入手机号";
    if (!phone_rule.test(val)) return "请输入正确的手机号";
    return true;
  }

  yzmPassword(val: string) {
    if (!val) return false;
    if (val.length < 6) return false;
    return true;
  }

  yzmPasswordMsg(val: string) {
    if (!val) return "密码不能为空";
    if (val.length < 6) return "密码不能少于6位";
  }

  yzmPassword2(val: any) {
    if (!val) return false;
    if (val.length < 6) return false;
    if (val != this.form.fir_pass) return false;
    return true;
  }

  yzmPassword2Msg(val: string) {
    if (!val) return "密码不能为空";
    if (val.length < 6) return "密码不能少于6位";
    if (val != this.form.fir_pass) return "两次密码输入不一致";
    return true;
  }

  yzmValidator(val: string) {
    return val.toUpperCase() == this.showRandom.toUpperCase();
  }

  yzmValidator1(val: string) {
    return val.toUpperCase() == this.showRandom.toUpperCase();
  }

  getVerifyCode() {
    sendMessageV2(this.form.phone,this.form.type).then((data) => {
      console.log("data data", data);
      if (data && data.origin_data.code == 1001) {
        Toast("发送成功，请注意查收");
        this.sendStatus = 1;
        let count = 60;
        const timer = setInterval(() => {
          this.send_msg = `还有${--count}秒`;
          if (count == 0) {
            clearInterval(timer);
            this.send_msg = "获取验证码";
            this.sendStatus = 0;
          }
        }, 1000);
      }
    });
  }

  toReset() {
    if (!this.form.phone) {
      Toast("请输入手机号");
      return;
    }

    if (!this.form.verifyCode) {
      Toast("请输入图形验证码");
      return;
    }

    if (this.showRandom != this.form.verifyCode) {
      Toast("图形验证码输入不一致，请重新输入");
      return;
    }

    if (!this.form.fir_pass) {
      Toast("请输入新密码");
      return;
    }

    if (!this.form.sec_pass) {
      Toast("请第二次输入新密码");
      return;
    }

    if (!this.form.code) {
      Toast("请输入验证码");
      return;
    }

    resetPassword(this.form,this.form.type).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          Toast("重置密码成功,请重新登录");
          const timer = setTimeout(function () {
            clearToken();
            routerHelper.to("/");
            clearTimeout(timer);
          }, 2500);
        }
      }
    });
  }

  // 提交的行为
  onSubmit() {
    resetPassword(this.form).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          Toast("重置密码成功,请重新登录", {
            onClose: () => {
              clearToken();
              routerHelper.to("/");
            },
          });
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

.forget-container {
  // width: 100%;
  .forget-header {
    width: 100%;
    @include flex(flex-start);
    .forget-header_item {
      @include setHeight(40px);
      font-size: 14px;
      text-align: center;
      color: #000;
      background: #f4f4f4;
      flex: 1;
    }
    .forget-header_item_active {
      background: #ff9900;
      color: #fff;
    }
  }
  .forget-content {
    width: 100%;
    height: auto;
    padding: 20px 0px;
    margin: 0 auto;

    .forget-content_item {
      width: 340px;
      height: auto;
      margin: 0 auto;
    }

    .forget-header {
      @include setHeight(50px);
      font-weight: 600;
      font-size: 18px;
      color: #323232;
      box-sizing: border-box;
      padding: 0px 20px;
      border-bottom: 1px solid #ddd;
    }
    .forget-label {
      width: 880px;
      margin: 20px auto;
      font-size: 14px;
      @include flex(flex-start);
      .forget-label-item {
        text-align: center;
        @include setHeight(40px);
        background: #eee;
        color: #323232;
        flex: 1;
      }
      .forget-label-item-select {
        background: #ff9900;
        color: #ffffff;
      }
    }
    .forget-input {
      padding: 20px 0px 20px 160px;
      .forget-input_item {
        margin: 0 auto 30px;
        font-size: 14px;
        display: inline-block;
        @include flex(flex-start);

        .verify-btn {
          color: #fff;
          background: #409eff;
          padding: 0px 10px;
          border-radius: 2px;
          margin-left: 20px;
          @include setHeight(36px);
          cursor: pointer;
        }

        .forget-input_item_label {
          width: 200px;
          text-align: right;
          @include setHeight(36px);
        }

        .forget-input_item_short {
          width: 200px;
        }

        .forget-input_item_long {
          width: 300px;
        }

        .forget-input_item_content {
          .el-input__inner {
            height: 36px;
            line-height: 36px;
          }
        }

        #forget-verify {
          margin-left: 20px;
        }
      }
      .next-btn {
        margin-left: 200px;
        .el-button--primary {
          width: 280px;
        }
      }
    }
  }
}

.login-role-tab{
  font-size: 14px;
  color: #646566;
  margin-right: 12px;
}
</style>
