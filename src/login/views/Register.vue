<template>
  <div>
    <div class="forget-header">
      <VHeader :msg="'用户注册'"></VHeader>
      <div class="forget-header_item forget-header_item_active">
        注册会员信息
      </div>
    </div>
    <div class="forget-container" v-if="step == 1">
      <div class="forget-content">
        <van-form @submit="onSubmit">
          <div class="forget-content_item">
            <van-field
              v-model="form.name"
              name="登录会员名"
              label="登录会员名"
              placeholder="登录会员名"
              :rules="[{ required: true, message: '请填写登录会员名' }]"
            />
          </div>

          <div class="forget-content_item">
            <van-field
              v-model="form.phone"
              name="手机号码"
              label="手机号码"
              placeholder="手机号码"
              :rules="[{ required: true, message: '请填写手机号码' }]"
            />
          </div>

          <div class="forget-content_item">
            <van-field
              v-model="form.password"
              type="password"
              name="用户登录密码"
              label="用户登录密码"
              placeholder="用户登录密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </div>

          <div class="forget-content_item">
            <van-field
              v-model="form.passwordAgain"
              type="password"
              name="再次输入密码"
              label="再次输入密码"
              placeholder="再次输入密码"
              :rules="[
                { validator: pasAgainValidator, message: '两次密码不一致' },
              ]"
            />
          </div>

          <div class="forget-content_item">
            <div class="forget-verify_code">
              <van-field
                v-model="form.verifyCode"
                name="验证码"
                label="验证码"
                placeholder="验证码"
                :rules="[{ validator: yzmValidator, message: '请填写验证码' }]"
              />
            </div>
            <div class="forget-verify_content" @click="renewRandom">
              {{ showRandom }}
            </div>
          </div>

          <div class="forget-content_item">
            <div class="forget-verify_code">
              <van-field
                v-model="form.code"
                name="手机验证码"
                label="手机验证码"
                placeholder="手机验证码"
                :rules="[{ required: false, message: '请填写手机验证码' }]"
              />
            </div>

            <div class="forget-verify_content_1" @click="getVerifyCode">
              {{ send_msg }}
            </div>
          </div>

          <!-- <div class="forget-content_item">
            <van-field
              v-model="form.qq"
              name="qq"
              label="qq"
              placeholder="qq"
              :rules="[{ required: false, message: '请填写qq' }]"
            />
          </div> -->

          <div class="forget-content_item">
            <van-field
              v-model="form.nick"
              name="支付宝账号"
              label="支付宝账号"
              placeholder="支付宝账号"
              :rules="[{ required: true, message: '请填写支付宝账号' }]"
            />
          </div>

          <div class="forget-content_item">
            <van-field
              v-model="form.full_name"
              name="请输入真实姓名"
              label="真实姓名"
              placeholder="请输入真实姓名"
              :rules="[{ required: true, message: '请填写真实姓名' }]"
            />
          </div>

           <div class="forget-content_item">
            <van-field
              v-model="form.card"
              name="请输入身份证号码"
              label="身份证号"
              placeholder="请输入身份证号码"
               :rules="[
                { validator: idCardValidator, message: '请输入正确的身份证号码' },
              ]"
            />
          </div>

          <div class="forget-content_item forget-content_item_1">
            <div class="create-account-image" style="color:#696566">
              <p>上传支付宝截图：</p>
              <div class="create-account-image_content">
                <van-uploader
                  v-model="fileList5"
                  :deletable="false"
                  :after-read="uploadAliPayPic"
                  :max-count="1"
                />
                <div
                  class="create-account-image_pic"
                  @click="previewImage(preview_four)"
                >
                   <img :src="preview_four" />
                </div>
              </div>
            </div>
          </div>

          <div class="forget-content_item forget-content_item_1">
            <div class="create-account-image" style="color:#696566">
              <p>上传身份证截图：</p>
              <div class="create-account-image_content">
                <van-uploader
                  v-model="fileList4"
                  :deletable="false"
                  :after-read="uploadCardPic"
                  :max-count="1"
                />
                <div
                  class="create-account-image_pic"
                  @click="previewImage(preview_two)"
                >
                </div>
              </div>
            </div>
          </div>

          <div class="forget-content_item">
            <van-field
              v-model="form.secret"
              name="请输入邀请码"
              label="邀请码"
              placeholder="请输入邀请码"
            />
          </div>

          

          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit">
              下一步
            </van-button>
          </div>
        </van-form>
      </div>
    </div>

    <div class="create-account-content" v-if="step == 2">
      <div class="create-account-form">
        <div class="create-account-item">
          <div class="create-account-item_label">会员名：</div>
          <div class="create-account-item_input">
            <input :placeholder="`请输入淘宝会员名`" v-model="buyerform.buyer_name" />
          </div>
        </div>

        <div class="create-account-item">
          <div class="create-account-item_label">性别：</div>
          <div class="create-account-item_input">
            <van-radio-group v-model="buyerform.sex" direction="horizontal">
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
              v-model="fileList1"
              :deletable="false"
              :after-read="uploadJd"
              :max-count="1"
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
              v-model="fileList2"
              :deletable="false"
              :after-read="uploadPdd"
              :max-count="1"
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
          <div
            class="create-account_btn create-account_btn_2"
            @click="toStepOne"
          >
            上一步
          </div>
          <div
            class="create-account_btn create-account_btn_1"
            @click="onSubmit2"
          >
            下一步
          </div>
        </div>
      </div>
    </div>

    <div class="create-bank-container" v-if="step == 3">
      <van-popup
        v-model="showPicker"
        position="bottom "
        :style="{ height: '50%' }"
      >
        <van-area
          title="标题"
          :area-list="areaList"
          :columns-num="3"
          @confirm="confirm"
          @cancel="cancel"
        />
      </van-popup>

      <van-popup
        v-model="showBankPicker"
        position="bottom "
        :style="{ height: '50%' }"
      >
        <van-picker
          title="标题"
          show-toolbar
          :columns="bindBankData"
          @confirm="confirmBank"
          @cancel="cancelBank"
        />
      </van-popup>

      <div class="create-bank-content">
        <div class="create-bank-form">
          <van-form @submit="onSubmit">
            <!-- <van-field
            readonly
            clickable
            name="picker"
            :value="showProvince"
            right-icon="arrow"
            label="收货人"
            placeholder="点击选择城市"
            @click="showPicker = true"
          /> -->

            <van-field
              readonly
              clickable
              name="picker"
              :value="bindForm.bank"
              right-icon="arrow"
              label="银行"
              placeholder="点击选择银行"
              @click="showBankPicker = true"
            />

            <van-field
              v-model="bindForm.bank_name"
              label="开户人"
              placeholder="请输入开户人"
            />

            <van-field
              v-model="bindForm.card_no"
              label="银行卡号"
              placeholder="请输入银行卡号"
            />

            <van-field
              readonly
              clickable
              name="picker"
              :value="bindForm.address"
              right-icon="arrow"
              label="开户地"
              placeholder="点击选择城市"
              @click="showPicker = true"
            />

            <van-field
              v-model="bindForm.bank_address"
              label="开户行"
              placeholder="开户行"
            />

            <!-- <van-field
              v-model="bindForm.pay_password"
              label="支付密码"
              type="password"
              placeholder="请输入支付密码"
            /> -->
          </van-form>

          <div class="create-bank-operation">
            <div class="create-bank_btn create-bank_btn_1" @click="onSubmit3">
              确定提交
            </div>
            <div
              class="create-bank_btn create-bank_btn_2"
              @click="toStepTwo()"
            >
              上一步
            </div>
          </div>
        </div>
      </div>

      <div class="create-bank-tip">
        <div>1.请务必保持此处收货信息与购物的收货信息保持一致</div>
        <div>
          2.如因此处信息与购物的收货信息不一致所造成的损失，由您自行承担
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VHeader from "@/components/VHeader.vue"; // @ is an alias to /src
import { register, sendMessage } from "@/service/login";
import GVerify from "@/lib/verify"; // @ is an alias to /src
import { setToken } from "@/lib/cache";
import { upLoadImage } from "@/lib/uploadImage";
import { completeImgUrl } from "@/lib/helper";
import { routerHelper } from "@/router";
import areaList from "@/lib/area";
import { setCache, getCache, clearCache } from "@/lib/cache";
import { ImagePreview, Toast } from "vant";
import { CACHE_NAME } from "@/constance/register";

