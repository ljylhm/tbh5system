<template>
  <div class="flow-mission-container">
    <VHeader :msg="'销量任务'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'接手管理'"></VFooter>

    <van-overlay :show="showRules">
      <div class="wrapper">
        <div class="rules-block">
          <div class="rules-block_title zy-font">资金安全协议书</div>
          <div class="rules-block_content">
            1.商家要求提供<span class="zy-font"
              >验证码、核销码、电子券、填写商家提供收货手机号的任务</span
            >的任务等，一律禁止做单！此类为<span class="zy-font">骗子商家</span
            >，否则自行承担责任！
          </div>

          <div class="rules-block_content">
            2.商家电话或者短信通知<span class="zy-font"
              >索取验证码、核销码、电子券</span
            >等，一律拒绝提供，并立刻到淘宝退款，此类为骗子商家，否则自行承担责任！
          </div>

          <div class="rules-block_content">
            3.商家要求<span class="zy-font">微信、QQ发送二维码、链接</span
            >下单，不是在淘宝正常下单的，一律禁止做单！否则自行承担责任！
          </div>

          <div class="rules-block_content">
            4.出现此类<span class="zy-font">骗子商家</span
            >，请第一时间联系师傅，告知平台，对商家进行封号处理
          </div>

          <!-- <div class="rules-confirm">
            <van-radio-group v-model="radio" direction="horizontal">
              <van-radio name="1" shape="square"
                ><span class="zy-font">*</span>
                我已知晓并同意以上条例（必须勾选）</van-radio
              >
            </van-radio-group>
          </div> -->

          <div class="btn-list-1">
            <div @click="showRules = false">同意</div>
            <div @click="toUserOrder">不同意</div>
          </div>
        </div>
      </div>
    </van-overlay>

    <div class="flow-mission-first" v-if="status == 1">
      <div class="flow-mission-title">第一步</div>

      <div>任务编号：{{ missionDetailInfo.order_no }}</div>
      <div>
        任务类型：<span class="zy-font"
          >({{ getFlowTypes(missionDetailInfo.option.flow_type) }})</span
        >
      </div>
      <!-- <div>进入方式：搜索关键字</div> -->
      <div>
        下单终端：<span class="zy-font"
          >{{
            isTemplateApp(missionDetailInfo.option.flow_type) == "APP"
              ? "手机"
              : "电脑"
          }}
        </span>
      </div>
      <div>
        入口：<span class="zy-font"
          >{{
            getPlatFormByType(missionDetailInfo.type) +
            isTemplateApp(missionDetailInfo.option.flow_type)
          }}
        </span>
      </div>
      <div>
        <span class="zy-font"
          >此任务只能使用{{
            getPlatFormByType(missionDetailInfo.type) +
            isTemplateApp(missionDetailInfo.option.flow_type)
          }}下单
        </span>
      </div>
      <div>
        任务说明：<span v-if="!missionDetailInfo.description" class="zy-font"
          >暂无任务说明</span
        >
      </div>
      <div class="desc-content" v-if="missionDetailInfo.description">
        <span>{{ missionDetailInfo.description }}</span>
      </div>
      <div>
        <!-- <span class="zy-font">温馨提示</span>若支付金额与担保金额的<span class="zy-font">差额</span>>50元，在平台将<span class="zy-font">无法提交订单</span>。遇到这种情况时，请勿在淘宝进行下单操作。 -->
        <span class="zy-font">温馨提示：</span
        >请仔细核对产品金额之后选择进行下一步
      </div>

      <van-count-down :time="end_time">
        <template #default="timeData">
          任务释放时间：
          <span class="zy-font">{{ timeData.minutes }}</span>
          <span class="colon">分</span>
          <span class="zy-font">{{ timeData.seconds }}</span>
          <span class="colon">秒</span>
        </template>
      </van-count-down>
      <!-- <div>
        1. 此任务只能使用{{ getPlatFormByType(missionDetailInfo.type) }}APP进行
      </div>
      <div>
        2. 找到目标商品后，需要浏览商品详情页和评价，<span class="zy-font"
          >至少停留一分钟，以上传截图的显示的时间为证</span
        >
      </div>
      <div>
        3. 搜索截图需要展现关键字和目标商品，（详见第二页中的示例图）<span
          class="zy-font"
          >至少停留一分钟，以上传截图的显示的时间为证</span
        >
      </div>
      <div>
        4.
        如遇到购物券的任务，请严格按照提示语领取全部优惠券，并参照示例图，否则无法获得佣金。<span
          class="zy-font"
          >至少停留一分钟，以上传截图的显示的时间为证</span
        >
      </div>
      <div>
        5. 如遇到旺旺咨询的任务，旺聊必须不少于五个沟通<span class="zy-font"
          >至少停留一分钟，以上传截图的显示的时间为证</span
        >
      </div> -->

      <van-button
        round
        type="info"
        size="large"
        style="margin-top: 20px"
        @click="checkFirstStep"
        >下一步</van-button
      >
    </div>

    <div class="flow-mission-second" v-if="status == 2">
      <div class="flow-mission-title">
        <div class="next-step-btn" @click="changeStatus(1)">上一步</div>
        第二步
      </div>

      <div class="flow-mission-pic">
        <img
          :src="
            isTemplateApp(missionDetailInfo.option.flow_type) == 'APP'
              ? missionDetailInfo.qr_url
              : missionDetailInfo.qr_url
          "
        />
      </div>

      <div>
        任务类型：{{ getFlowTypes(missionDetailInfo.option.flow_type) }}
      </div>
      <div>
        搜索关键字:
        <span class="zy-font">{{
          missionDetailInfo.option.keyword || "--"
        }}</span>
      </div>
      <div>
        排序方式：{{
          missionDetailInfo.option.shop_order
            ? missionSort(missionDetailInfo.option.shop_order)
            : "--"
        }}
      </div>
      <div>
        价格区间：{{
          missionDetailInfo.option.price_region.from
            ? `${missionDetailInfo.option.price_region.from} - ${missionDetailInfo.option.price_region.to}`
            : "--"
        }}
      </div>

      <div style="color: #ff9900; font-weight: 600; line-height: 24px">
        虚拟单，核销单，不是真实发快递的都是骗子商家，这些单不能申请退款，不要做不要做不要做，这些订单本金追不回来平台概不负责
      </div>

      <div style="font-weight: 600">验证店铺</div>
      <van-field
        v-model="shop_name"
        center
        clearable
        label=""
        placeholder="请输入店铺名"
      >
        <template #button>
          <div
            class="verify-btn"
            v-if="missionDetailInfo.is_shop_name == 0"
            @click="verifyShop"
          >
            验证
          </div>
          <div class="verify-btn-exist" v-else>已验证</div>
        </template>
      </van-field>

      <div style="font-weight: 600">验证商品标题</div>
      <van-field
        v-model="goods_title"
        center
        clearable
        label=""
        placeholder="请输入商品标题"
      >
        <template #button>
          <div
            class="verify-btn"
            v-if="missionDetailInfo.is_goods_name == 0"
            @click="verifyGoodName"
          >
            验证
          </div>
          <div class="verify-btn-exist" v-else>已验证</div>
        </template>
      </van-field>

      <div class="create-account-image">
        <p style="font-weight: 600">上传搜索截图：</p>
        <p>请按照下方右侧示例图模板上传正确图片</p>
        <div class="create-account-image_content">
          <van-uploader
            v-model="fileList3"
            :deletable="false"
            :after-read="upLoadSearchImage"
            :max-count="1"
          />
          <div
            class="create-account-image_pic"
            @click="previewImage(shotScreen.search_pic)"
          >
            <img :src="shotScreen.search_pic" />
          </div>
        </div>
      </div>

      <van-count-down :time="second_time">
        <template #default="timeData">
          任务释放时间：
          <span class="zy-font">{{ timeData.minutes }}</span>
          <span class="colon">分</span>
          <span class="zy-font">{{ timeData.seconds }}</span>
          <span class="colon">秒</span>
        </template>
      </van-count-down>

      <!-- <van-count-down :time="second_step_start_time">
        <template #default="timeData">
          主任务停留时间：
          <span class="zy-font">{{ timeData.minutes }}</span>
          <span class="colon">分</span>
          <span class="zy-font">{{ timeData.seconds }}</span>
          <span class="colon">秒</span>
        </template>
      </van-count-down> -->

      <van-button
        round
        type="info"
        size="large"
        style="margin: 20px auto 40px"
        @click="verifySecond"
        >下一步</van-button
      >
    </div>

    <div
      class="flow-mission-second"
      v-if="status == 2.5"
      style="font-weight: 600; font-size: 14px"
    >
      <div class="flow-mission-title">
        <!-- <div class="next-step-btn" style="font-weight: 400;" @click="changeStatus(2)">上一步</div> -->
        核对商品价格
      </div>

      <div>
        此任务为多商品任务，您需要将多款商品加入购物车，这里重点核对主商品价格是否正确
      </div>

      <div>
        任务总担保金额：<span class="zy-font">{{
          missionDetailInfo.price * missionDetailInfo.num
        }}</span>
      </div>
      <!-- <div>
        共需拍下商品：<span class="zy-font"
          >{{ missionDetailInfo.sec_baby.length + 1 }}种</span
        >
      </div> -->
      <div>
        主商品单价：<span class="zy-font"
          >{{ missionDetailInfo.price || "0.00" }}元</span
        >
      </div>
      <div>
        型号：<span class="zy-font">{{ missionDetailInfo.mode || "--" }}</span>
      </div>

      <div>请核对担保金额与目标商品价格是否一致</div>
      <div>请务必认真核对产品金额之后选择进行下一步</div>
      <div>请仔细核对</div>

      <van-radio-group v-model="is_check_amount">
        <div style="margin-bottom:10px"> <van-radio name="1">两者价格一致或存在小额差价</van-radio></div>
        <div> <van-radio name="2">两者差价>=50</van-radio></div> 
      </van-radio-group>

      <van-button
        round
        type="info"
        size="large"
        style="margin: 20px auto 40px"
        @click="checkSecondStep"
        >下一步</van-button
      >
    </div>

    <div class="flow-mission-third" v-if="status == 3">
      <div class="flow-mission-title">
        <div class="next-step-btn" @click="changeStatus(2)">上一步</div>
        第三步
      </div>

      <div style="font-weight: 600" v-if="checkGroupList.length > 0">请完成以下操作，并在完成后勾选对应按钮</div>
      <van-checkbox-group v-model="result" v-if="checkGroupList.length > 0">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in checkGroupList"
            clickable
            :key="item"
            :title="item"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>

      <div>
        假聊内容：<span v-if="!missionDetailInfo.jl_desc" class="zy-font"
          >暂无内容</span
        >
      </div>
      <div class="desc-content" v-if="missionDetailInfo.jl_desc">
        <span>{{ missionDetailInfo.jl_desc }}</span>
      </div>



      <!-- <div style="font-weight: 600">请找到以下商品，并按要求添加购物车</div>
      <div
        class="sys-item"
        v-for="(item, index) in missionDetailInfo.sec_baby"
        :key="index"
      >
        <div class="sys-item-pic">
          <img :src="isTemplateApp ? item.phone_url : item.main_url" />
        </div>
        <div class="sys-item-content">
          <div class="sys-item-content_desc">
            {{ item.name }}
          </div>
          <div class="sys-item-content_other">
            件数：{{ item.num || 0 }} 型号：{{ item.mode || "--" }} 价格：{{
              item.price || 0
            }}
          </div>
        </div>
      </div> -->

      <div class="create-account-image">
        <div class="create-account-image_title">
          <div style="font-weight: 600">上传足迹浏览图：</div>
          <!-- <div class="upLoad-btn">上传图片</div> -->
        </div>
        <p>请按照下方右侧示例图模板上传正确图片</p>
        <div class="create-account-image_content">
          <van-uploader
            v-model="fileList1"
            :deletable="false"
            :after-read="upLoadFootImage"
            :max-count="1"
          />
          <div
            class="create-account-image_pic"
            @click="previewImage(shotScreen.foot_pic)"
          >
            <img :src="shotScreen.foot_pic" />
          </div>
        </div>
      </div>

      <div>
        任务说明：<span v-if="!missionDetailInfo.description" class="zy-font"
          >暂无任务说明</span
        >
      </div>
      <div class="desc-content" v-if="missionDetailInfo.description">
        <span>{{ missionDetailInfo.description }}</span>
      </div>

      <div>
        温馨提示：请勿在此步骤下单,需要在第四步对商品型号等信息进行确认后再下单付款。
      </div>

      <van-count-down :time="third_time">
        <template #default="timeData">
          任务释放时间：
          <span class="zy-font">{{ timeData.minutes }}</span>
          <span class="colon">分</span>
          <span class="zy-font">{{ timeData.seconds }}</span>
          <span class="colon">秒</span>
        </template>
      </van-count-down>

      <van-count-down :time="remain_time">
        <template #default="timeData">
          主产品停留倒计时：
          <span class="zy-font">{{ timeData.minutes }}</span>
          <span class="colon">分</span>
          <span class="zy-font">{{ timeData.seconds }}</span>
          <span class="colon">秒</span>
        </template>
      </van-count-down>

      <van-count-down :time="remain_time">
        <template #default="timeData">
          <van-button
            v-if="timeData.minutes || timeData.seconds"
            disabled
            round
            type="info"
            size="large"
            style="margin-top: 20px"
            >{{ timeData.minutes }}分{{ timeData.seconds }}秒</van-button
          >
          <van-button
            v-else
            round
            :disabled="third_step_btn_status"
            type="info"
            size="large"
            style="margin-top: 20px"
            @click="checkThirdStep"
            >下一步</van-button
          >
        </template>
      </van-count-down>
    </div>

    <div class="flow-mission-third" v-if="status == 4">
      <div class="flow-mission-title">
        <div class="next-step-btn" @click="changeStatus(3)">上一步</div>
        第四步
      </div>

      <div>请核对一下信息，确认无误后拍下付款</div>

      <van-checkbox-group v-model="step_four_result">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in checkOrderList"
            clickable
            :key="item"
            :title="item"
            @click="toggle1(index)"
          >
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes1" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>

      <div style="font-weight: 600">
        <span class="warn-font">友情提示</span>：如果实际付款金额差价超过<span
          class="warn-font"
          >500</span
        >元，<span class="warn-font">请不要下单付款</span>，否则无法提交订单！
        <span class="zy-font">不能信用卡 花呗 淘金币 红包付款</span>
      </div>

      <van-field
        v-model="order_no"
        center
        clearable
        label=""
        placeholder="请输入订单号"
      >
        <!-- <template #button>
          <div class="verify-btn">验证</div>
        </template> -->
      </van-field>

       <van-field
        v-model="buyer_pay"
        center
        type="digit"
        clearable
        label=""
        maxlength=8
        placeholder="请输入您的实际付款金额"
      >
      </van-field>

      <div class="create-account-image">
        <div class="create-account-image_title">
          <div style="font-weight: 600">上传付款截图：</div>
          <!-- <div class="upLoad-btn">上传图片</div> -->
        </div>
        <div class="create-account-image_content">
          <van-uploader
            v-model="fileList2"
            :deletable="false"
            :after-read="upLoadOrderImage"
            :max-count="1"
          />
          <div
            class="create-account-image_pic"
            @click="previewImage(shotScreen.pay_pic)"
          >
            <img :src="shotScreen.pay_pic" />
          </div>
        </div>
      </div>

      <van-count-down :time="four_time">
        <template #default="timeData">
          任务释放时间：
          <span class="zy-font">{{ timeData.minutes }}</span>
          <span class="colon">分</span>
          <span class="zy-font">{{ timeData.seconds }}</span>
          <span class="colon">秒</span>
        </template>
      </van-count-down>

      <van-button
        round
        type="info"
        size="large"
        style="margin-top: 20px"
        @click="verifyAll"
        >下一步</van-button
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
  getOrderDetail,
  getStepOneOrder,
  verifyFlowMission,
  verifySaleMission,
  verifyStep,
} from "@/service/order";
import {
  completeImgUrl,
  getFlowTypes,
  getPlatFormByType,
  missionSort,
} from "@/lib/helper";
import { Dialog, ImagePreview, Toast } from "vant";
import { upLoadImage } from "@/lib/uploadImage";
import { getToken } from "@/lib/cache";
import { SHOT } from "@/constance/screenShot"

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
  second_time: number = new Date("2020-11-5 00:00:00").getTime();
  third_time: number = new Date("2020-11-5 00:00:00").getTime();
  four_time: number = new Date("2020-11-5 00:00:00").getTime();
  remain_time: number = 0;
  status = 1;

  preview_one: string =
    "https://imgqn.smm.cn/production/b/image/uWnnd20201124220314.png";
  preview_two: string =
    "https://imgqn.smm.cn/production/b/image/jhVmc20201124220347.png";
  preview_three: string =
    "https://imgqn.smm.cn/production/b/image/vpQIF20201124220406.png";

  missionDetailInfo: any = {
    option: {
      flow_type: "",
    },
  };

  fileList = [];
  fileList1 = [];
  fileList2 = [];
  fileList3 = [];

  searchImage = "";
  footImage = "";
  ordreImage = "";

  id: any = "";

  showRules: boolean = true;

  shop_name: string = "";
  goods_title: string = "";
  order_no: string = ""; // 订单编号
  buyer_pay: any = "" // 付款金额

  is_check_amount: string = "1";

  second_step_start_time: any = "";
  second_step_time: any = "";
  second_step_btn_status: boolean = false;

  third_step_start_time: any = "";
  third_step_time: any = "";
  third_step_btn_status: boolean = false;

  shotScreen:any = SHOT

  created() {
    this.getBuyerInfo();

    const { id } = routerHelper.getData();
    this.id = id;

    this.getDetailInfo();
  }

  mounted() {
    window.removeEventListener("scroll", () => {
      console.log("移除成功");
    },true);

    
  }

  mapNumToFont(num: number) {
    if (num == 2) return "两";
    if (num == 3) return "三";
  }

  toggle(index: number) {
    (this.$refs as any).checkboxes[index].toggle();
  }

  toggle1(index: number) {
    (this.$refs as any).checkboxes1[index].toggle();
  }

  toggleStep(index: number) {}

  checkGroupList: any = [];
  checkOrderList: any = [];

  destroyed() {
    const access_token = getToken();
    // 第二步没有完成就退出了
    if (!this.second_step_btn_status) {
      const second_step_value = {
        token: access_token,
        already_time: Date.now() - this.second_step_time + this.second_remain_time,
      };
      console.log("destroyed destroyed destroyed destroyed", second_step_value);
      console.log(
        "destroyed destroyed destroyed destroyed",
        this.second_step_time
      );
      window.localStorage.setItem(
        `second_step`,
        JSON.stringify(second_step_value)
      );
    }
  }

  second_remain_time:any = 0;

  // 任务二倒计时
  startSecondCountTime() {
    // const second_info_str = window.localStorage.getItem("second_step");
    // let second_info: any = "";
    // if (second_info_str) {
    //   second_info = JSON.parse(second_info_str);
    // }

    // if (second_info) {
    //   // 获取开始时间
    //   let remain_time = 1000 * 60 * 10
    //   if (second_info.already_time) {
    //     remain_time = 1000 * 60 * 10 - second_info.already_time;
    //     this.second_remain_time = second_info.already_time
    //   }
    //   this.second_step_start_time = remain_time;
    //   this.second_step_time = Date.now();
    //   const timer = setTimeout(() => {
    //     this.second_step_btn_status = true;
    //   }, remain_time);
    // } else {
    //   this.second_step_start_time = 1000 * 60 * 10;
    //   this.second_step_time = Date.now();
    //   const timer = setTimeout(() => {
    //     this.second_step_btn_status = true;
    //   }, 1000 * 60 * 10);
    // }
  }

  startThirdCountTime() {
    const timer = setTimeout(() => {
      this.third_step_btn_status = true;
    }, this.remain_time);
  }

  getDetailInfo() {
    getOrderDetail(this.id).then((data) => {
      if (data && data.data) {
        this.missionDetailInfo = data.data;
        this.missionDetailInfo.option = JSON.parse(
          this.missionDetailInfo.option
        );
        // this.missionDetailInfo.sec_baby = JSON.parse(
        //   this.missionDetailInfo.sec_baby
        // );
        this.status = (data.data as any).step;

        if (this.status == 3) {
          if (this.missionDetailInfo.hb) {
            this.checkGroupList.push(
              `货比${this.mapNumToFont(this.missionDetailInfo.hb)}家`
            );
          }
          if (this.missionDetailInfo.hb_time) {
            this.checkGroupList.push(
              `货比${this.mapNumToFont(this.missionDetailInfo.hb_time)}分钟`
            );
          }
          if (this.missionDetailInfo.fbb_see) {
            this.checkGroupList.push(
              `副宝贝浏览${this.mapNumToFont(this.missionDetailInfo.fbb_see)}款`
            );
          }
          if (this.missionDetailInfo.fbb_see_time) {
            this.checkGroupList.push(
              `副宝贝浏览${this.mapNumToFont(
                this.missionDetailInfo.fbb_see_time
              )}分钟`
            );
          }
          if (this.missionDetailInfo.pj_time) {
            this.checkGroupList.push(
              `评价浏览${this.mapNumToFont(this.missionDetailInfo.pj_time)}分钟`
            );
          }
          if (this.missionDetailInfo.jl_time) {
            this.checkGroupList.push(
              `假聊${this.mapNumToFont(this.missionDetailInfo.jl_time)}分钟`
            );
          }
        }
        // let num = 0;
        // if (Array.isArray(this.missionDetailInfo.sec_baby)) {
        //   this.missionDetailInfo.sec_baby.forEach((item: any) => {
        //     num = num + parseInt(item.num);
        //   });
        // }
       
        this.checkOrderList = [
          `店铺名：${this.missionDetailInfo.shop_name}`,
          `件数：${this.missionDetailInfo.num}`,
          `任务总金额${
            this.missionDetailInfo.price * this.missionDetailInfo.num
          }元`,
        ];

        if (this.status == 1) {
          this.end_time =
            parseInt(this.missionDetailInfo.buyer_time) * 1000 +
            1000 * 60 * 30 -
            Date.now();
        } else if (this.status == 2) {
          // this.second_step_start_time = 1000 * 60 * 10;
          this.startSecondCountTime();

          this.second_time =
            parseInt(this.missionDetailInfo.buyer_time) * 1000 +
            1000 * 60 * 55 -
            Date.now();
        } else if (this.status == 3) {
          this.third_step_start_time = 1000 * 60 * 10;
          this.third_time =
            parseInt(this.missionDetailInfo.buyer_time) * 1000 +
            1000 * 60 * 55 -
            Date.now();
          this.remain_time = Number(this.missionDetailInfo.step_time) * 1000 +
            1000 * 60 * 10 -
            Date.now();
            console.log("remain_time remain_time remain_time remain_time",this.remain_time)
        } else {
          this.four_time =
            parseInt(this.missionDetailInfo.buyer_time) * 1000 +
            1000 * 60 * 30 -
            Date.now();
        }
      } else {
        Toast("未知异常");
      }
    });
  }

  form = {
    shop_name: "",
    img_url_one: "",
    img_url_two: "",
  };

  result = [];
  step_four_result = [];

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

  uploadPdd(file: any) {
    this.upLoadImageAction(file.file, 2);
  }

  upLoadImageAction(file: File, index: number) {
    upLoadImage(file).then((res) => {
      if (res && res.data) {
        if (index == 0) {
          this.form.img_url_one = completeImgUrl(res.data.src);
        } else if (index == 1) {
          this.form.img_url_two = completeImgUrl(res.data.src);
        }
      }
    });
  }

  // 上传搜索截图
  upLoadSearchImage(file: any) {
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.searchImage = completeImgUrl(res.data.src);
      }
    });
  }

  upLoadFootImage(file: any) {
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.footImage = completeImgUrl(res.data.src);
      }
    });
  }

  upLoadOrderImage(file: any) {
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.ordreImage = completeImgUrl(res.data.src);
      }
    });
  }

  uploadTb(file: any) {
    this.upLoadImageAction(file.file, 0);
  }

  uploadJd(file: any) {
    this.upLoadImageAction(file.file, 1);
  }

  isTemplateApp(flow_type: any) {
    if (flow_type == 2 || flow_type == 5) return "PC";
    else return "APP";
  }

  toUserOrder() {
    routerHelper.to("/userOrder");
  }

  // 验证店铺
  verifyShop() {
    const that = this;
    verifyStep({
      id: that.id,
      type: that.missionDetailInfo.task_type,
      verify_shop_name: that.shop_name,
    }).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          this.getDetailInfo();
        } else {
          Toast(data.origin_data.msg || "未知异常");
        }
      } else {
        Toast("未知异常");
      }
    });
  }

  verifyGoodName() {
    const that = this;
    verifyStep({
      id: that.id,
      type: that.missionDetailInfo.task_type,
      verify_goods_name: that.goods_title,
    }).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          this.getDetailInfo();
        } else {
          Toast(data.origin_data.msg || "未知异常");
        }
      } else {
        Toast("未知异常");
      }
    });
  }

  // 校验第一步
  checkFirstStep() {
    const that = this;
    if (that.missionDetailInfo.step > 1) {
      this.changeStatus(2);
    } else {
      getStepOneOrder({
        id: that.id,
        step: 1,
        type: that.missionDetailInfo.task_type,
      }).then((data) => {
        if (data && data.origin_data) {
          if (data.origin_data.code == 1001) {
            this.getDetailInfo();
          } else {
            if (data.origin_data.code == 1007) {
              Toast("任务已被释放");
              const timer = setTimeout(() => {
                clearTimeout(timer);
                routerHelper.to("/userOrder");
              }, 2500);
            } else {
              Toast(data.origin_data.msg || "未知异常");
            }
          }
        } else {
          Toast("未知异常");
        }
      });
    }
  }

  checkSecondStep() {
    const that = this;
      this.remain_time = Number(this.missionDetailInfo.step_time) * 1000 +
            1000 * 60 * 10 -
            Date.now();
    if (that.missionDetailInfo.step > 2) {
      this.changeStatus(3);
    } else {
      getStepOneOrder({
        id: that.id,
        step: 2,
        type: that.missionDetailInfo.task_type,
        ss_img: that.searchImage,
        is_check_amount: this.is_check_amount == "1" ? "0" : "1",
      }).then((data) => {
        if (data && data.origin_data) {
          if (data.origin_data.code == 1001) {
            this.getDetailInfo();
          } else {
            if (data.origin_data.code == 1007) {
              Toast("任务已被释放");
              const timer = setTimeout(() => {
                clearTimeout(timer);
                routerHelper.to("/userOrder");
              }, 2500);
            } else {
              Toast(data.origin_data.msg || "未知异常");
            }
          }
        } else {
          Toast("未知异常");
        }
      });
    }
  }

  checkThirdStep() {
    const that = this;
    console.log("result result result", this.result);
    if (that.missionDetailInfo.step > 3) {
      this.changeStatus(4);
    } else {
      if (!this.footImage) {
        Toast("请上传足迹截图");
        return;
      }

      if (this.result.length != this.checkGroupList.length) {
        Toast("请完成对应的操作并打勾");
        return;
      }
      getStepOneOrder({
        id: that.id,
        step: 3,
        type: that.missionDetailInfo.task_type,
        zj_img: that.footImage,
      }).then((data) => {
        if (data && data.origin_data) {
          if (data.origin_data.code == 1001) {
            this.getDetailInfo();
          } else {
            if (data.origin_data.code == 1007) {
              Toast("任务已被释放");
              const timer = setTimeout(() => {
                clearTimeout(timer);
                routerHelper.to("/userOrder");
              }, 2500);
            } else {
              Toast(data.origin_data.msg || "未知异常");
            }
          }
        } else {
          Toast("未知异常");
        }
      });
    }
  }

  verifySecond() {
    console.log("verifySecond verifySecond")
    if (this.missionDetailInfo.is_goods_name != 1) {
      Toast("请先验证商品标题");
      return;
    }
    if (this.missionDetailInfo.is_shop_name != 1) {
      Toast("请先验证店铺标题");
      return;
    }
    if (!this.searchImage) {
      Toast("请先上传搜索截图");
      return;
    }
    this.changeStatus(2.5);
  }

  // 验证的接口
  verifyAll() {
    const form = this.form;
    const that = this;

    if (!this.order_no) {
      Toast("请填写订单号");
      return;
    }

    if (!this.ordreImage) {
      Toast("请上传付款截图");
      return;
    }

    if(!this.buyer_pay){
       Toast("请填写您的实际付款金额");
      return;
    }

    if (this.step_four_result.length != this.checkOrderList.length) {
      Toast("请核对信息并勾选");
      return;
    }

    getStepOneOrder({
      id: that.id,
      step: 4,
      buyer_pay: that.buyer_pay,
      order_number: that.order_no,
      type: that.missionDetailInfo.task_type,
      fk_img: that.ordreImage,
    }).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          Dialog({
            title: "通知",
            message: "提交成功，等待商家审核",
          }).then((data) => {
            routerHelper.to("/userOrder");
          });
        } else {
          if (data.origin_data.code == 1007) {
            Toast("任务已被释放");
            const timer = setTimeout(() => {
              clearTimeout(timer);
              routerHelper.to("/userOrder");
            }, 2500);
          } else {
            Toast(data.origin_data.msg || "未知异常");
          }
        }
      } else {
        Toast("未知异常");
      }
    });

    // verifySaleMission(this.id, form).then((data) => {
    //   if (data && data.origin_data && data.origin_data.code == 1001) {
    //     Dialog({
    //       title: "通知",
    //       message: "提交成功，等待商家审核",
    //     }).then((data) => {
    //       routerHelper.to("/userOrder");
    //     });
    //   }
    // });
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

