<template>
  <div class="table-container">
      <el-pagination
        background
        layout="prev, pager, next,total,jumper"
        :total="1000">
      </el-pagination>
  </div>
</template>


<script lang="ts">
// 地址插件的选择
import { Component, Prop, Vue } from "vue-property-decorator";

interface IEdata{
  label: string
  value: string | number
}

@Component
export default class Header extends Vue {
  @Prop() private msg!: string; // 感叹号表示必选

  created(){
    
  }

}
</script>

<style scoped lang="scss">
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

.address-container{
    width: 500px;
    @include flex(flex-start);
    & > div{
      width:150px;
      margin-right: 10px;
    }
}
</style>