interface IProps {}

const phone_rule = /^1[3456789]\d{9}$/;

@Component({
  components: {
    VHeader,
  },
})
export default class Forget extends Vue<IProps> {
  status = "edit";

  step: number = 1; // 步骤

  showSexSheet: boolean = false;
  platType: any = 1;
  showPicker = false;
  showBankPicker = false;

  showProvince: string = "";
  showBank: string = "";

  areaList = areaList;

  form = {
    name: "",
    phone: "",
    password: "",
    passwordAgain: "",
    code: "",
    verifyCode: "",
    type: 0,
    nick: "",
    secret: "",
    full_name:"",                             // 身份证全名
    card:"",                                  // 身份证号码
    card_pic:"",                              // 身份证图片
    alipay_pic:""                             // 支付宝截图
  };

  buyerform: {
    buyer_name: string;
    buyer_type: number;
    sex: string;
    img_url: string[];
  } = {
    buyer_name: "",
    buyer_type: 1,
    sex: "0",
    img_url: [],
  };

  bindForm: any = {
    bank: "",
    card_no: "",
    bank_name: "",
    address: "",
    bank_address: "",
  };

  preview_one: string =
    "https://imgqn.smm.cn/production/b/image/NTCPH20210118211135.png";
  preview_two: string =
    "https://imgqn.smm.cn/production/b/image/kKjcU20210118211135.jpeg";
  preview_three: string =
    "https://imgqn.smm.cn/production/b/image/bCfEw20210118211136.png";
  preview_four: string =
    "https://imgqn.smm.cn/production/b/image/JxHsO20210117153926.jpeg";


  

