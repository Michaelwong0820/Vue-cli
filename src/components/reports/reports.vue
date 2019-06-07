<template>
  <div id="main"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      option: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      }
    };
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    //获取图标数据集
    let res = await this.$http.get("reports/type/1");
    console.log(res);

    //解构
    let { meta, data } = res.data;
    if (meta.status == 200) {
      //合并数据
      let newobp = { ...this.option, ...data };
      //配置选项
      newobp.xAxis[0].type = "category";
      //两侧留白
      newobp.xAxis[0].boundaryGap = false;
      myChart.setOption(newobp);
    }
  }
};
</script>

<style scoped>
#main {
  width: 800px;
  height: 500px;
}
</style>
