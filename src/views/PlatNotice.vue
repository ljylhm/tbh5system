<template>
  <div class="plat-notice-container">
    <div class="person-left">
      <Slide :current-index="'/platNotice'" />
    </div>
    <div class="person-right">
        <v-table></v-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Slide from "@/components/Slide.vue"; // @ is an alias to /src
import { confirmMessageOne } from "@/lib/notice";
import OpenFile from "@/lib/openFile";
import VTable from "@/components/VTable.vue";

const DEFAUL_EDITSHOPNAMEFORM = {
  origin_name: "",
  current_name: "",
  pay_pwd: "",
};


@Component({
  components: {
    Slide,
    VTable
  },
})
export default class BlackList extends Vue {
  showEditShopNameModal: boolean = false; // 是否展示修改店铺的弹框
  showShopDetailModal: boolean = false; // 是否展示店铺详情
  showBindShopModal: boolean = false; // 是否展示绑定店铺弹框
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

.font-18{
  font-size: 18px;
}

.font-14{
  font-size: 14px;
}

.upload-container {
  @include flex(flex-start);
  align-items: center;
  .upload-image {
    width: 80px;
    height: 80px;
    & img {
      width: 100%;
      height: 100%;
    }
    margin-right: 10px;
  }
  .upload-content {
    width: 80px;
    height: 80px;
    border: 1px dashed #d9d9d9;
    margin-right: 10px;
    .upload-content-icon {
      font-size: 20px;
      color: #8c939d;
      width: 80px;
      @include setHeight(80px);
      text-align: center;
      cursor: pointer;
    }
    &:hover {
      border-color: #409eff;
    }
  }
}

.el-table td,
.el-table th {
  text-align: center;
}

.plat-notice-container {
  width: 1400px;
  height: 400px;
  text-align: left;
  margin: 20px auto 0px;
  @include flex(flex-start);
  flex-wrap: nowrap;
  .person-left {
    width: 180px;
  }
  .person-right {
    padding-left: 30px;
    flex: 1;
  }

}

</style>
