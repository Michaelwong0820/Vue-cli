<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'商品管理'" :navtwo="'商品管理'"/>
    <!-- 新增按钮 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 商品分类表格 -->
    <!-- 
        prop: 当前列显示的数据属性
        label：表头的名称
        treeKey: 当前数据的唯一标识
        parentKey: 当前元素的父元素
        levelKey: 当前元素的级别
    -->
    <el-table :border="true" :data="pagelist" style="width: 100%;height:200px">
      <el-table-tree-column
        file-icon="icon icon-file"
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        fixed
      ></el-table-tree-column>
      <el-table-column  label="级别" fixed>
        <template
          slot-scope="scope"
        >{{scope.row.cat_level==0?"一级":scope.row.cat_level ==1 ?"二级":"三级"}}</template>
      </el-table-column>
      <el-table-column prop="address" label="是否有效" fixed>
        <template slot-scope="scope">{{scope.row.cat_deleted?"过期":"有效"}}</template>
      </el-table-column>
      <el-table-column prop="address" label="操作" fixed>
        <el-button type="primary" size="mini" icon="el-icon-edit" plain></el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" plain></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页导航栏 -->
    <!-- 
        current-page:当前页
        pagesizes:选择页容量
        pagesize:页容量
        layout:组件布局
        total:总条数
     -->
    <el-pagination
    
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

  </el-card>
</template>

<script>
//引入面包屑导航
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  components: {
    BreadNav
  },
  data() {
    return {
      pagelist:[],
      catLists: [],
      pagesizes:[5,10,15],
      pagesize:5,
      total:0,
      currentpage:1
    }
  },
  methods: {
    //获取商品分类数据
    async getCatList() {
      let res = await this.$http.get("categories?type=3");
      //   console.log(res);
      //解构
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.catLists = data;
        this.total = data.length
        //获取页容量数据
        this.getPageList()
      } else {
        this.$message.error(meta.msg);
      }
    },
    //点击页码事件
    handleCurrentChange(val){
        //获取当前页
        // console.log(val);
        this.currentpage = val
        this.getPageList()
    },
    //获取页容量的数据
    getPageList(){
        //计算当前页获取的数据条数
        let start = (this.currentpage-1)*this.pagesize//开始
        let end = this.currentpage*this.pagesize//结束
        //假分页列表数据
        this.pagelist=this.catLists.slice(start,end)
        
    },
    //改变页容量
    handleSizeChange(val) {
        this.pagesize=val
        this.getPageList()
    }
  },
  mounted() {
    this.getCatList();
  }
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
