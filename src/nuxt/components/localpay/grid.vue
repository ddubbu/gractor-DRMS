<template>
  <div id="table-container">
    <section id="table-top">
      <h1>{{ selectData.region + ' ' + selectData.category }}</h1>
      <section id="table-top-etc">
        <div>
          <NuxtLink to="/localpay">
            <button class="btn-home">Home</button>
          </NuxtLink>
        </div>
        <div>
          <span style="margin-right: 10px">결제 가능 매장</span>
          <span id="table-total-count">검색결과 {{ total }}개</span>
        </div>
      </section>
    </section>
    <DataGrid
      style="height: 80%; width: 1000px; margin: 0 auto"
      :pagination="true"
      :data="data"
      :total="total"
      :pageSize="pageSize"
      :pagePosition="pagePosition"
      :filterable="true"
      @pageChange="onPageChange"
      :lazy="true"
      :loading="isLoading"
    >
      <!-- 저장하면 다시 사라짐 ㅜㅜ -->
      <!-- <GridColumn
        v-for="field in fields"
        :field="field"
        :title="field"
        :key="field"
        halign="center"
      ></GridColumn> -->
      <GridColumn
        field="NO"
        title="NO"
        width="60px"
        halign="center"
        align="center"
      ></GridColumn>
      <GridColumn
        field="시군명"
        title="시군명"
        width="70px"
        halign="center"
        align="center"
      ></GridColumn>
      <GridColumn
        field="업종명(종목명)"
        title="업종명(종목명)"
        width="200px"
        halign="center"
      ></GridColumn>
      <GridColumn
        field="상호명"
        title="상호명"
        halign="center"
        width="300px"
      ></GridColumn>
      <GridColumn
        field="소재지도로명주소"
        title="소재지도로명주소"
        halign="center"
      ></GridColumn>
    </DataGrid>
  </div>
</template>

<script>
export default {
  props: ['selectData'],
  mounted() {
    console.log('gird page', this.$props.selectData);
    this.getLocalPay();
  },
  data() {
    return {
      total: 0,
      pageNumber: 1,
      pageSize: 20,
      pagePosition: 'bottom',
      isLoading: false,
      data: [],
      fields: ['NO', '시군명', '업종명(종목명)', '상호명', '소재지도로명주소'],
    };
  },
  methods: {
    loadPage(pageNumber, pageSize) {
      this.loading = true;
      this.getLocalPay(pageNumber, pageSize);
    },
    onPageChange(e) {
      console.log('[here] page chagne', e);
      this.loadPage(e.pageNumber, e.pageSize);
    },
    async getLocalPay(pageNumber = 1, pageSize = 20) {
      await this.$axios
        .$get('/api/pay', {
          params: {
            region: this.$props.selectData.region,
            category: this.$props.selectData.category,
            from: (pageNumber - 1) * pageSize,
            size: pageSize,
          },
        })
        .then((res) => {
          const { rows, total } = res;

          this.data = rows.map(({ _source }) => {
            return _source;
          });

          this.total = total;

          this.loading = false;
        })
        .catch((e) => {
          console.log('ERROR', e);
        });
    },
  },
};
</script>

<style>
#table-container {
  /* padding: 50px; */
  /* text-align: left; */
  width: 1000px;
  margin: 0 auto;
}

#table-top {
  /* color: red; */
  /* width: 800px; */
  /* padding-left: 50px; */
  /* text-align: center; */
  margin-bottom: 5px;
  margin-top: 100px;
}

#table-total-count {
  border-left: 1px gray solid;
  padding-left: 10px;
}

#table-top-etc {
  display: 'flex';
  flex-direction: 'row';
  justify-content: 'space-between';
}
#table-top-etc div:first-child {
  /* color: red; */
  text-align: right;
  /* display: inline-block; */
}

.btn-home {
  outline: none;
  width: 60px;
  height: 30px;
  background: #292929;
  color: #fff;
  /* line-height: 56px; */
  font-weight: 800;
  display: inline-block;
  text-align: center;
  margin: 20px 0 0 7px;
  border-radius: 3px;
}

/* table  customizing */
.panel-header,
.panel-body {
  /* border-width: 1px; */
  border-style: none;
}
</style>
