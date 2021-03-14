<template>
  <div>
    <p>{{ json }}</p>
    <p>{{ 'device 개수' + Object.keys(device).length }}</p>
    <echarts class="chart1" :options="options" />
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  mounted() {
    //! 1. socket 연결
    this.socket = io.connect('http://192.168.1.91:9001');

    this.socket.on('connect', () => {
      console.log('connect client ----> server');
    });

    this.socket.on('chat2', (data) => {
      const json = JSON.parse(data);

      const newSeries = [
        {
          ...this.options['series'][0],
          data: [...this.options['series'][0].data, json.nodes.temp],
        },
      ];

      this.options = {
        ...this.options,
        series: newSeries,
      };

      // 출력값 확인을 위해
      this.json = json;
      this.device[json.deviceId] = json;

      console.log(
        'Object.keys(this.device).length',
        Object.keys(this.device).length
      );

      if (Object.keys(this.device).length % 2 === 0) {
        console.log('save!!!', this.device);
        this.saveMQTTData(this.device);
      }
      // console.log("this.device", this.device);
    });

    // this.socket.on('disconnect', () => {
    //   // console.log('this.socket', this.socket);
    //   this.socket.disconnect();
    //   console.log('client disconnected!!!!');
    // });

    this.options = {
      title: {
        text: '위험 시설물 관리 - 온도',
      },
      //! 이유는 모르겠지만, 이거하면 업데이트안됨.
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none',
      //     },
      //     // dataView: { readOnly: false },
      //     // magicType: { type: ['line', 'bar'] },
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C',
        },
      },
      series: [
        {
          data: [], //[150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
        },
      ],
    };
  },
  data() {
    return {
      device: {},
      json: null,
      input: '',
      socket: null,
      data: [],

      // chart용
      options: null,

      // mqtt 용
      client: null, // mqtt object
      message: 'BEFORE',
      isConnect: false,
    };
  },
  methods: {
    submit() {
      this.data.push(this.input);
      this.socket.emit('chat', { data: this.input });
    },
    saveMQTTData(payload) {
      this.$axios.$post('/api/mqtt', {
        device_list: payload,
      });
    },
  },
  // componentWillUnmount() {
  //   this.socket.close(); //.disconnect(true);
  // },
};
</script>

<style>
.chart1 {
  margin: 0 auto;

  padding: 100px;
  /* width: 700px; */
  height: 700px;
}
</style>
