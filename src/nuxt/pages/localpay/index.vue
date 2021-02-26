<template>
  <div>
    <client-only>
      <section id="header">
        <img src="../../assets/search_img.png" />
        <h1>경기지역화폐 결제 매장 검색</h1>
        <p>
          경기지역화폐는 소상공인 경쟁력 강화를 위해 백화점, 대형마트, 일부
          제외업종 및
          <br />
          일정 기준 매출액 이상의 매장에서 사용이 제한됩니다.
        </p>
        <p>
          * 가맹점 폐업 또는 업종변경, 가맹점 정보변경 등으로 현재 정보와 다를
          수 있으니 매장에 사용 가능 여부를 확인하기 바랍니다.
        </p>
      </section>
      <section id="select-table" class="show">
        <h4>검색하려는 지역을 선택해 주세요.</h4>
        <selectTable table_class="region" :selectData="selectData" />
        <h4>업종을 선택해 주세요.</h4>
        <selectTable table_class="category" :selectData="selectData" />

        <button id="btn-search" @click="searchHandler">검색</button>
      </section>

      <section id="grid-content" class="hide">
        <grid
          :selectData="selectData"
          :getLocalPay="getLocalPay"
          :toggleDisplay="toggleDisplay"
          :data="data"
          :total="total"
        />
      </section>
    </client-only>
  </div>
</template>

<script>
import selectTable from '../../components/selectTable.vue';
import grid from '../../components/grid.vue';
export default {
  components: {
    selectTable,
    grid,
  },
  data() {
    return {
      selectData: {
        region: undefined,
        category: undefined,
      },
      data: [],
      total: 0,
    };
  },
  methods: {
    searchHandler() {
      console.log('search', this.selectData.region, this.selectData.category);
      this.getLocalPay();
      this.toggleDisplay();
    },
    toggleDisplay() {
      // 한 페이지에 모두 렌더링
      const $select_table = document.querySelector('#select-table');
      const $grid_content = document.querySelector('#grid-content');

      if ($select_table.classList.contains('hide')) {
        $select_table.classList.remove('hide');
        $select_table.classList.add('show');

        $grid_content.classList.remove('show');
        $grid_content.classList.add('hide');
      } else {
        $select_table.classList.remove('show');
        $select_table.classList.add('hide');

        $grid_content.classList.remove('hide');
        $grid_content.classList.add('show');
      }
    },
    async getLocalPay(pageNumber = 1, pageSize = 20) {
      console.log('getLocalPay', pageNumber, pageSize);
      console.log('this.selectData', this.selectData);
      await this.$axios
        .$get('/api/pay', {
          params: {
            region: this.selectData.region,
            category: this.selectData.category,
            from: (pageNumber - 1) * pageSize,
            size: pageSize,
          },
        })
        .then((res) => {
          const {
            rows,
            // aggregations: {
            //   '시군명 요약': { buckets: local_pay_region },
            //   '업종별 요약': { buckets: local_pay_category },
            // },
            total,
          } = res;
          // // console.log('pay rows', aggregations);
          console.log('rows', rows);
          console.log('total', total);

          this.data = rows.map(({ _source }) => {
            return _source;
          });

          this.total = total;
        })
        .catch((e) => {
          console.log('ERROR', e);
        });
    },
  },
};
</script>

<style>
#header {
  text-align: center;
  margin: 80px 145px;
}

#header :last-child {
  margin-top: 9px;
  font-size: 10px;
}

#select-table {
  text-align: center;
}

#btn-search {
  outline: none;
  width: 100px;
  height: 56px;
  background: #292929;
  color: #fff;
  line-height: 56px;
  font-weight: 800;
  display: inline-block;
  text-align: center;
  margin: 20px 0 0 7px;
  border-radius: 3px;
}

.hide {
  display: none;
}

.show {
  display: block;
}
</style>
