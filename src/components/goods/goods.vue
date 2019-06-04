<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'商品管理'" :navtwo="'商品列表'"/>
    <!-- 搜索栏 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        &nbsp;
        <el-button type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :border="true" :data="goodslistTable" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
        <el-button plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  data() {
    return {
      goodslistTable: [],
      pagenum: 1,
      pagesize: 10,
      query: ""
    };
  },
  methods: {
    //获取商品数据
    async getGoodsList() {
      let res = await this.$http.get("goods", {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        }
      });
      //   console.log(res.data);
      //解构
      let { meta, data } = res.data;

      if (meta.status == 200) {
          this.goodslistTable = data.goods
      }else{
          this.$message.error(meta.msg)
      }
    }
  },
  mounted() {
    //加载数据
    this.getGoodsList();
  },
  //引入面包屑导航组件
  components: {
    BreadNav
  }
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
