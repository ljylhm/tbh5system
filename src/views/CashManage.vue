<template>
  <div class="cash-container">
    <VHeader :msg="'买号管理'" :showExitBtn="true"></VHeader>
    <div class="cash-tip-top zy-font">手机端只显示最近3天的纪录</div>
    <div class="cash-tip-top">卖家提现须知
        <em class="quest_icon">?</em>
    </div>

    <div class="cash-bank">
        <div class="bank-card_icon"></div>
        <div class="bank-card_content">
            <p>默认提现银行卡</p>
            <p>中国农业银行 尾号 8270</p>
        </div>
        <div class="bank-card_btn">
            <div></div>
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
import { ImagePreview } from "vant";

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

  .cash-tip-top-1{
      width: 100%;
      @include setHeight(50px);
      font-size: 14px;
      background: #fff;
      box-sizing: border-box;
      padding: 0px 15px;
  }

  .quest_icon{
    border: 1px solid red;
    border-radius: 100%;
    width: 15px;
    height: 15px;
    color: red;
    text-align: center;
    line-height: 15px;
    display: inline-block;
  }

  .cash-bank{
      @include flex(flex-start);
      align-items: center;
      box-sizing: border-box;
      padding: 28px 12px;
      background: #fff;
      .bank-card_icon{
          width: 20px;
          height: 20px;
          background: url(http://img.baishou123.cn/public/wap/img/cash1.png) no-repeat center center;
          background-size: 100% 100%;
      }
      .bank-card_content{

      }
      .bank-card_btn{

      }
  }
}
</style>
