<template>
  <!-- <div id="main" style="width: 600px; height: 400px"></div> -->
  <echarts :options="options" />
</template>

<script>
// import * as echarts from "echarts";
// 만약 다른 기능 쓰고 싶으면
// import "echarts/lib/chart/line";
// import "echarts/lib/component/tooltip";
// import "echarts/lib/component/legend";

export default {
  data() {
    return {
      list: [], //! -> pagination
      facility_count: [], //! pie graph,
      options: {},
    };
  },
  mounted() {
    //GET API
    this.getAirTest(callback.bind(this));

    // console.log("this.facility_count", this.facility_count)

    function callback() {
      // based on prepared DOM, initialize echarts instance
      // var myChart = echarts.init(document.getElementById("main"));
      // specify chart configuration item and data
      var options = {
        title: {
          text: "양천구",
          subtext: "다중이용시설",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        dataset: {
          source: this.facility_count,
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "시설군",
            type: "pie",
            radius: "50%",

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // use configuration item and data specified to show chart
      // myChart.setOption(options);
      this.options = options;
    }
  },
  methods: {
    async getAirTest(callback) {
      await this.$axios.get("/api/chart").then(({ data }) => {
        const {
          rows,
          aggregations: {
            "시설군 요약": { buckets: facility_count },
          },
          total,
        } = data;
        console.log("rows", rows);
        console.log("facility_count", facility_count);
        console.log("total", total);

        // data update
        const facility_count_list = facility_count.map((ele) => {
          return [ele.key, ele.doc_count];
        });

        this.facility_count = [["product", "count"], ...facility_count_list];
        console.log("this.facility_count", this.facility_count);

        callback();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
