<template>
  <div class="guide-container">
      <div class="guide-tip" v-if="showTips">
          <p>请点击右上角</p>
          <p>在浏览器中打开</p>
      </div>

      <div class="guide-icon"></div>

      <div class="guide-desc">
          <div class="guide-andr-icon"></div>
          <div class="guide-andr-title">
              权重高
          </div>
      </div>

      <div class="guide-opts">
          <p>V1.0.5  (build V1.0.5) - 5.1MB</p>
          <p>更新于 2021-2-8</p>
      </div>

      <div class="guide-btn" v-if="showTips">
          不支持在微信内下载安装
      </div>

      <div class="guide-btn" v-else @click="downLoadApk">
          点击下载
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
import { isWx } from "@/lib/userAgent";
import { routerHelper } from "../router";

interface IProps {}
const phone_rule = /^1[3456789]\d{9}$/;

@Component({
  components: {
    VHeader,
  },
})
export default class Guide extends Vue<IProps> {
  
  showTips:boolean = false
  mounted() {
      this.showTips = isWx()
  }

  // 下载apk
  downLoadApk(){
      location.href = "http://quanzhonglianmeng.com/uploads/quanzhonggao.apk"
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

.guide-container{
    box-sizing: border-box;
    padding-top: 200px;
    .guide-tip{
        position: fixed;
        top: 20px;
        right: 5px;
        width: 140px;
        min-height: 60px;
        background: #708090;
        border-radius: 10px;
        box-sizing: border-box;
        color: #fff;
        padding: 15px;
        font-size: 14px;
        &::after{
            content: "";
            width: 0;
			height: 0;
			border: 10px solid;
			position: absolute;
			top: -19px;
			right: 20px;
			border-color:  transparent transparent #708090;
        }
    }

    .guide-icon{
        width: 80px;
        height: 80px;
        margin: 0 auto;
        background: url(https://i.yimenyun.net/image/238005/logo/xxr50598634395.png?x-oss-process=image/resize,limit_0,m_fixed,w_96,h_96/rounded-corners,r_16/format,png) no-repeat center center;
        background-size: 100% 100%;
    }

    .guide-desc{
        @include flex(center);
        align-items: center;
        width: 200px;
        margin: 30px auto 0px;
        color: #708090;
        .guide-andr-icon{
            width: 40px;
            height: 40px;
            background: url(https://imgqn.smm.cn/production/b/image/IbOBQ20210222160200.png) no-repeat center center;
            background-size: 100% 100%;
            margin-right: 20px;
        }
        .guide-andr-title{
            font-weight: 600;         
        }

    }

    .guide-opts{
        margin-top: 20px;
        color: #708090;
        text-align: center;
        p{
            margin-bottom: 10px;
        }
    }

    .guide-btn{
        width: 220px;
        padding: 15px 0px;
        border-radius: 25px;
        margin: 20px auto 0px;
        background: #708090;
        text-align: center;
        color: #fff;
        font-size: 14px;
    }

    
}
</style>
