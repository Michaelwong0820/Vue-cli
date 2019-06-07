<template>
  <div id="Bmap">orders</div>
</template>

<script>
export default {
  mounted() {
    //创建地图实例
    var map = new BMap.Map("Bmap");
    //创建中心点
    var point = new BMap.Point(115.075796, 23.659684);
   
    // 地图初始化
    map.centerAndZoom('深圳', 14);
    //添加平移缩放控件
    map.addControl(new BMap.NavigationControl());
    //比例尺
    map.addControl(new BMap.ScaleControl());
    //缩略地图
    map.addControl(new BMap.OverviewMapControl());
    //地图类型
    map.addControl(new BMap.MapTypeControl());
  //允许滚动缩放
    map.enableScrollWheelZoom(true);
    //允许双击缩放
    map.enableDoubleClickZoom(true);
    //添加地标
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    
  }
};
</script>

<style scoped>
#Bmap {
  width: 1100px;
  height: 500px;
}
</style>
