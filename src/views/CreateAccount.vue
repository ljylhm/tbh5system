<template>
  <div class="create-account-container">
    <VHeader :msg="'资金管理'" :showExitBtn="true"></VHeader>
    <div class="create-account-content">
      <div class="create-account-form">
        <div class="create-account-item">
          <div class="create-account-item_label">会员名：</div>
          <div class="create-account-item_input">
            <input placeholder="请输入拼多多会员名" />
          </div>
        </div>

        <div class="create-account-item">
          <div class="create-account-item_label">性别：</div>
          <div class="create-account-item_input">
            <van-radio-group v-model="showSexSheet" direction="horizontal">
              <van-radio name="1">男</van-radio>
              <van-radio name="2">女</van-radio>
            </van-radio-group>
          </div>
        </div>

        <div class="create-account-image">
          <p>上传截图1：</p>
          <p>请按照下方右侧示例图模板上传正确图片</p>
          <div class="create-account-image_content">
            <van-uploader
              v-model="fileList"
              :deletable="false"
              :after-read="afterRead"
            />
            <div
              class="create-account-image_pic"
              @click="previewImage(preview_one)"
            >
              <img :src="preview_one" />
            </div>
          </div>
        </div>

        <div class="create-account-image">
          <p>上传截图2：</p>
          <p>请按照下方右侧示例图模板上传正确图片</p>
          <div class="create-account-image_content">
            <van-uploader
              v-model="fileList"
              :deletable="false"
              :after-read="afterRead"
            />
            <div
              class="create-account-image_pic"
              @click="previewImage(preview_two)"
            >
              <img :src="preview_two" />
            </div>
          </div>
        </div>

        <div class="create-account-image">
          <p>上传截图3：</p>
          <p>请按照下方右侧示例图模板上传正确图片</p>
          <div class="create-account-image_content">
            <van-uploader
              v-model="fileList"
              :deletable="false"
              :after-read="afterRead"
            />
            <div
              class="create-account-image_pic"
              @click="previewImage(preview_three)"
            >
              <img :src="preview_three" />
            </div>
          </div>
        </div>

        <div class="create-account-operation">
          <div class="create-account_btn create-account_btn_1">确定提交</div>
          <div class="create-account_btn create-account_btn_2">返回</div>
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

  actions = [
    { name: "男", value: "1" },
    { name: "女", value: "2" },
  ];

  preview_one: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao1.png";
  preview_two: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao2.png";
  preview_three: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao3.png";

  fileList = [
    {
      url: "https://img.yzcdn.cn/vant/leaf.jpg",
    },
  ];

  openSexSheet() {
    this.showSexSheet = true;
  }

  closeSexSheet() {
    this.showSexSheet = false;
  }

  afterRead() {}

  previewImage(pic_url: string) {
    ImagePreview([pic_url]);
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

.create-account-container {
  .create-account-content {
    box-sizing: border-box;
    padding-left: 20px;
  }
  .create-account-form {
    color: #000;
    text-align: left;
    .create-account-item {
      @include flex(flex-start);
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      .create-account-item_label {
        width: 100px;
      }
      .create-account-item_input {
        flex: 1;
        margin-left: 15px;
        text-align: left;
        input {
          width: 200px;
          height: 34px;
          border: 1px solid #ddd;
          padding: 0px 5px;
        }
        input::-webkit-input-placeholder {
          font-size: 12px;
        }
      }
    }

    .create-account-image {
      font-size: 14px;
      padding-top: 10px;
      text-align: left;
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
  }

  .create-account-operation {
    @include flex(center);
    align-items: center;
    margin-top: 10px;

    .create-account_btn {
      width: 100px;
      @include setHeight(30px);
      text-align: center;
      margin-right: 10px;
      border-radius: 15px;
      color: #fff;
      font-size: 14px;
    }

    .create-account_btn_1 {
      background: #ff9900;
    }

    .create-account_btn_2 {
      background: #4882f0;
    }
  }
}
</style>
