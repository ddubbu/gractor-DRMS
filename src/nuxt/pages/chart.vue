<template>
  <div id="main" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from "echarts";
// import { init } from "echarts";
export default {
  mounted() {
    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(document.getElementById("main"));

    // specify chart configuration item and data
    var option = {
      title: {
        text: "ECharts entry example",
      },
      tooltip: {},
      legend: {
        data: ["Sales"],
      },
      xAxis: {
        data: ["shirt", "cardign", "chiffon shirt", "pants", "heels", "socks"],
      },
      yAxis: {},
      series: [
        {
          name: "Sales",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
  },
};
</script>

<style lang="scss" scoped>
</style>