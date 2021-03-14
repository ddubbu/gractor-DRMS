<template>
  <div>
    <navBar sidebar_type="map_chart" />
    <!--//! mqtt raw data plot -->
    <div id="main-map-chart-page">
      <h2>구로구 위험시설물 실시간 데이터</h2>
      <div id="chart-series">
        <echarts class="chart1" :options="options[0]" />
        <echarts class="chart1" :options="options[1]" />
        <!-- <echarts class="chart1" :options="options[2]" /> -->
        <echarts class="chart1" :options="options[3]" />
        <!-- <p>{{ 'device 개수' + Object.keys(device).length }}</p>-->
        <!-- <p>{{ json }}</p>  -->
      </div>

      <!--//! map plot -->
      <h2>서울특별시 위험시설물 분포 현황</h2>
      <div id="seoul-map">
        <div id="map-wrapper"></div>
        <div>
          <DataGrid
            :data="places.map((el) => el.properties)"
            :pagination="true"
            :pageSize="20"
            :multiSort="true"
            :filterable="true"
            style="height: 600px; width: 800px; margin-left: 100px"
            @rowClick="rowClick"
          >
            <GridColumn
              field="deviceId"
              title="id"
              width="25px"
              align="center"
              halign="center"
            ></GridColumn>
            <GridColumn
              field="addressMain"
              title="설치 주소"
              width="25px"
              halign="center"
            ></GridColumn>
            <GridColumn
              field="name"
              title="설치 세부 장소"
              width="25px"
              halign="center"
            ></GridColumn>
            <GridColumn
              field="installAt"
              title="설치 날짜"
              width="20px"
              align="center"
              halign="center"
            ></GridColumn>
            <GridColumn
              field="contact"
              title="연락처"
              width="20px"
              align="center"
              halign="center"
            ></GridColumn>
          </DataGrid>
        </div>
      </div>

      <section id="tooltip-region" class="hidden">
        <div>
          주소:
          <span id="addressMain"></span>
        </div>
        <div>
          이름 :
          <span id="name"></span>
        </div>
        <div>
          설치 날짜 :
          <span id="installAt"></span>
        </div>
        <div>
          연락처 :
          <span id="contact"></span>
        </div>
        <div>
          deviceId :
          <span id="deviceId"></span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import navBar from "../components/navbar";

import * as d3 from "d3";
import * as topojson from "topojson";

import io from "socket.io-client";

