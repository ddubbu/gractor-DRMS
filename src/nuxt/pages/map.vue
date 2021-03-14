<template>
  <div>
    <h1>서울특별시 위험시설물 분포 현황</h1>
    <div id="map-wrapper"></div>
    <section id="tooltip-region" class="hidden">
      <div>
        주소:
        <span id="addressMain"></span>
      </div>
      <div>
        연락처 :
        <span id="contact"></span>
      </div>
    </section>
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';
export default {
  async mounted() {
    //! map data 600개 가져오기
    await this.$axios.$get('/api/map').then((res) => {
      this.places = res.map((item) => {
        return {
          lon: item._source.geometry.coordinates[0], //longitude : 위도
          lat: item._source.geometry.coordinates[1], // latitude : 경도
          properties: item._source.properties,
        };
      });
    });

    //! map 그리기
    this.renderMap();
  },

  data() {
    return {
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
        .select('#map-wrapper')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      this.$map = svg.append('g').attr('id', 'map');

      const $places = svg.append('g').attr('id', 'places');
      this.$places = $places;

      //! (시작) zoom & drag ========================

      //create zoom handler
      var zoom_handler = d3.zoom().on('zoom', zoom_actions.bind(this));

      //specify what to do when zoom event listener is triggered
      function zoom_actions(event) {
        this.$map.attr('transform', event.transform);
        $places.attr('transform', event.transform);
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
        '/map/seoul_topo_simple.json',
        this.$map,
        $places,
        'seoul_municipalities_geo'
      );
    },
    mouseOverHandler(e, data) {
      // over circle
      // 1. show
      d3.select('#tooltip-region').classed('hidden', false);

      // 2. 위치 지정
      const $target_key = e.target.getAttribute('key');
      const x = parseFloat(
        d3.select(`.region-circle-${$target_key}`).attr('cx') - 90
      );
      const y = parseFloat(
        d3.select(`.region-circle-${$target_key}`).attr('cy') + 30
      );

      document.querySelector('#tooltip-region').style.left = x + 'px';
      document.querySelector('#tooltip-region').style.top = y + 'px';

      //! 3. 데이터 삽입
      d3.select('#tooltip-region')
        .select('#addressMain') // data 삽입도 가능... 대박...
        .text(data.properties.addressMain);
      d3.select('#tooltip-region')
        .select('#contact')
        .text(data.properties.contact);
    },

    mouseOutHandler(e) {
      d3.select('#tooltip-region').classed('hidden', true);
    },

    loadJsonMap(FILE_PATH, $map, $places, option, font_size = '13px') {
      d3.json(FILE_PATH).then((data) => {
        console.log('data2', data);
        var features = topojson.feature(
          data,
          data.objects[option] //!(이거랑 같이 세부 지역) seoul_submunicipalities_geo
        ).features;

        $map
          .selectAll('path')
          .data(features)
          .enter()
          .append('path')
          .attr('class', function (d) {
            return 'municipality c' + d.properties.code;
          })
          .attr('d', this.path)
          //! (시작) zoomable map 을 위해 여기 추가함
          .on('click', this.clickHandler);
        //! (끝) zoomable map 을 위해 여기 추가함

        $map
          .selectAll('text')
          .data(features)
          .enter()
          .append('text')
          .attr('transform', (d) => {
            return 'translate(' + this.path.centroid(d) + ')';
          })
          .style('font-size', font_size)
          .attr('dy', '.35em')
          .attr('class', 'municipality-label')
          .text(function (d) {
            return d.properties.name;
          });
      });

      // 점 찍기
      this.places.forEach((d, idx) => {
        $places
          .append('circle')
          .attr('class', `region-circle-${idx}`)
          .attr('key', idx)
          .attr('cx', this.projection([d.lon, d.lat])[0])
          .attr('cy', this.projection([d.lon, d.lat])[1])
          .attr('r', 6)
          .on('mouseover', (e) => {
            this.mouseOverHandler(e, d);
          }) // hover event 달기
          .on('mouseout', (e) => {
            this.mouseOutHandler(e, d);
          });
      });
    },

    clickHandler(event, d) {
      console.log('click');
      if (d && this.zoomAttr.centered !== d) {
        const centroid = this.path.centroid(d);
        console.log('centroid', centroid);
        this.zoomAttr = {
          x: centroid[0],
          y: centroid[1],
          k: 4,
          centered: d,
        };
      } else {
        this.zoomAttr = {
          x: this.width / 2,
          y: this.height / 2,
          k: 1,
          centered: null,
        };
      }

      this.$map
        .classed(
          'active',
          this.zoomAttr.centered &&
            function (d) {
              return d === this.zoomAttr.centered;
            }.bind(this)
        )
        .transition()
        .duration(750)
        .attr(
          'transform',
          `translate(${this.width / 2},${this.height / 2})scale(${
            this.zoomAttr.k
          })translate(-${this.zoomAttr.x},-${this.zoomAttr.x})`
        );

      this.$places
        .transition()
        .duration(750)
        .attr(
          'transform',
          `translate(${this.width / 2},${this.height / 2})scale(${
            this.zoomAttr.k
          })translate(-${this.zoomAttr.x},-${this.zoomAttr.x})`
        );

    },

  },
};
</script>

<style>
svg {
  border: 1px solid rgb(0, 0, 0);
}

/* (시작) basic css */
svg circle {
  fill: orange;
  opacity: 0.5;
  stroke: white;
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
  content: ' ';
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
