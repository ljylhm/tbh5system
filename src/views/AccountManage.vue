<template>
  <div class="buyer-container">
    <VHeader :msg="'买号管理'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'买号管理'"></VFooter>
    <div class="buyer-item">
      <div class="buyer-item_left"></div>
      <div class="buyer-item_middle">
        <div>淘宝：<span class="zy-font">审核通过</span></div>
        <div>买号：<span style="color:#000">钢铁侠</span></div>
      </div>
      <div class="buyer-item_right">
        <div class="buyer-item_btn">添加</div>
      </div>
    </div>

    <div class="buyer-item">
      <div class="buyer-item_left buyer-item_left_jd"></div>
      <div class="buyer-item_middle">
        <div>淘宝：<span class="zy-font">审核通过</span></div>
        <div>买号：<span style="color:#000">钢铁侠</span></div>
      </div>
      <div class="buyer-item_right">
        <div class="buyer-item_btn">添加</div>
      </div>
    </div>

    <div class="buyer-item">
      <div class="buyer-item_left buyer-item_left_common"></div>
      <div class="buyer-item_middle">
        <div>拼多多：<span class="zy-font">审核通过</span></div>
        <div>买号：<span style="color:#000">钢铁侠</span></div>
      </div>
      <div class="buyer-item_right">
        <div class="buyer-item_btn">添加</div>
      </div>
    </div>

    <div class="buyer-item">
      <div class="buyer-item_left buyer-item_left_common"></div>
      <div class="buyer-item_middle">
        <div>收货地址：<span class="zy-font">已填写</span></div>
        <div>地址：</div>
      </div>
      <div class="buyer-item_right">
        <div class="buyer-item_btn">添加</div>
      </div>
    </div>

    <div class="buyer-tip_container">
      <div class="buyer-tip_title">
        <em></em>
        <h3>审核标准</h3>
      </div>

      <div class="buyer-tip_list">
          <p>● 每人只能绑定1个淘宝帐号</p>
          <p>● 淘宝帐号的实名信息与平台信息一致；</p>
          <p>● 信誉级别≥3心、注册时长≥1年、买号周平均信誉值≤3、支付宝关联账户数≤2；</p>
          <p>● 淘宝买号审核通过后可继续添加京东和拼多多买号。</p>
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

@Component({
  components: {
    HelloWorld,
    Header,
    VHeader,
    VFooter,
  },
})
export default class Home extends Vue {}
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

.buyer-container {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  .buyer-item {
    box-sizing: border-box;
    padding: 20px 10px;
    background: #fff;
    margin-bottom: 10px;
    @include flex(flex-start);
    align-items: center;
    font-size: 14px;
    .buyer-item_btn {
      width: 64px;
      @include setHeight(30px);
      text-align: center;
      background: #f90;
      border-radius: 16px;
      color: #fff;
    }
    .buyer-item_left {
      width: 40px;
      height: 40px;
      background: url(http://img.baishou123.cn/public/wap/img/taobao1.png)
        no-repeat center center;
      background-size: 100% 100%;
    }
    .buyer-item_left_jd {
      background: url(http://img.baishou123.cn/public/wap/img/jingdong2.png)
        no-repeat center center;
      background-size: 100% 100%;
    }
    .buyer-item_left_common {
      background: url(http://img.baishou123.cn/public/wap/img/pingjia3.png)
        no-repeat center center;
      background-size: 100% 100%;
    }

    .buyer-item_middle {
      flex: 1;
      height: 100%;
      text-align: left;
      margin-left: 15px;
    }
    .buyer-item_right {
      width: 80px;
      height: 100%;
    }
  }

  .buyer-tip_container {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px 10px 30px;
    background: #fff;
    .buyer-tip_title {
      @include flex(flex-start);
      align-items: center;  
      em {
        width: 4px;
        height: 13px;
        background: #f90;
        margin: 0px 5px 0px 0px;
        border-radius: 5px;
      }
      h3{
         font-size: 14px; 
      }
      text-align: left;
      
    }
    .buyer-tip_list{
        height: auto;
        overflow-y: auto;
        border: 2px dashed #ddd;
        width: 100%;
        padding: 2%;
        margin-top: 10px;
        line-height: 22px;
        text-align: left;
        font-size: 14px;
    }
  }
}
</style>
