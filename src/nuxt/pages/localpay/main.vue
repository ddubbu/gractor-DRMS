<template>
  <div>
    <echarts :options="options" />
    <echarts :options="options2" />
    <echarts :options="options3" />
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
      local_pay_region: [],
      local_pay_category: [],
    };
  },
  mounted() {
    //GET API
    this.getLocalPay(callback.bind(this));
    // this.getAirTest(callback.bind(this));
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
      var option2 = {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: '시군명 ',
          textStyle: {
            // color: "blue",
          },
          left: 'center',
          // padding: 50,
          // textAlign: 'right',
        },
        dataset: {
          source: this.local_pay_list_region,
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
      var option3 = {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: '업종별 ',
          textStyle: {
            // color: "blue",
          },
          left: 'center',
          // padding: 50,
          // textAlign: 'right',
        },
        dataset: {
          source: this.local_pay_list_category,
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

      this.options2 = option2;
      this.options3 = option3;
      // this.
    }
  },
  methods: {
    async getLocalPay(callback) {
      await this.$axios.get('/api/pay').then(({ data }) => {
        console.log('res', data);
        const {
          rows,
          aggregations: {
            '시군명 요약': { buckets: local_pay_region },
            '업종별 요약': { buckets: local_pay_category },
          },
          total,
        } = data;
        // console.log('pay rows', aggregations);
        console.log('rows', rows);
        // const local_pay_rows = local_pay;
        // console.log('local_pay_rows', local_pay_rows);

        const local_pay_list_region = local_pay_region.map((ele) => {
          return [ele.key, ele.doc_count];
        });

        const local_pay_list_category = local_pay_category.map((ele) => {
          return [ele.key, ele.doc_count];
        });
        this.local_pay_list_region = [
          ['시군명', 'count'],
          ...local_pay_list_region,
        ];
        this.local_pay_list_category = [
          ['업종별', 'count'],
          ...local_pay_list_category,
        ];
        // console.log('local_pay_list', this.local_pay_list);
        callback();
      });
    },

    async getAirTest() {
      await this.$axios.get('/api/chart').then(({ data }) => {
        const {
          rows,
          aggregations: {
            '시설군 요약': { buckets: facility_count },
          },
          total,
        } = data;
        // console.log('rows', data);
        // console.log('facility_count', facility_count);
        // console.log('total', total);

        // data update
        const facility_count_list = facility_count.map((ele) => {
          return [ele.key, ele.doc_count];
        });

        this.facility_count = [['product', 'count'], ...facility_count_list];
        // console.log('this.facility_count', this.facility_count);

        callback();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
