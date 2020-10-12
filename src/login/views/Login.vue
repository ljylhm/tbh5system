<template>
  <div class="login-container">
    <h2 class="login-text">欢迎来到百手联盟</h2>
    <div class="login-bg"></div>

    <div class="login-form_container">
      <van-cell-group>
        <van-field v-model="form.user" label="账号" placeholder="请输入账号" />
        <van-field
          v-model="form.password"
          label="密码"
          placeholder="请输入密码"
        />
      </van-cell-group>
    </div>

    <div class="login-btn">
      <van-button type="info" size="small">登录</van-button>
      <div class="login-forget_password">忘记密码</div>
    </div>

    <div class="login-register">
      没有账号？
      <span @click="toRegister">去登录</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { routerHelper } from "@/login/router";

interface IProps {}

@Component({
  components: {
    HelloWorld,
  },
})
export default class Login extends Vue<IProps> {
  form = {
    user: "",
    password: "",
  };

  toForget() {
    routerHelper.to("/forget");
  }

  toRegister(){
     routerHelper.to("/register");
  }

  beforeCreated() {
    console.log("进入了这里...");
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

.space-margin-top-30 {
  margin-top: 30px;
}

.login-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 25%;
  .login-text {
    text-align: center;
    font-size: 16px;
    color: #4882f0;
  }
  .login-bg {
    width: 100px;
    height: 100px;
    margin: 20px auto 0px;
    background: url(http://img.baishou123.cn/data/upload/fen/2020-08-08/5f2eb50c0839a.png)
      no-repeat center center;
    background-size: 100% 100%;
  }

  .login-form_container {
    width: 280px;
    height: auto;
    margin: 0 auto;
  }

  .login-btn {
    width: 280px;
    height: auto;
    margin: 12px auto 0px;
    button {
      width: 100%;
    }
    .login-forget_password {
      text-align: right;
      color: #4882f0;
      font-size: 14px;
      margin-top: 12px;
    }
  }

  .login-register{
    position: absolute;
    width: 100%;
    bottom: 20px;
    font-size: 14px;
    text-align: center;
    span{
      color: #4882f0;
    }
  }
}
</style>
