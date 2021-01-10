<template>
  <div class="flow-mission-container">
    <VHeader :msg="'评价任务'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'接手管理'"></VFooter>

    <div class="flow-mission-pic">
      <img :src="missionDetailInfo.main_url" />
    </div>

    <div class="comment-mission-container">
      <div class="comment-mission-item">
        搜索关键字:
        <span class="zy-font">{{
          missionDetailInfo.option.keyword || "--"
        }}</span>
      </div>

      <div class="comment-mission-item">
        店铺名:
        <span class="zy-font">{{ missionDetailInfo.shop_name || "--" }}</span>
      </div>

      <div class="comment-mission-item">
        好评类型:
        <span class="zy-font">{{
          missionDetailInfo.option.keyword || "--"
        }}</span>
      </div>

      <div class="comment-mission-item">
        佣金:
        <span class="zy-font">{{
          missionDetailInfo.is_evaluate == 4
            ? missionDetailInfo.evaluate_fee_go
            : missionDetailInfo.evaluate_fee
        }}</span>
      </div>

      <div class="comment-mission-item">
        订单编号:
        <span class="zy-font">{{ missionDetailInfo.order_no || "--" }}</span>
      </div>

      <div class="comment-mission-item">
        评价内容
        <div class="desc-content" style="margin-top: 6px">
          <span>{{
            missionDetailInfo.is_evaluate == 4
              ? missionDetailInfo.evaluate_comment_go
              : missionDetailInfo.evaluate_comment
          }}</span>
        </div>
      </div>

      <div class="comment-mission-item">
        晒图
        <div class="comment-pic-list" v-if="missionDetailInfo.is_evaluate == 4">
          <div
            v-for="(item, key) in missionDetailInfo.evaluate_pic_go"
            :key="key"
          >
            <img v-if="item" :src="item" style="width: 60px; height: 60px" />
          </div>
        </div>

        <div class="comment-pic-list" v-else>
          <div v-for="(item, key) in missionDetailInfo.evaluate_pic" :key="key">
            <img v-if="item" :src="item" style="width: 60px; height: 60px" />
          </div>
        </div>
      </div>

      <div class="create-account-image">
        <p style="font-weight: 600">上传评价截图：</p>
        <div class="create-account-image_content">
          <van-uploader
            v-model="fileList"
            :deletable="false"
            :after-read="uploadTb"
            :max-count="1"
          />
        </div>
      </div>

      <van-button
        round
        type="info"
        size="large"
        style="margin-top: 20px"
        @click="save"
        >确认提交</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue"; // @ is an alias to /src
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import VFooter from "@/components/VFooter.vue";
import { getBuyerList } from "@/service/buyer";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import {
  completeOrder,
  completeOrderGo,
  getOrderDetail,
  verifyFlowMission,
} from "@/service/order";
import {
  completeImgUrl,
  getFlowTypes,
  getPlatFormByType,
  missionSort,
} from "@/lib/helper";
import { Dialog, ImagePreview, Toast } from "vant";
import { upLoadImage } from "@/lib/uploadImage";

@Component({
  components: {
    HelloWorld,
    Header,
    VHeader,
    VFooter,
  },
})
export default class Home extends Vue {
  isLoading: boolean = true; // 正在加载中
  finished: boolean = false; // 是否完成

  end_time: number = new Date("2020-11-5 00:00:00").getTime();

  status = 1;

  preview_one: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao1.png";
  preview_two: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao2.png";
  preview_three: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao3.png";

  missionDetailInfo: any = {
    option: {
      flow_type: "",
    },
  };

  fileList = [];
  fileList1 = [];

  id: any = "";

  created() {
    this.getBuyerInfo();

    const { id } = routerHelper.getData();
    this.id = id;
    this.form.id = id;

    getOrderDetail(id).then((data) => {
      if (data && data.data) {
        this.missionDetailInfo = data.data;
        this.missionDetailInfo.option = JSON.parse(
          this.missionDetailInfo.option
        );

        this.missionDetailInfo.evaluate_pic =
          this.missionDetailInfo.evaluate_pic &&
          this.missionDetailInfo.evaluate_pic != "{}"
            ? JSON.parse(this.missionDetailInfo.evaluate_pic)
            : [];

        this.missionDetailInfo.evaluate_pic_go =
          this.missionDetailInfo.evaluate_pic_go &&
          this.missionDetailInfo.evaluate_pic_go != "{}"
            ? JSON.parse(this.missionDetailInfo.evaluate_pic_go)
            : [];
        this.end_time =
          parseInt(this.missionDetailInfo.buyer_time) * 1000 +
          1000 * 60 * 20 -
          Date.now();
      }
    });

    // window.addEventListener("scroll", () => {
    //   if (getScrollTop() + getWindowHeight() + 30 >= getScrollHeight()) {
    //   }
    // });
  }

