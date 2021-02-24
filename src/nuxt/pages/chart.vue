<template>
  <div id="main" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from "echarts";
// import { init } from "echarts";
export default {
  data() {
    return {
      list: [],  //! -> pagination 
      facility_count : []  //! pie graph
    };
  },
  mounted() {
    //GET API
    this.getAirTest(callback.bind(this));

    // console.log("this.facility_count", this.facility_count)

    function callback(){
      // based on prepared DOM, initialize echarts instance
      var myChart = echarts.init(document.getElementById("main"));
      // specify chart configuration item and data
      var option = {
        title: {
          text: "양천구 시설 현황 ",
          textStyle: {
            // color: "blue",
            
          },
          // padding: 50,
          textAlign: "center",
        },
        dataset: {
          source: this.facility_count
        },
        // tooltip: {},
        // legend: {
        //   data: ["Sales"],
        // },
        // xAxis: {
        //   data: ["shirt", "cardign", "chiffon shirt", "pants", "heels", "socks"],
        // },
        // yAxis: {},
        // series: [
        //   {
        //     name: "Sales",
        //     type: "bar",
        //     data: [5, 20, 36, 10, 10, 20],
        //   },
        // ],
        label:{
          show: true
        },
        series: [
          {
            type: "pie",
                  // radius: '20%',
            // center: ['50%', '50%']
          }
        ]
      };
      // use configuration item and data specified to show chart
      myChart.setOption(option);
    }
  },
  methods: {
    async getAirTest(callback) {
      await this.$axios.get("/api/chart").then(({ data }) => {
        const { 
          rows, 
          aggregations:{
          "시설군 요약" : {
              buckets: facility_count
            }
          },
          total
        } = data
        console.log("rows", rows);
        console.log("facility_count", facility_count);
        console.log("total", total);

        // data update
        const facility_count_list = facility_count.map(ele=>{
          return [ele.key, ele.doc_count]
        })

        this.facility_count = [
          ['product', 'count'],
          ...facility_count_list
        ];
        console.log("this.facility_count", this.facility_count);

        callback();

      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