.warn-font {
  color: #ff9900;
}

.bs-font-1 {
  color: indianred;
}

.flow-mission-container {
  .flow-mission-pic {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
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

.verify-btn-exist {
  width: 80px;
  @include setHeight(30px);
  display: inline-block;
  border-radius: 20px;
  text-align: center;
  background: #4882f0;
  font-size: 14px;
  color: #fff;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.rules-block {
  width: 340px;
  height: auto;
  background-color: #fff;
  .rules-block_title {
    font-size: 18px;
    @include setHeight(50px);
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  .rules-block_content {
    box-sizing: border-box;
    padding: 10px 15px;
    font-size: 14px;
    text-align: left;
    margin-bottom: 3px;
  }

  .rules-confirm {
    font-size: 14px;
    text-align: center;
    padding: 0px 15px 10px;
  }

  .btn-list-1 {
    @include flex(space-around);
    padding-bottom: 20px;
    & > div {
      width: 120px;
      @include setHeight(40px);
      text-align: center;
      background: #447ee9;
      border-radius: 30px;
      color: #fff;
    }
  }
}

.desc-content {
  font-size: 14px;
  color: #000;
  box-sizing: border-box;
  padding: 5px;
  height: 100px;
  overflow: scroll;
  font-weight: 600;
  border: 2px solid #ddd;
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

.sys-item {
  @include flex(flex-start);
  .sys-item-pic {
    width: 80px;
    height: 80px;
  }
  .sys-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    .sys-item-content_desc {
      max-height: 70px;
    }
    .sys-item-content_other {
      flex: 1;
    }
  }
}
</style>