  fileList = [];
  fileList1 = [];
  fileList2 = [];

  fileList4 = []
  fileList5 = []

  img_one = "";
  img_two = "";
  img_three = "";

  resetForm = {
    password: 123,
    passwordAgain: 123,
  };

  showRandom = "";
  send_msg = "获取验证码";
  sendStatus = 0;

  bankData = [
    {
      label: "光大银行",
      value: "1",
    },
    {
      label: "工商银行",
      value: "2",
    },
    {
      label: "建设银行",
      value: "3",
    },
    {
      label: "中国银行",
      value: "4",
    },
    {
      label: "农业银行",
      value: "5",
    },
    {
      label: "交通银行",
      value: "6",
    },
    {
      label: "招商银行",
      value: "7",
    },
    {
      label: "中信银行",
      value: "8",
    },
    {
      label: "民生银行",
      value: "9",
    },
    {
      label: "广发银行",
      value: "10",
    },
    {
      label: "兴业银行",
      value: "11",
    },
    {
      label: "华夏银行",
      value: "12",
    },
    {
      label: "平安银行",
      value: "13",
    },
    {
      label: "浦发银行",
      value: "14",
    },
    {
      label: "邮政银行",
      value: "15",
    },
    {
      label: "深圳发展银行",
      value: "16",
    },
    {
      label: "恒丰银行",
      value: "17",
    },
    {
      label: "浙商银行",
      value: "18",
    },
    {
      label: "渤海银行",
      value: "19",
    },
  ];

  bindBankData: string[] = [];

  created() {
   
  }

  mounted() {
    var verifyCode = new GVerify("forget-verify");
    this.renewRandom();
    this.bindBankData = this.bankData.map((item: any) => item.label);
    // let cache_info: any = getCache(CACHE_NAME);
    // if (cache_info) {
    //   cache_info = JSON.parse(cache_info);
    // } else {
    //   cache_info = {};
    // }

    // if (cache_info.step) {
    //   this.form = cache_info.form;
    //   this.buyerform = cache_info.buyerform;
    //   this.bindForm = cache_info.bindForm;
    // }
  }

  changeStep(step: number) {
    this.step = step;
  }

  toStepOne() {
    this.changeStep(1);
  }

  toStepTwo() {
    this.changeStep(2);
  }

  toStepThree() {
    this.changeStep(3);
  }

  uploadTb(file: any) {
    console.log("xxx", file.file);
    this.upLoadImageAction(file.file, 0);
  }

  uploadJd(file: any) {
    this.upLoadImageAction(file.file, 1);
  }

  uploadPdd(file: any) {
    this.upLoadImageAction(file.file, 2);
  }

