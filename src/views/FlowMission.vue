<template>
  <div class="flow-mission-container">
    <VHeader :msg="'流量任务'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'接手管理'"></VFooter>

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
          src="http://129.211.87.79/uploads/2020-11-18-14-06-11-5fb52a534d822.jpg"
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

      <van-count-down :time="second_time">
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

      <div>店铺名：{{ missionDetailInfo.shop_name || "---" }}</div>
      <div>掌柜名：{{ missionDetailInfo.shopkeeper || "---" }}</div>
      <div>
        搜索关键字：<span class="zy-font">{{
          getFlowTypes(missionDetailInfo.option.flow_type)
        }}</span>
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

      <div class="create-account-image">
        <p style="font-weight: 600">搜索页面截图：</p>
        <p>请按照下方右侧示例图模板上传正确图片</p>
        <div
          class="create-account-image_content"
          @click="beforeUpload('搜索', 'search')"
        >
          <van-uploader
            v-model="fileList"
            :deletable="true"
            @delete="afterDel('search')"
            :after-read="upLoadCommon"
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

      <div class="create-account-image">
        <div class="create-account-image_title">
          <div style="font-weight: 600">评价页面截图：</div>
          <!-- <div class="upLoad-btn">上传图片</div> -->
        </div>
        <p>请按照下方右侧示例图模板上传正确图片</p>
        <div
          class="create-account-image_content"
          @click="beforeUpload('评价', 'comment')"
        >
          <van-uploader
            v-model="fileList1"
            :deletable="true"
            @delete="afterDel('comment')"
            :after-read="upLoadCommon"
            :max-count="1"
          />
          <div
            class="create-account-image_pic"
            @click="previewImage(shotScreen.comment_pic)"
          >
            <img :src="shotScreen.comment_pic" />
          </div>
        </div>
      </div>

      <div
        class="create-account-image"
        v-for="(item, key) in picList"
        :key="key"
      >
        <div class="create-account-image_title">
          <div style="font-weight: 600">{{ item.name }}页面截图：</div>
          <!-- <div class="upLoad-btn">上传图片</div> -->
        </div>
        <p>请按照下方右侧示例图模板上传正确图片</p>
        <div
          class="create-account-image_content"
          @click="beforeUpload(item.name, item.key)"
        >
          <van-uploader
            v-model="fileListArr[key]"
            :deletable="true"
            @delete="afterDel(item.key)"
            :after-read="upLoadCommon"
            :max-count="1"
          />
          <div
            class="create-account-image_pic"
            @click="previewImage(getPreviewModelPic(item.key))"
          >
            <img :src="getPreviewModelPic(item.key)" />
          </div>
        </div>
      </div>

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
import { SHOT } from "@/constance/screenShot";

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

  status = 1;
  shop_name = "";

  preview_one: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao1.png";
  preview_two: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao2.png";
  preview_three: string =
    "http://img.baishou123.cn/public/home/images/pddmaihao3.png";

  shotScreen: any = SHOT;

  missionDetailInfo: any = {
    option: {
      flow_type: "",
    },
  };

  fileListArr = [[], [], [], [], [], [], []];

  fileList = [];
  fileList1 = [];

  id: any = "";

  picList: any = [];

  resForm: any = [];

  created() {
    this.getBuyerInfo();

    const { id } = routerHelper.getData();
    this.id = id;

    this.getDetailInfo();

    // window.addEventListener("scroll", () => {
    //   if (getScrollTop() + getWindowHeight() + 30 >= getScrollHeight()) {
    //   }
    // });
  }

  afterDel(key: string) {
    let select_index = "";
    console.log("key", this.resForm, key);
    this.resForm.forEach((item: any, index: any) => {
      if (item.key == key) select_index = index;
    });
    this.resForm.splice(select_index, 1);
  }

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

  getPreviewModelPic(key: string) {
    if (key == "scsp") return this.shotScreen.collect_pic;
    if (key == "scdp") return this.shotScreen.collect_shop_pic;
    if (key == "jrgwc") return this.shotScreen.buyer_car_pic;
    if (key == "wwzx") return this.shotScreen.ww_ask_pic;
    if (key == "lyhq") return this.shotScreen.card_ticket_pic;
  }

  mapTpPic: any = {
    scsp: "收藏商品",
    scdp: "收藏店铺",
    jrgwc: "加入购物车",
    wwzx: "旺旺咨询",
    lyhq: "领优惠劵",
  };

  getDetailInfo(is_replace: boolean = false) {
    getOrderDetail(this.id).then((data) => {
      if (data && data.data) {
        this.missionDetailInfo = data.data;
        this.missionDetailInfo.option = JSON.parse(
          this.missionDetailInfo.option
        );
        this.missionDetailInfo.ll_extra = JSON.parse(
          this.missionDetailInfo.ll_extra
        );

        let tempList = [];
        for (let i in this.missionDetailInfo.ll_extra) {
          if (this.missionDetailInfo.ll_extra[i]) {
            tempList.push({
              name: this.mapTpPic[i],
              key: i,
              value: this.missionDetailInfo.ll_extra[i],
            });
          }
        }

        if (is_replace) {
          this.picList = tempList;
        } else {
          this.picList = this.picList.concat(tempList);
        }

        const status = this.missionDetailInfo.step;
        this.status = status;
        if (status == 1) {
          this.end_time =
            parseInt(this.missionDetailInfo.buyer_time) * 1000 +
            1000 * 60 * 30 -
            Date.now();
        }
        if (status == 2) {
          this.second_time =
            parseInt(this.missionDetailInfo.buyer_time) * 1000 +
            1000 * 60 * 55 -
            Date.now();
        }
      }
    });
  }

  beforeDestory() {
    console.log("beforeDestory");
    // 卸载掉scroll监听事件
    window.removeEventListener("scroll", () => {}, true);
  }

  form = {
    shop_name: "",
    img_url_one: "",
    img_url_two: "",
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

  tempForm = {
    name: "",
    key: "",
  };

  beforeUpload(name: string, key: string) {
    console.log("xxx", "beforeUpload", name, key);
    this.tempForm = {
      name,
      key,
    };
  }

  upLoadCommon(file: any) {
    upLoadImage(file.file).then((res) => {
      if (res && res.data) {
        this.resForm.push(
          Object.assign({}, this.tempForm, {
            url: completeImgUrl(res.data.src),
          })
        );
      }
    });
  }

  uploadTb(file: any) {
    console.log("xxx", file.file);
    this.upLoadImageAction(file.file, 0);
  }

  uploadJd(file: any) {
    this.upLoadImageAction(file.file, 1);
  }

  // 验证的接口
  verifyAll() {
    const form = this.form;
    const that = this;
    if (this.missionDetailInfo.is_shop_name == 0) {
      Toast("请先验证店铺名");
      return;
    }
    if (this.resForm.length != this.picList.length + 2) {
      Toast("请将截图上传完整");
      return;
    }

    console.log("xxxx", this.resForm);

    getStepOneOrder({
      id: that.id,
      step: 3,
      type: that.missionDetailInfo.task_type,
      verify: that.resForm,
    }).then((data) => {
      if (data && data.origin_data) {
        if (data.origin_data.code == 1001) {
          routerHelper.to("/userOrder");
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

    // verifyFlowMission(this.id, form).then((data) => {
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

  // 校验第二步
  checkSecondStep() {
    const that = this;
    if (that.missionDetailInfo.step > 2) {
      this.changeStatus(3);
    } else {
      getStepOneOrder({
        id: that.id,
        step: 2,
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

  // 校验第三步
  checkThirdStep() {
    const that = this;
    getStepOneOrder({
      id: that.id,
      step: 2,
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
</style>
