<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'商品管理'" :navtwo="'商品列表'"/>
    <!-- 搜索栏 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchclick"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        &nbsp;
        <el-button type="success" plain @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table :border="true" :data="goodslistTable" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column  label="创建时间" width="180">
        <template slot-scope="scope">
          {{scope.row.add_time | myfilter('YYYY-MM-DD hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
        <el-button plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <!-- 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
       -->
     <el-pagination
     
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  data() {
    return {

      goodslistTable: [],
      currentPage: 1,
      pagesize: 10,
      pagesizes: [10,50,100],
      total:0,
      search: ""
    };
  },
  methods: {
    //获取商品数据
    async getGoodsList() {
      let res = await this.$http.get(`goods?pagenum=${this.currentPage}&pagesize=${this.pagesize}&query=${this.search}`);
      //   console.log(res.data);
      //解构
      let { meta, data } = res.data;

      if (meta.status == 200) {
          this.total = data.total
          this.goodslistTable = data.goods
      }else{
          this.$message.error(meta.msg)
      }
    },
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val
      //重新加载数据
      this.getGoodsList()
    },
    //获取页容量
    handleSizeChange  (val){
      this.pagesize = val
      //重新加载数据
      this.getGoodsList()
    },
    // 提交搜索内容
    searchclick(){
      //重新加载数据
      this.getGoodsList()
    },
    //跳转页面
    addGoods(){
      this.$router.push('/goods/add')
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