export default {
  components: {
    navBar,
  },
  async mounted() {
    //! 1. map data 600개 가져오기
    await this.$axios.$get("/api/map").then((res) => {
      this.places = res.map((item) => {
        return {
          lon: item._source.geometry.coordinates[0], //longitude : 위도
          lat: item._source.geometry.coordinates[1], // latitude : 경도
          properties: item._source.properties,
        };
      });

      console.log("this.places", this.places);
    });

    //! 2. map 그리기
    this.renderMap();

    //! 3. connect socket to get data from mqtt
    this.connectSocekt();
  },

  data() {
    return {
      // chart_options: ['temp', 'hum', 's'],
      places: [], //$places 랑 다름!!
      projection: null,
      path: null,
      $map: null,
      $places: null,
      isZoom: false,
      // centered: null,
      width: 0,
      height: 0,
      zoomAttr: {
        x: 800 / 2, //this.width / 2,
        y: 600 / 2, //this.height / 2,
        k: 1,
        centered: null,
      },

      //! select-circle
      select_circle_data: null,
      search_value: "",

      //! websocket 용
      device: {},
      json: null,
      input: "",
      socket: null,
      data: [],

      // chart용
      options: [
        {
          title: {
            text: "[구로구 전체] 온도",
          },
          tooltip: {
            trigger: "axis",
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: "value",
            // axisLabel: {
            //   formatter: '{value} °C',
            // },
          },
          series: [
            {
              data: [], //[150, 230, 224, 218, 135, 147, 260],
              type: "line",
              smooth: true,
            },
          ],
          visualMap: {
            top: 50,
            right: -18,
            pieces: [
              {
                gt: -10,
                lte: 0,
                color: "blue", //'#93CE07',
              },
              {
                gt: 0,
                lte: 5,
                color: "#32a4a8",
              },
              {
                gt: 5,
                lte: 12,
                color: "#FC7D02",
              },
              {
                gt: 12,
                lte: 20,
                color: "red",
              },
            ],
            outOfRange: {
              color: "#999",
            },
          },
        },
        {
          title: {
            text: "[구로구 전체] 습도",
          },

          xAxis: {
            type: "category",
            // boundaryGap: false,
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value}",
            },
          },
          series: [
            {
              data: [], //[150, 230, 224, 218, 135, 147, 260],
              type: "bar",
              smooth: true,
              itemStyle: {
                color: "#48a9cf",
              },
            },
          ],
        },
        {
          title: {
            text: "[구로구 전체] 온습도 센서 상태",
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value} °C",
            },
          },
          series: [
            {
              data: [], //[150, 230, 224, 218, 135, 147, 260],
              type: "line",
              smooth: true,
            },
          ],
        },
        {
          title: {
            text: "기울기 (X,Y,Z)",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: { right: 10 },
          xAxis: {
            type: "category",
            boundaryGap: false,
            axisLabel: { rotate: 20, interval: 3 },
            // name: 'deviceId',
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              type: "line",
              smooth: true,
            },
            {
              type: "line",
              smooth: true,
            },
            {
              type: "line",
              smooth: true,
            },
          ],
          dataset: {
            source: [
              ["deviceId", "degX", "degY", "degZ"],
              // ['ABC', 1, 2, 3],
              // ['ABC2', 1, 5, 32],
            ],
          },
        },
      ],
    };
  },
  methods: {
    renderMap() {
      //! svg 렌더하기
      const width = 800,
        height = 600;

      this.width = width;
      this.height = height;

      const svg = d3
        .select("#map-wrapper")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      this.$map = svg.append("g").attr("id", "map");

      const $places = svg.append("g").attr("id", "places");
      this.$places = $places;

      //! (시작) zoom & drag ========================

      //create zoom handler
      var zoom_handler = d3.zoom().on("zoom", zoom_actions.bind(this));

      //specify what to do when zoom event listener is triggered
      function zoom_actions(event) {
        this.$map.attr("transform", event.transform);
        $places.attr("transform", event.transform);
      }

      //add zoom behaviour to the svg element backing our graph.
      //same thing as svg.call(zoom_handler);
      zoom_handler(svg);
      //! (끝) zoom & drag========================

      this.projection = d3
        .geoMercator()
        .center([126.9895, 37.5651])
        .scale(100000)
        .translate([width / 2, height / 2]);

      this.path = d3.geoPath().projection(this.projection);

      // json 파일 읽어서 map base 그리기
      // 구단위
      this.loadJsonMap(
        "/map/seoul_topo_simple.json",
        this.$map,
        $places,
        "seoul_municipalities_geo"
      );
    },
    mouseOverHandler(e, data) {
      // over circle

      // 1. show
      d3.select("#tooltip-region").classed("hidden", false);

      // 2. 위치 지정
      const x = parseFloat(e.clientX - 100);
      const y = parseFloat(e.clientY - 120);

      document.querySelector("#tooltip-region").style.left = x + "px";
      document.querySelector("#tooltip-region").style.top = y + "px";

      //! 3. 데이터 삽입
      d3.select("#tooltip-region")
        .select("#addressMain") // data 삽입도 가능... 대박...
        .text(data.properties.addressMain);
      d3.select("#tooltip-region")
        .select("#contact")
        .text(data.properties.contact);
      d3.select("#tooltip-region").select("#name").text(data.properties.name);
      d3.select("#tooltip-region")
        .select("#deviceId")
        .text(data.properties.deviceId);
      d3.select("#tooltip-region")
        .select("#installAt")
        .text(data.properties.installAt);
    },

    mouseOutHandler(e) {
      d3.select("#tooltip-region").classed("hidden", true);
    },

    loadJsonMap(FILE_PATH, $map, $places, option, font_size = "13px") {
      d3.json(FILE_PATH).then((data) => {
        console.log("data2", data);
        var features = topojson.feature(
          data,
          data.objects[option] //!(이거랑 같이 세부 지역) seoul_submunicipalities_geo
        ).features;

        $map
          .selectAll("path")
          .data(features)
          .enter()
          .append("path")
          .attr("class", function (d) {
            return "municipality c" + d.properties.code;
          })
          .attr("d", this.path)
          //! (시작) zoomable map 을 위해 여기 추가함
          .on("click", this.clickMunicipalitiesHandler);
        //! (끝) zoomable map 을 위해 여기 추가함

        $map
          .selectAll("text")
          .data(features)
          .enter()
          .append("text")
          .attr("transform", (d) => {
            return "translate(" + this.path.centroid(d) + ")";
          })
          .style("font-size", font_size)
          .attr("dy", ".35em")
          .attr("class", "municipality-label")
          .text(function (d) {
            return d.properties.name;
          });
      });

      // 점 찍기
      this.places.forEach((d, idx) => {
        // console.log('d', d);
        $places
          .append("circle")
          .attr("class", `region-circle-${d.properties.deviceId}`)
          // .attr('key', idx)
          .attr("cx", this.projection([d.lon, d.lat])[0])
          .attr("cy", this.projection([d.lon, d.lat])[1])
          .attr("r", 4)
          .on("mouseover", (e) => {
            this.mouseOverHandler(e, d);
          }) // hover event 달기
          .on("mouseout", (e) => {
            this.mouseOutHandler(e, d);
          })
          .on("click", (e) => {
            this.clickCircleHandler(e, d);
          });
      });
    },

    clickMunicipalitiesHandler(event, d) {
      // zoom and pan
      console.log("click", d);
      if (d && this.zoomAttr.centered !== d) {
        // 확대
        const centroid = this.path.centroid(d);
        console.log("centroid", centroid);
        this.zoomAttr = {
          x: centroid[0],
          y: centroid[1],
          k: 4,
          centered: d,
        };

        //점 크기 따로 정의
        this.$places.selectAll("circle").attr("r", 4);
      } else {
        //원상복구

        this.zoomAttr = {
          x: this.width / 2,
          y: this.height / 2,
          k: 1,
          centered: null,
        };

        // 점 크기 따로 정의
        this.$places.selectAll("circle").attr("r", 2);
      }

      // (zoom) 지도
      this.$map
        .classed(
          "active",
          this.zoomAttr.centered &&
            function (d) {
              return d === this.zoomAttr.centered;
            }.bind(this)
        )
        .transition()
        .duration(750)
        .attr(
          "transform",
          `translate(${this.width / 2},${this.height / 2})scale(${
            this.zoomAttr.k
          })translate(-${this.zoomAttr.x},-${this.zoomAttr.y})` //
        );

      // (zoom) 점
      this.$places
        .transition()
        .duration(750)
        .attr(
          "transform",
          `translate(${this.width / 2},${this.height / 2})scale(${
            this.zoomAttr.k
          })translate(-${this.zoomAttr.x},-${this.zoomAttr.y})`
        );
    },
    clickCircleHandler(event, d) {
      // console.log('d', d);
      this.select_circle_data = d;
    },

    //! method related to websocket
    connectSocekt() {
      this.socket = io.connect("http://nas.gractor.com:9001");
      // this.socket = io.connect('http://192.168.1.91:9001'); // -> 회사
      // this.socket = io.connect('http://localhost:9001'); // -> 집

      this.socket.on("connect", () => {
        console.log("connect client ----> server");
      });

      this.socket.on("chat2", (data) => {
        const json = JSON.parse(data);

        //! 데이터 한개씩 plot
        const keys = ["temp", "hum"];
        for (let idx = 0; idx < keys.length; idx++) {
          const key = keys[idx];
          const newSeries = [
            {
              ...this.options[idx]["series"][0],
              data: [...this.options[idx]["series"][0].data, json.nodes[key]],
            },
          ];

          // console.log('newSeries.data', newSeries);

          if (newSeries[0].data.length > 30) {
            newSeries[0].data.shift();
          }

          // idx번째 인덱스에 새로운거 넣기
          this.options.splice(idx, 1, {
            ...this.options[idx],
            series: newSeries,
          });
        }

        //! 데이터 3개 모음 : 기울기 XYZ
        const degDataIdx = 3;
        const newDataset = {
          source: [
            ...this.options[degDataIdx].dataset.source,
            [
              json.deviceId,
              json.nodes["degX"],
              json.nodes["degY"],
              json.nodes["degZ"],
            ],
          ],
        };

        if (newDataset.source.length > 20) {
          newDataset.source.shift();
        }

        this.options.splice(degDataIdx, 1, {
          ...this.options[degDataIdx],
          dataset: newDataset,
        });

        // 출력값 확인을 위해
        this.json = json;
        this.device[json.deviceId] = json;

        //! region-circle 색깔 변경
        const $region_circle = document.querySelector(
          `.region-circle-${json.deviceId}`
        );
        if (json.nodes.staTempHum !== "정상") {
          $region_circle.style.fill = "red";
        } else {
          $region_circle.style.fill = "blue";
        }
        $region_circle.style.opacity = "1";
      });

      // this.options =
    },

    // row click
    rowClick(data) {
      //row
      // oh! 바로 넘기네!!!

      d3.select("#tooltip-region").classed("hidden", false);

      // 2. 위치 지정

      const { left, width, top, height } = document
        .querySelector(`.region-circle-${data.deviceId}`)
        .getBoundingClientRect();

      // 해당 페이지에서 새로 키고 새로고침하면 각각 -80, -100

      // main page loading -> 여기 -> main -> 여기
      const x = parseFloat(left - 80);
      const y = parseFloat(top - 100); //

      document.querySelector("#tooltip-region").style.left = x + "px";
      document.querySelector("#tooltip-region").style.top = y + "px";

      //! 3. 데이터 삽입
      d3.select("#tooltip-region")
        .select("#addressMain") // data 삽입도 가능... 대박...
        .text(data.addressMain);
      d3.select("#tooltip-region").select("#contact").text(data.contact);
      d3.select("#tooltip-region").select("#name").text(data.name);
      d3.select("#tooltip-region").select("#deviceId").text(data.deviceId);
      d3.select("#tooltip-region").select("#installAt").text(data.installAt);
    },
  },
};
</script>

