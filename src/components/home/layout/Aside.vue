<template>
  <el-menu
    :unique-opened="true"
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#fff"
    text-color="#333"
    :router="true"
  >
    <!-- 一级菜单 -->
    <el-submenu v-for="(item1,index1) in asideList" :key="index1" :index="item1.path">
      <template  slot="title">
        <i class="el-icon-location"></i>
        <span>{{ item1.authName}}</span>
      </template>
      <!-- 子菜单 -->
      <el-menu-item v-for="(item2,index2) in  item1.children" :key="index2" :index="'/'+item2.path">
        <i class="el-icon-menu"></i>
        <span>{{ item2.authName }}</span>
      </el-menu-item>
    </el-submenu>
  
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      asideList:{}
    }
  },
  methods: {
    //获取左侧导航栏
    async getAsideList(){
      let res = await this.$http.get('menus')
      let {meta,data} = res.data
      if (meta.status == 200) {
        this.asideList  = data
      }else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted() {
    this.getAsideList()
  },
};
</script>

<style >
.el-menu {
  height: 100%;
}
</style>
