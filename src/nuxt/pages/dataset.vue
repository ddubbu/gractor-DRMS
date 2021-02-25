<template>
  <div id="main" style="width: 600px; height: 400px" />
</template>

<script>
<<<<<<< HEAD
import * as echarts from 'echarts'
=======
import * as echarts from 'echarts';
>>>>>>> 8d55f05b308f4b0931bbe80fba0796e40ec347a3
// import { init } from "echarts"; <-- 이렇게 꺼내거나
export default {
  mounted() {
    // based on prepared DOM, initialize echarts instance
<<<<<<< HEAD
    const $dom = document.getElementById('main')
    var myChart = echarts.init($dom)
=======
    const $dom = document.getElementById('main');
    var myChart = echarts.init($dom);
>>>>>>> 8d55f05b308f4b0931bbe80fba0796e40ec347a3

    // specify chart configuration item and data
    const option = {
      legend: {},
      tooltip: {},
      dataset: {
        // Provide data.
        source: [
          ['product', '2015', '2016', '2017'],
          ['Matcha Latte', 43.3, 85.8, 93.7],
          ['Milk Tea', 83.1, 73.4, 55.1],
          ['Cheese Cocoa', 86.4, 65.2, 82.5],
          ['Walnut Brownie', 72.4, 53.9, 39.1],
        ],
      },
      // Declare X axis, which is a category axis, mapping
      // to the first column by default.
      xAxis: { type: 'category' },
      // Declare Y axis, which is a value axis.
      yAxis: {},
      // Declare several series, each of them mapped to a
      // column of the dataset by default.
<<<<<<< HEAD
      series: [{ type: 'bar', center: ['25%', '30%'] }, { type: 'scatter' }, { type: 'pie' }],
    }
=======
      series: [
        { type: 'bar', center: ['25%', '30%'] },
        { type: 'bar' },
        { type: 'bar' },
      ],
    };
>>>>>>> 8d55f05b308f4b0931bbe80fba0796e40ec347a3

    // use configuration item and data specified to show chart
    myChart.setOption(option)
  },
}
</script>

<style lang="scss" scoped></style>
