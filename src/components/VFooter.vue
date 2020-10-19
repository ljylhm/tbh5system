<template>
  <div class="footer-container">
    <div class="footer-item" :class='{"footer-item_active": msg == "首页"}'>首页</div>
    <div class="footer-item" :class='{"footer-item_active": msg == "接手管理"}'>接手管理</div>
    <div class="footer-item" :class='{"footer-item_active": msg == "买号管理"}'>买号管理</div>
    <div class="footer-item" :class='{"footer-item_active": msg == "资金管理"}'>资金管理</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  @Prop() private msg!: string; // 感叹号表示必选
  @Prop() private showExitBtn!: boolean; // 感叹号表示必选
}
</script>

<style scoped lang="scss">
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

.footer-container{
    position: fixed;
    font-size: 14px;
    @include setHeight(40px);
    width: 100vw;
    bottom: 0px;
    font-weight: bold;
    @include flex(flex-start);
    & > div{
        flex:1;
        text-align: center;
        background: rgb(72, 130, 240);
        color: #fff;
    }
    .footer-item_active{
        background: rgb(255, 153, 0);
    }
}
</style>
