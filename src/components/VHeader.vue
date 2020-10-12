<template>
  <div class="header-container">
    <div class="header-logo"></div>
    <div class="header-text">
        {{msg}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  @Prop() private msg!: string; // 感叹号表示必选
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

.header-container {
  width: 100%;
  height: 40px;
  padding: 0px 20px;
  background: #f2f2f2;
  @include flex(flex-start);
  margin-bottom: 12px;
  .header-logo {
    width: 100px;
    height: 40px;
    background: url(http://img.baishou123.cn/data/upload/fen/2020-08-08/5f2eb510e1aa5.png)
      no-repeat center;
    background-size: 100% 100%;
  }
  .header-text{
      padding-left: 20px;
      @include setHeight(40px)
  }
}
</style>