<style>
body {
  margin: 0;
}

svg {
  border: 1px solid rgb(0, 0, 0);
}

/** //! chart css */
#chart-series {
  display: flex;
  justify-content: space-around;
  height: 250px;
}
.chart1 {
  /* padding-left: 30px; */
  /* margin: 0 auto; */

  padding: 30px;
  width: 20vw;
  /* width: 600px; */
  height: 300px;
}

#seoul-map {
  margin-top: 30px;

  display: flex;
  justify-content: space-between;
  padding-left: 80px;
  padding-right: 80px;
}

@media (max-width: 1500px) {
  #seoul-map {
    display: block;
  }
}

#main-map-chart-page {
  padding: 100px;
  padding-top: 20px;
}
#main-map-chart-page h2 {
  margin: 0;
}

/*//! (시작) map-common css */
svg circle {
  fill: rgb(255, 251, 0);
  opacity: 0.2;
  stroke: rgb(255, 174, 0);
}
svg circle:hover {
  fill: red;
  stroke: #333;
}
svg text {
  pointer-events: none;
}
svg .municipality {
  fill: #efefef;
  stroke: #fff;
}
svg .municipality-label {
  /*//! text 색깔 */
  /* fill: #bbb; */
  font-size: 12px;
  font-weight: 300;
  text-anchor: middle;
}
svg #map text {
  color: #333;
  font-size: 10px;
  text-anchor: middle;
}
svg #places text {
  color: #777;
  font: 10px sans-serif;
  text-anchor: start;
}
/* (끝) basic css */

