<template>
  <div>
    <section :class="'table ' + table_class" :id="table_class">
      <ul>
        <li
          v-for="item of list[table_class]"
          :key="item"
          @click="clickHandler($event, item)"
        >
          {{ item }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  props: ['table_class', 'selectData'],
  data() {
    return {
      $prevTarget: null,
      isClick: {
        region: false,
        category: false,
      },
      list: {
        region: [
          '가평군',
          '고양시',
          '과천시',
          '광명시',
          '광주시',
          '구리시',
          '군포시',
          '김포시',
          '남양주시',
          '동두천시',
          '부천시',
          '성남시',
          '수원시',
          '시흥시',
          '안산시',
          '안성시',
          '안양시',
          '양주시',
          '양평군',
          '여주시',
          '연천군',
          '오산시',
          '용인시',
          '의왕시',
          '의정부시',
          '이천시',
          '파주시',
          '평택시',
          '포천시',
          '하남시',
          '화성시',
        ],
        category: [
          '숙박',
          '여행',
          '레저',
          '문화',
          '의류',
          '주유소',
          '유통',
          '서적문구',
          '학원',
          '사무통신',
          '자동차판매',
          '서비스',
          '보험',
          '병원',
          '약국',
          '미용',
          '일반휴게음식',
          '음료식품',
          '기타',
        ],
      },
    };
  },
  methods: {
    clickHandler(e, item) {
      const $target = e.target;
      const type = this.$props.table_class;

      // 1. region 선택 안함.
      if (!this.isClick[type]) {
        $target.classList.add('click');
        this.isClick[type] = true;
        $target.style.background = 'gray';
        this.$prevTarget = $target;

        // state 변경하기
        this.$props.selectData[type] = item;
      }
      // 2. region 이미 선택했고 다시 눌렀으면 삭제
      else if (this.isClick[type] && $target.classList.contains('click')) {
        $target.classList.remove('click');
        this.isClick[type] = false;
        $target.style.background = 'white';
        this.$prevTarget = null;

        // state 변경하기
        this.$props.selectData[type] = undefined;
      }
      // 3. 이미 뭐 눌러져있는데 다른거 누르면 그걸로 바뀜.
      else if (this.isClick[type] && !$target.classList.contains('click')) {
        $target.style.background = 'gray';
        this.$prevTarget.style.background = 'white';
        this.$prevTarget = $target;

        // state 변경하기
        this.$props.selectData[type] = item;
      }
    },
  },
};
</script>

<style>
.table {
  text-align: center;
}

.table ul {
  list-style: none;
  display: flex;
  width: 910px;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 auto;
  padding: 0;
}

.table > ul > li {
  display: inline-block;
  padding-top: 20px;
  width: 180px;
  font-size: 13px;
  color: #000;
  height: 55px;
  line-height: 19px;
  border: 1px solid #ddd;
  text-align: center;
  background: #fff;
  user-select: none;
}

.table > ul > li:hover {
  background: rgba(190, 189, 189, 0.363);
}

.click {
  background: red;
}
</style>
