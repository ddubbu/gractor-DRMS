<template>
  <div>
    <echarts :options="options" />
    <!-- <echarts :options="options2" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [], //! -> pagination
      facility_count: [], //! pie graph,
      options: {},
      options2: {},
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
      var option = {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: '양천구 시설 현황 ',
          textStyle: {
            // color: "blue",
          },
          left: 'center',
          // padding: 50,
          // textAlign: 'right',
        },
        dataset: {
          source: this.facility_count,
        },
        legend: {
          show: true,
          // position: 'center',
          icon: 'rect',
          top: 'bottom',
        },
        series: [
          {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            type: 'pie',
            // radius: '20%',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
          },
        ],
      };
      this.options = option;

      this.options2 = option;
      // this.
    }
  },
  methods: {
    async getAirTest(callback) {
      await this.$axios.get('/api/chart').then(({ data }) => {
        const {
          rows,
          aggregations: {
            '시설군 요약': { buckets: facility_count },
          },
          total,
        } = data;
        console.log('rows', rows);
        console.log('facility_count', facility_count);
        console.log('total', total);

        // data update
        const facility_count_list = facility_count.map((ele) => {
          return [ele.key, ele.doc_count];
        });

        this.facility_count = [['product', 'count'], ...facility_count_list];
        console.log('this.facility_count', this.facility_count);

        callback();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