/* 구 한개씩 선택 가능 */
svg .municipality.c11170, /* 구로구 */
svg .municipality.c11190, /* 영등포구 */
svg .municipality.c11240 /* 송파구 */ {
  fill: rgb(190, 214, 233);
}

svg .municipality:hover /* else */ {
  fill: #d6d5d5;
}

svg .municipality.c11170:hover, /* 구로구 */
svg .municipality.c11190:hover, /* 영등포구 */
svg .municipality.c11240:hover /* 송파구 */ {
  fill: rgb(93, 178, 248);
}

/* tooltip 양식 */
/* :root {
  --tooltip-background: 'rgb(37, 122, 148)';
} */
#tooltip-region {
  position: absolute;
  left: 0px;
  top: 0px;
  height: auto;
  padding: 10px;
  box-shadow: 3px 3px rgb(148, 147, 147);
  background-color: rgb(255, 255, 255); /*//!여기  */
  /* background-color: var(--tooltip-background); */
}
#tooltip-region.hidden {
  visibility: hidden;
}
#tooltip-region div {
  margin: 0;
  font-family: sans-serif;
  font-size: 12px;
  line-height: 20px;
}

#tooltip-region::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;

  /*//!여기  */
  border-color: rgb(245, 229, 229) transparent transparent transparent;

  /* border-color: var(--tooltip-background) transparent transparent transparent; */
}
</style>
