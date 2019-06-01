<template>
  <el-row>
    <el-col :span="4">
      <div class="mycol">
        <img src="../../../../static/logo.png" alt>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="mycol">
        <h1>电商管理系统</h1>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="mycol layout">
        <a href="#" @click.prevent="logout">退出</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        //移出localStorage
        localStorage.removeItem('token')
        //跳转到登录页面
        this.$router.push({name:'login'})
        })
    }
  }
};
</script>

<style scoped>
.mycol {
  height: 60px;
}
.layout {
  text-align: right;
}
.layout a {
  text-decoration: none;
  color: red;
}
</style>
