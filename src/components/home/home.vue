<template>
  <div class="homeBox">
    <el-container>
      <el-header>
        <TopHead/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Aside/>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopHead from "./layout/TopHead.vue"; //引入顶部组件
import Aside from "./layout/Aside.vue"; //引入侧边栏组件
export default {
  mounted() {
    var token = localStorage.getItem("token");
    if (!token) {
      alert("请登录");
      this.$router.push("/login");
    }
  },
  components: {
    TopHead,
    Aside
  }
};
</script>

<style scoped>
.homeBox {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  /* height: 100%; */
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

.el-container {
  /* margin-bottom: 40px; */
  height: 100%;
}

.el-menu {
  height: 100%;
}
</style>