  debounce(fn: any, timeout = 500) {
    let timer: any;
    const that = this;
    return function () {
      let env = that;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(env, arguments);
      }, timeout);
    };
  }

  beforeDestory() {
    console.log("beforeDestory");
    // 卸载掉scroll监听事件
    window.removeEventListener("scroll", () => {}, true);
  }

  form: any = {
    id: "",
    evaluate_buyer: "",
  };

  isTemplateApp(flow_type: any) {
    if (flow_type == 2 || flow_type == 5) return "PC";
    else return "APP";
  }

  // 跳到创建买手号网页
  toCreateAccount(type: number) {
    routerHelper.to("/createAccount", {
      type,
    });
  }

  // 获取买手信息
  getBuyerInfo() {
    getBuyerList().then((data) => {
      if (data) {
        console.log("获取用户信息的接口", data);
      }
    });
  }

  changeStatus(status: number) {
    this.status = status;
  }

  getFlowTypes(id: any) {
    return getFlowTypes(id);
  }

  getPlatFormByType(id: any) {
    return getPlatFormByType(id);
  }

  missionSort(id: any) {
    return missionSort(id);
  }

  previewImage(pic_url: string) {
    ImagePreview([pic_url]);
  }

  uploadTb(file: any) {
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.form.evaluate_buyer = completeImgUrl(res.data.src);
      }
    });
  }

  preview(index: number = 0) {
    //   ImagePreview([])
  }

  // 验证的接口
  verifyAll() {
    const form = this.form;
    verifyFlowMission(this.id, form).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        Dialog({
          title: "通知",
          message: "提交成功，等待商家审核",
        }).then((data) => {
          routerHelper.to("/userOrder");
        });
      }
    });
  }

  save() {
    if (!this.form.evaluate_buyer) {
      Toast("请上传您的评价截图");
      return;
    }

    if (this.missionDetailInfo.is_evaluate == 4) {
      completeOrderGo(this.form).then((data) => {
        if (data && data.origin_data && data.origin_data.code == 1001) {
          Toast("上传完成");
          const timer = setTimeout(() => {
            routerHelper.to("/commentList");
            clearTimeout(timer);
          }, 2500);
        }
      });
    } else {
      completeOrder(this.form).then((data) => {
        if (data && data.origin_data && data.origin_data.code == 1001) {
          Toast("上传完成");
          const timer = setTimeout(() => {
            routerHelper.to("/commentList");
            clearTimeout(timer);
          }, 2500);
        }
      });
    }
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

.bs-font {
  color: #447ee9;
}

.bs-font-1 {
  color: indianred;
}

.comment-mission-container {
  box-sizing: border-box;
  color: #000;
  padding: 10px 10px 10px 20px;
  text-align: left;
  font-size: 14px;
  margin-bottom: 100px;
  .comment-mission-item {
    margin-bottom: 15px;
    .comment-pic-list {
      @include flex(flex-start);
      margin-top: 10px;
      & > img {
        margin-right: 10px;
      }
    }
  }
}

.flow-mission-container {
  .flow-mission-title {
    font-size: 20px;
    @include setHeight(30px);
    text-align: center;
    margin-bottom: 12px;
    position: relative;
  }

  .flow-mission-first,
  .flow-mission-second,
  .flow-mission-third {
    box-sizing: border-box;
    padding: 0px 20px;
    font-size: 14px;
    text-align: left;
    & > div {
      margin-bottom: 8px;
    }
  }

  .flow-mission-third {
    margin-bottom: 40px;
  }
}

.create-account-image {
  font-size: 14px;
  padding-top: 10px;
  text-align: left;
  .create-account-image_title {
    @include flex(space-between);
    align-items: center;
  }
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

.upLoad-btn {
  width: 80px;
  font-size: 14px;
  color: #fff;
  background: #447ee9;
  text-align: center;
  border-radius: 15px;
  @include setHeight(30px);
}

.next-step-btn {
  position: absolute;
  width: 80px;
  @include setHeight(30px);
  display: inline-block;
  left: 10px;
  border-radius: 20px;
  text-align: center;
  background: #ff9900;
  font-size: 14px;
  color: #fff;
}

.verify-btn {
  width: 80px;
  @include setHeight(30px);
  display: inline-block;
  border-radius: 20px;
  text-align: center;
  background: #ff9900;
  font-size: 14px;
  color: #fff;
}
.desc-content {
  border: 1px solid #000;
}
</style>
