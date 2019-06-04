<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'权限管理'" :navtwo="'权限列表'"/>
    <!-- 权限列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="权限路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <template
          slot-scope="scope"
        >{{scope.row.level==='0'?'一级':scope.row.level === '1'?'二级':'三级'}}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  data() {
    return {
      tableData: [] //权限数据
    };
  },
  methods: {
    //获取权限数据
    async getRightsList() {
      let res = await this.$http.get("rights/list");
      let { data, meta } = res.data;
      if (meta.status == 200) {
        this.tableData = data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  }, 
  mounted() {
    //加载权限数据
    this.getRightsList();
  },
  components: {
    BreadNav
  }
};
</script>

<style>
</style>
