<template>
  <div class="user-order-container">
    <VHeader :msg="'系统工单'" :showExitBtn="true"></VHeader>
    <VFooter :msg="'资金管理'"></VFooter>

    <div class="work-order-container">
      <div class="work-order-header">
        <table border="1" bordercolor="#ddd">
          <tr>
            <td width="30%">任务编号：</td>
            <td width="70%">{{ workOrderDetailData.order_no || "--" }}</td>
          </tr>
          <tr>
            <td width="30%">订单编号：</td>
            <td width="70%">{{ workOrderDetailData.order_number || "--" }}</td>
          </tr>
          <tr>
            <td width="30%">工单状态：</td>
            <td width="70%">{{ handleStatus(workOrderDetailData.status) }}</td>
          </tr>
          <tr>
            <td width="30%">工单类型：</td>
            <td width="70%">{{ handleType(workOrderDetailData.type) }}</td>
          </tr>
          <tr>
            <td width="30%">问题分类：</td>
            <td width="70%">  {{
              hanleQuesType(
                workOrderDetailData.type,
                workOrderDetailData.trouble_type
              )
            }}</td>
          </tr>
          <tr>
            <td width="30%">提交时间：</td>
            <td width="70%">{{ workOrderDetailData.created_at }}</td>
          </tr>
          <tr>
            <td width="30%">处理方式：</td>
            <td width="70%">{{ workOrderDetailData.created_at }}</td>
          </tr>
          <tr>
            <td width="30%">处罚金额：</td>
            <td width="70%"></td>
          </tr>
          <tr>
            <td width="30%">处理结果：</td>
            <td width="70%"></td>
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
  getWorkOrderDetailInfo,
  getWorkComment,
  workOrderComment
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

  workOrderDetailData:any = []

  statusType = [
    {
      value: "0",
      label: "待处理",
    },
    {
      value: "1",
      label: "跟进中",
    },
    {
      value: "2",
      label: "处理完成",
    },
    {
      value: "3",
      label: "已撤销",
    },
    {
      value: "4",
      label: "拒绝处理",
    },
  ];

  workOrderDataList: any = [
    {
      label: "订单信息错误",
      value: "1",
    },
    {
      label: "好评问题",
      value: "2",
    },
    {
      label: "其他导致卖家损失的行为",
      value: "3",
    },
    {
      label: "任务过程出错",
      value: "4",
    },
    {
      label: "提醒卖家发货",
      value: "5",
    },
  ];

  workOrderDataListOne: any = [
    {
      label: "订单号正确，买号错误",
      value: "1",
    },
    {
      label: "订单未付款",
      value: "2",
    },
    {
      label: "买号正确，订单号错误",
      value: "3",
    },
    {
      label: "收货地址错误",
      value: "4",
    },
    {
      label: "填错订单号",
      value: "5",
    },
    {
      label: "无对应订单或买号信息",
      value: "6",
    },
    {
      label: "用错买号",
      value: "7",
    },
    {
      label: "用错收货地址",
      value: "8",
    },
  ];

  workOrderDataListTwo: any = [
    {
      label: "没有按照要求进行好评",
      value: "1",
    },
    {
      label: "提醒买手确认收货",
      value: "2",
    },
    {
      label: "未写文字好评",
      value: "3",
    },
    {
      label: "未做晒图好评",
      value: "4",
    },
    {
      label: "在评价时给出负面的评价",
      value: "5",
    },
    {
      label: "在评价时给中差评",
      value: "6",
    },
  ];

  workOrderDataListThree: any = [
    {
      label: "分期付款产生手续费损失",
      value: "1",
    },
    {
      label: "花呗支付产生手续费损失",
      value: "2",
    },
    {
      label: "买手从淘宝客进入",
      value: "3",
    },
    {
      label: "农村淘宝支付产生佣金损失",
      value: "4",
    },
    {
      label: "使用花呗支付",
      value: "5",
    },
    {
      label: "使用信用卡支付",
      value: "6",
    },
    {
      label: "使用余额宝分期支付",
      value: "7",
    },
    {
      label: "淘宝客支付产生佣金损失",
      value: "8",
    },
    {
      label: "信用卡支付产生手续费损失",
      value: "9",
    },
    {
      label: "重复转账",
      value: "10",
    },
  ];

  workOrderDataListFour: any = [
    {
      label: "关键字错误",
      value: "1",
    },
    {
      label: "截图错误",
      value: "2",
    },
    {
      label: "买错商品",
      value: "3",
    },
    {
      label: "没有按照指定来路进入",
      value: "4",
    },
    {
      label: "其他出错的行为",
      value: "5",
    },
    {
      label: "提前确认收货",
      value: "6",
    },
    {
      label: "旺聊错误",
      value: "7",
    },
    {
      label: "违背备注",
      value: "8",
    },
    {
      label: "用错设备",
      value: "9",
    },
  ];

  workOrderDataListFive: any = [
    {
      label: "平台和淘宝上都没有发货",
      value: "1",
    },
    {
      label: "平台上发货了，淘宝上没有发",
      value: "2",
    },
    {
      label: "商家未上传好评图片",
      value: "3",
    },
    {
      label: "淘宝上发货了，平台上没有发",
      value: "4",
    },
  ];
  id:any = ""

  created() {
    const para = routerHelper.getData();
    const id = para.id
    this.id = id

    getWorkOrderDetailInfo(Number(id)).then(data=>{
      if(data){
          this.workOrderDetailData = data.data;
      }
    })

    this.pastPara = para;
    this.getCommentList();
  }

  beforeDestory() {}

  getCommentList() {
    getWorkComment(this.id).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        this.transferComment = data.data;
      }
    });
  }

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

    this.commentForm.work_id = this.id;

    if (this.workOrderDetailData.length > 0) {
      this.commentForm.parent = this.workOrderDetailData[
        this.workOrderDetailData.length - 1
      ].id;
    }

    workOrderComment(this.commentForm).then((data) => {
      if (data && data.origin_data && data.origin_data.code == 1001) {
        Toast.success("提交成功");
        this.getCommentList()
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


  handleStatus(status: any) {
    if (this.statusType[status] && this.statusType[status]["label"]) {
      return this.statusType[status]["label"];
    }
  }

  handleType(task_no: number) {
    if (
      this.workOrderDataList[task_no - 1] &&
      this.workOrderDataList[task_no - 1].label
    ) {
      return this.workOrderDataList[task_no - 1].label;
    }
    return "";
  }

  workQuestionData: any = [];

  hanleQuesType(e: number, order_no: number) {
    if (e == 1) {
      this.workQuestionData = this.workOrderDataListOne;
    }
    if (e == 2) {
      this.workQuestionData = this.workOrderDataListTwo;
    }
    if (e == 3) {
      this.workQuestionData = this.workOrderDataListThree;
    }
    if (e == 4) {
      this.workQuestionData = this.workOrderDataListFour;
    }
    if (e == 5) {
      this.workQuestionData = this.workOrderDataListFive;
    }

    if (
      this.workQuestionData[order_no - 1] &&
      this.workQuestionData[order_no - 1].label
    ) {
      return this.workQuestionData[order_no - 1].label;
    }

    return "";
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
