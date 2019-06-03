<template>
<!-- 封装面包屑导航条 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >{{ navone }}</el-breadcrumb-item>
      <el-breadcrumb-item >{{ navtwo }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:[
      'navone',
      'navtwo'
    ]
}
</script>

<style>

</style>