  uploadCardPic(file:any){
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.form.card_pic = completeImgUrl(res.data.src);
      }
    });
  }

  uploadAliPayPic(file:any){
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.form.alipay_pic = completeImgUrl(res.data.src);
      }
    });
  }
  

  previewImage(pic_url: string) {
    ImagePreview([pic_url]);
  }

  upLoadImageAction(file: File, index: number) {
    upLoadImage(file).then((res) => {
      if (res && res.data) {
        this.buyerform.img_url[index] = completeImgUrl(res.data.src);
        if (index == 0) {
          this.img_one = completeImgUrl(res.data.src);
        } else if (index == 1) {
          this.img_two = completeImgUrl(res.data.src);
        } else {
          this.img_three = completeImgUrl(res.data.src);
        }
        console.log("index", this.buyerform.img_url);
      }
    });
  }

  idCardValidator(val: string){
    const rule = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    return rule.test(val)
  }

  pasAgainValidator(val: string) {
    return !!(val && val == this.form.password);
  }

  yzmValidator(val: string) {
    return val.toUpperCase() == this.showRandom.toUpperCase();
  }

  yzmValidator1(val: string) {
    return val == this.showRandom;
  }

  generateRandomStr() {
    const num_arr =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const res_arr: string[] = [];
    while (res_arr.length < 4) {
      const t = Math.floor(Math.random() * (num_arr.length - 1));
      const val = num_arr[t];
      if (!res_arr.includes(val)) res_arr.push(val);
    }
    return res_arr.join("");
  }

  renewRandom() {
    this.showRandom = this.generateRandomStr();
  }

  toReset() {
    this.status = "reset";
  }

  doRegister() {
    const form = Object.assign({},this.form,this.buyerform,this.bindForm)
    console.log("当前的表单",form)
    register(form).then((data) => {
      if (data && data.data && data.data.access_token) {
        const access_token = data.data.access_token;
        localStorage.setItem("ISLOGIN","1")
        // clearCache(CACHE_NAME)
        Toast.success({
          message: "恭喜您注册成功",
          onClose() {
            setToken(access_token);
            const origin = location.origin;
            window.location.replace(origin);
          },
        });
      }
    });
  
  }

  // 获取验证码
  getVerifyCode() {
    if (this.sendStatus == 1) return;
    if (!this.form.phone) {
      Toast("请填写手机号");
    } else if (!phone_rule.test(this.form.phone)) {
      Toast("请填写正确的手机号码");
    } else {
      sendMessage(this.form.phone).then((data) => {
        if (data && data.origin_data.code == 1001) {
          this.sendStatus = 1;
          let count = 60;
          const timer = setInterval(() => {
            this.send_msg = `还有${--count}秒`;
            if (count == 0) {
              clearInterval(timer);
              this.send_msg = "获取验证码";
              this.sendStatus = 0;
            }
          }, 1000);
        }
      });
    }
  }

  setCache(step: number) {
    const that = this;
    // filter form表单 去掉验证码 邀请码等一些信息
    const cache_form = {
      step: step,
      form: {
        ...that.form,
        password: "",
        passwordAgain: "",
        code: "",
        verifyCode: "",
        secret: "",
      },
      buyerform: {
        ...that.buyerform,
      },
      bindForm: {
        ...that.bindForm,
      },
    };
    // setCache(CACHE_NAME, JSON.stringify(cache_form));
  }

  // 提交的行为
  onSubmit() {
    console.log("表单 表单",this.form)
    if(!this.form.card_pic){
      Toast("请上传身份证截图~")
      return
    }

    if(!this.form.alipay_pic){
      Toast("请上传支付宝截图~")
      return
    }
    this.toStepTwo();
    this.setCache(2);
  }

  onSubmit2() {
    if (!this.buyerform.buyer_name) {
      Toast("请输入用户名~");
    } else if (this.buyerform.img_url.length <= 0) {
      Toast("请上传截图");
    } else {
      this.toStepThree();
      this.setCache(3);
    }
  }

  confirmBank(data: any) {
    this.showBank = data;
    this.bindForm.bank = data;
    this.showBankPicker = false;
  }

  cancelBank() {
    this.showBankPicker = false;
  }

  // 确认选择地址的事件
  confirm(data: any) {
    let showProvince: string = "";
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        showProvince = showProvince + item.name + " ";
      });
    }
    this.bindForm.address = showProvince;
    this.showProvince = showProvince;
    this.showPicker = false;
  }

  // 取消选择地址的事件
  cancel() {
    this.showPicker = false;
  }

  toNext() {
    routerHelper.to("/cashManage");
  }

  onSubmit3() {

    console.log("第一步表单",this.form)
    console.log("第二步表单",this.buyerform)
    console.log("第三步表单",this.bindForm)
    if (!this.bindForm.bank) {
      Toast("请选择银行");
      return;
    }

    if (!this.bindForm.bank_name) {
      Toast("请输入开户人");
      return;
    }

    if (!this.bindForm.card_no) {
      Toast("请输入银行卡");
      return;
    }

    if (!this.bindForm.address) {
      Toast("请输入开户地");
      return;
    }

    if (!this.bindForm.bank_address) {
      Toast("请输入开户行");
      return;
    }

    this.doRegister();

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

.forget-header {
  width: 100%;
  @include flex(flex-start);
  .forget-header_item {
    @include setHeight(40px);
    font-size: 14px;
    text-align: center;
    color: #000;
    background: #f4f4f4;
    flex: 1;
  }
  .forget-header_item_active {
    background: #ff9900;
    color: #fff;
  }
}

.forget-container {
  // width: 100%;
  .forget-content {
    width: 100%;
    height: auto;
    padding: 20px 0px;
    margin: 0 auto;

    .forget-content_item {
      width: 340px;
      height: auto;
      margin: 0 auto;
      @include flex(flex-start);
      align-items: center;
    }

    .forget-content_item_1{
      padding-left: 16px;
      box-sizing: border-box;
    }

    .forget-header {
      @include setHeight(50px);
      font-weight: 600;
      font-size: 18px;
      color: #323232;
      box-sizing: border-box;
      padding: 0px 20px;
      border-bottom: 1px solid #ddd;
    }
    .forget-label {
      width: 880px;
      margin: 20px auto;
      font-size: 14px;
      @include flex(flex-start);
      .forget-label-item {
        text-align: center;
        @include setHeight(40px);
        background: #eee;
        color: #323232;
        flex: 1;
      }
      .forget-label-item-select {
        background: #ff9900;
        color: #ffffff;
      }
    }
    .forget-input {
      padding: 20px 0px 20px 160px;
      .forget-input_item {
        margin: 0 auto 30px;
        font-size: 14px;
        display: inline-block;
        @include flex(flex-start);

        .verify-btn {
          color: #fff;
          background: #409eff;
          padding: 0px 10px;
          border-radius: 2px;
          margin-left: 20px;
          @include setHeight(36px);
          cursor: pointer;
        }

        .forget-input_item_label {
          width: 200px;
          text-align: right;
          @include setHeight(36px);
        }

        .forget-input_item_short {
          width: 200px;
        }

        .forget-input_item_long {
          width: 300px;
        }

        .forget-input_item_content {
          .el-input__inner {
            height: 36px;
            line-height: 36px;
          }
        }

        #forget-verify {
          margin-left: 20px;
        }
      }
      .next-btn {
        margin-left: 200px;
        .el-button--primary {
          width: 280px;
        }
      }
    }
  }

  .forget-verify_code {
    width: 260px;
  }
  .forget-verify_content {
    flex: 1;
    @include setHeight(30px);
    letter-spacing: 4px;
    text-align: center;
    color: cornflowerblue;
    border: 2px solid #999;
  }

  .forget-verify_content_1 {
    flex: 1;
    @include setHeight(30px);
    text-align: center;
    font-size: 10px;
    background: cornflowerblue;
    color: #fff;
  }
}

