<template>
  <div class="user-order-container">
    <VHeader :msg="'系统工单'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <div class="work-order-container">
      <div class="work-order-header">
        <table border="1" bordercolor="#ddd">
          <tr>
            <td width="30%">订单编号</td>
            <td width="70%">{{ pastPara.order_number || "--" }}</td>
          </tr>
          <tr>
            <td width="30%">转账金额</td>
            <td width="70%">{{ pastPara.price || "--" }}</td>
          </tr>
          <tr>
            <td width="30%">转账人</td>
            <td width="70%">{{ pastPara.user_name || "--" }}</td>
          </tr>
        </table>
      </div>

      <div class="work-order-comment" style="background-color:#fff">
        <div
          class="work-order-comment-content"
          style="background-color:#f5f5f5"
        >
          <div class="work-order-comment-header">
            <p>沟通记录</p>
            <p>(24小时未处理请提供订单号给客服或邀请人处理)</p>
          </div>
          <div
            class="work-order-comment-item"
            v-for="(item, key) in transferComment"
            :key="key"
          >
            <div>{{ item.type == 1 ? "商家" : "买手" }}：</div>
            <div style="margin:10px 0px">{{ item.comment }}</div>
            <div style="margin:10px 0px;" v-if="item.pic">
              <img :src="item.pic" class="show-image">
            </div>
            <div>{{ item.created_at }}</div>
          </div>
        </div>
      </div>

      <div class="work-order-comment work-order-add">
        <div class="work-order-comment-content">
          <div class="work-order-comment-header">
            <p>我想说</p>
          </div>
          <div class="work-order-comment-item">
            <div>
              <van-field
                v-model="commentForm.comment"
                label=""
                placeholder="请输入你想说的话"
                @input="handleInputChange"
              />
            </div>
          </div>
          <div class="work-order-comment-item">
            <div class="create-account-image_content">
              <van-uploader
                v-model="fileList"
                :deletable="true"
                :after-read="uploadTb"
                :max-count="1"
              />
              <div
                class="create-account-image_pic"
                @click="previewImage(commentForm.pic)"
              >
                <!-- <img :src="commentForm.pic" /> -->
              </div>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin-top:10px">
          <van-button type="info" style="margin-right:10px" round @click="save"
            >确认提交</van-button
          >
          <van-button type="warning" round @click="toNextPage">返回列表</van-button>
        </div>
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
import { getBuyerList } from "@/service/buyer";
import {
  confirmGoods,
  getChareList,
  getOrderList,
  getTransferComment,
  transferComment,
} from "@/service/order";
import { getScrollTop, getScrollHeight, getWindowHeight } from "@/lib/scroll";
import { routerHelper } from "@/router";
import { completeImgUrl, getMissionStatus } from "@/lib/helper";
import { ImagePreview, Toast } from "vant";
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

  page: number = 1;
  limit: number = 20;

  commentForm: any = {
    comment: "",
    pic: "",
    parent: 0,
    type: 0,
    work_id: "",
  };

  debounce(fn: any, timeout = 500) {
    let timer: any;
    const that = this;
    return function() {
      let env = that;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(env, arguments);
      }, timeout);
    };
  }

  fileList: any = [];

  pastPara: any = {};

  transferComment: any = [];

  created() {
    const para = routerHelper.getData();
    this.pastPara = para;
    this.getTransferCommentAction();
  }

  beforeDestory() {}

  getTransferCommentAction() {
    getTransferComment(this.pastPara.id).then((data: any) => {
      if (data && data.data) {
        this.transferComment = data.data;
      }
    });
  }

  handleInputChange(e: any) {
    console.log("eee", e);
    console.log("sss", this.commentForm);
  }

  toNext() {
    routerHelper.to("/cashOut");
  }

  upLoadImageAction(file: File) {
    upLoadImage(file).then((res) => {
      if (res && res.data) {
        this.commentForm.pic = completeImgUrl(res.data.src);
      }
    });
  }

  uploadTb(file: any) {
    console.log("xxx", file.file);
    this.upLoadImageAction(file.file);
  }

  previewImage(pic_url: string) {
    ImagePreview([pic_url]);
  }

  // 返回上一级页面
  toNextPage() {
    routerHelper.go(-1);
  }

  save() {
    if (!this.commentForm.comment && !this.commentForm.pic) {
      Toast("请至少上传一张图片或留言一段话");
      return;
    }

    this.commentForm.transfer_id = this.pastPara.id;

    if (this.transferComment.length > 0) {
      this.commentForm.parent = this.transferComment[
        this.transferComment.length - 1
      ].id;
    }

    transferComment(this.commentForm).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        Toast.success("提交成功");
        this.getTransferCommentAction();
        this.commentForm = {
          comment: "",
          pic: "",
          parent: 0,
          type: 0,
          work_id: "",
        };
      } else {
        Toast("提交失败");
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

.zy-font {
  color: red;
}

.bs-font {
  color: #447ee9;
}

.bs-font-1 {
  color: indianred;
}

.work-order-container {
  width: 100%;
  .work-order-header {
    box-sizing: border-box;
    padding: 5px;
    table {
      border-color: #ddd;
      width: 100%;
    }
    background: #fff;
    font-size: 14px;
    td {
      padding: 10px;
    }
  }

  .work-order-comment {
    font-size: 14px;
    text-align: left;
    box-sizing: border-box;
    padding: 5px;
    background: #f5f5f5;
    .work-order-comment-content {
      width: 100%;

      padding: 10px;
      border: 1px solid #ddd;
    }
    .work-order-comment-header {
      padding: 10px 0px;
    }
    .work-order-comment-item {
      padding: 10px 0px;
      border-top: 1px solid #ddd;
    }
  }

  .work-order-add {
    background: #fff;
  }

  .show-image{
    width: 100px;
    height: 100px;
  }
}
</style>
