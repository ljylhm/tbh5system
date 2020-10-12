<template>
  <div class="home">
       <van-button type="primary" size="mini">主要按钮</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    Header,
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

.home {
  .home-banner_container {
    width: 100%;
    height: 400px;
    position: relative;
    background: url(http://img.baishou123.cn/data/upload/fen/2020-08-08/5f2eb50562970.png)
      no-repeat center;
    background-size: 100% 100%;
    .home-board-container {
      position: absolute;
      height: auto;
      top: 40px;
      right: 200px;
      background: #fff;
      .home-board_item {
        width: 300px;
        @include setHeight(50px);
        color: #000;
        @include flex(flex-start);
        align-items: center;
        border-bottom: 1px solid #dcdfdf;
        .home-board_item_logo {
          width: 15px;
          height: 15px;
          margin: 0px 15px;
          border-radius: 50%;
          border: 1px solid #ddd;
        }
        .home-board_item_content {
          // font-weight: 600;
        }
      }
      .home-board_search {
        width: 100%;
        height: 60px;
        position: relative;
        color: #fff;
        background: #081535;

        .home-board_search_content {
          width: 100%;
          height: 100%;
          text-align: left;
          padding-left: 40px;
          @include setHeight(60px);
        }
        .home-board_search_board {
          position: absolute;
          width: 80px;
          text-align: center;
          cursor: pointer;
          height: 100%;
          top: 0px;
          right: 0px;
          box-sizing: border-box;
          padding: 12px 20px;
          color: #fff;
          background: red;
        }
      }
    }
  }

  .ad-container {
    margin-top: 20px;
    @include flex(center);
    .ad-content {
      width: 1200px;
      @include flex(space-between);
      .ad-item {
        width: 570px;
        .ad-item_header {
          @include setHeight(40px);
          background: #4882f0;
          color: #fff;
          font-size: 14px;
        }
        .ad-item_content {
          @include flex(space-between);
          border: 1px solid #ddd;
          padding: 20px;
          .ad-logo_item {
            width: 110px;
            height: 120px;
            background: #eee;
            cursor: pointer;
            .ad-logo_item_pic {
              margin-top: 30px;
              & > i {
                font-size: 30px;
              }
            }
            .ad-logo_item_content {
              text-align: center;
              color: #000;
              margin-top: 12px;
              font-size: 14px;
              &:hover{
                color: #4882f0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
