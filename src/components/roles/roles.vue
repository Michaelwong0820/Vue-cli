<template>
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navone="'权限管理'" :navtwo="'角色列表'"/>
    <el-row class="myrow">
      <el-col :span="8">
        <!-- 新增按钮 -->
        <el-button plain>新增角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色管理 -->
    <el-table :data="roleData" :border="true" style="width: 100%">
      <el-table-column type="expand">
        <!-- 角色展开项 -->
        <template slot-scope="scope">
          <el-row v-for="(item1,index1) in scope.row.children " :key="index1">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="4">
                  <el-tag closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">     
                      <el-tag class="mytag" closable type="warning"  v-for="(item3,index3) in item2.children" :key="index3">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" plain></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" plain></el-button>
          <el-button type="success" size="mini" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import BreadNav from "../home/layout/BreadNav/BreadNav.vue";
export default {
  data() {
    return {
      roleData: []
    };
  },
  methods: {
    async getRoleLise() {
      let res = await this.$http.get("roles");
      //解构
      let { data, meta } = res.data;
      if (meta.status == 200) {
        this.roleData = data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getRoleLise();
  },
  components: {
    BreadNav
  }
};
</script>

<style>
.myrow {
  margin-top: 20px;
}
.mytag {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
