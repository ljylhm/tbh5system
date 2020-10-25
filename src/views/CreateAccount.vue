<template>
  <div class="create-account-container">
    <VHeader :msg="'资金管理'" :showExitBtn="true"></VHeader>
    <div class="create-account-content">
      <div class="create-account-form">
        <div class="create-account-item">
          <div class="create-account-item_label">会员名：</div>
          <div class="create-account-item_input">
            <input :placeholder="`请输入${platName}会员名`" v-model="form.name" />
          </div>
        </div>

        <div class="create-account-item">
          <div class="create-account-item_label">性别：</div>
          <div class="create-account-item_input">
            <van-radio-group v-model="form.sex" direction="horizontal">
              <van-radio name="0">男</van-radio>
              <van-radio name="1">女</van-radio>
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
              :after-read="uploadTb"
              :max-count="1" 
            />
            <div
              class="create-account-image_pic"
              @click="previewImage(form.img_url[0])"
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
              v-model="fileList1"
              :deletable="false"
              :after-read="uploadJd"
              :max-count="1" 
            />
            <div
              class="create-account-image_pic"
              @click="previewImage(form.img_url[1])"
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
              v-model="fileList2"
              :deletable="false"
              :after-read="uploadPdd"
              :max-count="1"
            />
            <div
              class="create-account-image_pic"
              @click="previewImage(form.img_url[2])"
            >
              <img :src="preview_three" />
            </div>
          </div>
        </div>

        <div class="create-account-operation">
          <div class="create-account_btn create-account_btn_1" @click="save">确定提交</div>
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
import { ImagePreview, Toast } from "vant";
import { upLoadImage } from "@/lib/uploadImage";
import { routerHelper } from "@/router";
import { completeImgUrl } from '@/lib/helper';
import { addBuyer } from '@/service/buyer';
import { openAlertError } from '@/lib/notice';

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
  platType: any = 1;

  actions = [
    { name: "男", value: "0" },
    { name: "女", value: "1" },
  ];

  preview_one: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao1.png";
  preview_two: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao2.png";
  preview_three: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao3.png";

  fileList = [];
  fileList1 = [];
  fileList2 = [];

  form:{
    name: string
    type: number
    sex: string
    img_url: string[]
  } = {
    name: "",
    type: 1,
    sex: "0",
    img_url: [],
  };

  img_one = ""
  img_two = ""
  img_three = ""

  created() {
    // 获取传过来的type
    const { type } = routerHelper.getData();
    this.platType = type;
    (this.form as any).type = type;
    console.log("获取的传过来的type", type);
  }

  uploadTb(file:any){
    console.log("xxx",file.file)
    this.upLoadImageAction(file.file,0)
  }

  uploadJd(file:any){
    this.upLoadImageAction(file.file,1)
  }

  uploadPdd(file:any){
    this.upLoadImageAction(file.file,2)
  }

  upLoadImageAction(file:File,index:number) {
    upLoadImage(file).then((res) => {
      if (res && res.data) {
        this.form.img_url[index] = completeImgUrl(res.data.src);
        if(index == 0){
          this.img_one = completeImgUrl(res.data.src);
        }else if(index == 1){
          this.img_two = completeImgUrl(res.data.src);
        }else {
          this.img_three = completeImgUrl(res.data.src);
        }
        
        console.log("index", this.form.img_url)
      }
    });
  }

  get platName() {
    if (this.platType == 1) return "淘宝";
    if (this.platType == 2) return "京东";
    if (this.platType == 3) return "拼多多";
  }

  openSexSheet() {
    this.showSexSheet = true;
  }

  closeSexSheet() {
    this.showSexSheet = false;
  }

  afterRead(data: any) {
    console.log("data data", data);
  }

  // 上传图片
  upLoadImage() {}

  previewImage(pic_url: string) {
    ImagePreview([pic_url]);
  }

  // 保存用户的行为
  save(){
    if(!this.form.name){
      Toast("请输入用户名~")
    }else if(this.form.img_url.length <= 0){
      Toast("请上传截图")
    }else{
      addBuyer(this.form).then(data => {
        if(data && data.origin_data && data.origin_data.code == 1001 ){
          Toast.success("保存成功")
          routerHelper.to("/AccountManage")
        }
      })
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