.create-account-content {
  box-sizing: border-box;
  padding: 20px 0px 20px 20px;
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

.create-bank-container {
  .create-bank-content {
    box-sizing: border-box;
    padding-left: 20px;
  }
  .create-bank-tip {
    border: 1px dashed #ddd;
    width: 345px;
    font-size: 12px;
    text-align: left;
    box-sizing: border-box;
    padding: 10px;
    margin: 20px auto;
    font-weight: 600;
    & > div {
      margin-bottom: 5px;
    }
  }
  .create-bank-form {
    color: #000;
    text-align: left;
    .create-bank-item {
      @include flex(flex-start);
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      .create-bank-item_label {
        width: 100px;
      }
      .create-bank-item_input {
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

    .create-bank-image {
      font-size: 14px;
      padding-top: 10px;
      text-align: left;
      .create-bank-image_content {
        margin-top: 10px;
        @include flex(flex-start);
      }
      .create-bank-image_pic {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .create-bank-operation {
    @include flex(center);
    align-items: center;
    margin-top: 10px;

    .create-bank_btn {
      width: 100px;
      @include setHeight(30px);
      text-align: center;
      margin-right: 10px;
      border-radius: 15px;
      color: #fff;
      font-size: 14px;
    }

    .create-bank_btn_1 {
      background: #ff9900;
    }

    .create-bank_btn_2 {
      background: #4882f0;
    }
  }
}
</style>
