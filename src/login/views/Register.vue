<template>
  <div class="forget-container">
    <VHeader :msg="'用户注册'"></VHeader>
    <div class="forget-header">
      <div class="forget-header_item forget-header_item_active">
        注册会员信息
      </div>
    </div>
    <div class="forget-content">
      <van-form @submit="onSubmit">
        <div class="forget-content_item">
          <van-field
            v-model="form.name"
            name="登录会员名"
            label="登录会员名"
            placeholder="登录会员名"
            :rules="[{ required: true, message: '请填写登录会员名' }]"
          />
        </div>

        <div class="forget-content_item">
          <van-field
            v-model="form.phone"
            name="手机号码"
            label="手机号码"
            placeholder="手机号码"
            :rules="[{ required: true, message: '请填写手机号码' }]"
          />
        </div>

        <div class="forget-content_item">
          <div class="forget-verify_code"><van-field
            v-model="form.code"
            name="验证码"
            label="验证码"
            placeholder="验证码"
            :rules="[{ validator: yzmValidator, message: '请填写验证码' }]"
          /></div>
          <div class="forget-verify_content">
            {{showRandom}}
          </div>
        </div>

        <div class="forget-content_item">
          <van-field
            v-model="form.verifyCode"
            name="手机验证码"
            label="手机验证码"
            placeholder="手机验证码"
            :rules="[{ required: false, message: '请填写手机验证码' }]"
          />
        </div>

        <div class="forget-content_item">
          <van-field
            v-model="form.qq"
            name="qq"
            label="qq"
            placeholder="qq"
            :rules="[{ required: false, message: '请填写qq' }]"
          />
        </div>

          <div class="forget-content_item">
          <van-field
            v-model="form.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </div>

        <div class="forget-content_item">
          <van-field
            v-model="form.passwordAgain"
            type="password"
            name="再次输入密码"
            label="再次输入密码"
            placeholder="再次输入密码"
            :rules="[{ validator: pasAgainValidator, message: '两次密码不一致' }]"
          />
        </div>

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import { register } from '@/service/login';
import GVerify from "@/lib/verify"; // @ is an alias to /src
import { setToken } from '@/lib/cache';
import { Toast } from 'vant';

interface IProps {}

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
    password: "",
    passwordAgain:"",
    code: "",
    verifyCode: "",
    type: 0
  };

  resetForm = {
    password: 123,
    passwordAgain: 123,
  };

  showRandom = ""

  beforeCreated() {
    
  }

  mounted() {
    var verifyCode = new GVerify("forget-verify");
    this.renewRandom()
  }

  pasAgainValidator(val:string){
    return !!(val && val == this.form.password)
  }

  yzmValidator(val:string){
    return val == this.showRandom
  }

  generateRandomStr(){
    const num_arr = "0123456789abcdefghijklmnopqrstuvwxyz"
    const res_arr:string[] = []
    while(res_arr.length < 4){
       const t =  Math.floor(Math.random()*(num_arr.length - 1));
       const val = num_arr[t]
      if(!res_arr.includes(val)) res_arr.push(val)
    }
    return res_arr.join("")
  }

  renewRandom(){
    this.showRandom = this.generateRandomStr()
  }

  toReset() {
    this.status = "reset";
  }

  doRegister(){
    register(this.form).then(data=>{
      if(data && data.data && data.data.access_token){
        const access_token = data.data.access_token
        Toast.success({
          message:"恭喜您注册成功",
          onClose(){
             setToken(access_token)
              const origin = location.origin
              window.location.replace(origin)
          }
        })
      }
    })
  }

  // 提交的行为
  onSubmit() {
    console.log("进入到正常节奏")
    this.doRegister()
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

    .forget-content_item{
      width: 340px;
      height: auto;
      margin: 0 auto;
      @include flex(flex-start);
      align-items: center;
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

  .forget-verify_code{
    width: 260px;
  }
  .forget-verify_content{
    flex: 1;
    @include setHeight(30px);
    letter-spacing: 4px;
    text-align: center;
    color:cornflowerblue;
    border: 2px solid #999;
  }
}
</style>
