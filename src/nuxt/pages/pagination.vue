<template>
  <div>
    <h2>양천구 시설목록</h2>
    <DataGrid
      style="height: 80%"
      :pagination="true"
      :data="data"
      :total="total"
      :pageSize="pageSize"
      :pagePosition="pagePosition"
    >
      <GridColumn
        field="연번"
        title="연번"
        width="40px"
        align="center"
      ></GridColumn>
      <GridColumn
        field="시설군"
        title="시설군"
        width="100px"
        halign="center"
      ></GridColumn>
      <GridColumn
        field="시설명"
        title="시설명"
        width="150px"
        halign="center"
      ></GridColumn>
      <GridColumn
        field="전화번호"
        title="전화번호"
        width="100px"
        halign="center"
      ></GridColumn>
      <GridColumn field="소재지" title="소재지" halign="center"></GridColumn>
    </DataGrid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      data: [],
      pageSize: 20,
      pagePosition: 'bottom',
    };
  },
  created() {
    this.getAirTest();
  },
  methods: {
    async getAirTest() {
      await this.$axios.get('/api/chart').then(({ data }) => {
        const { rows, total } = data;

        this.data = rows.map(({ _source }, idx) => {
          return _source;
        });
        this.total = total;

        console.log('this.data', this.data);
      });
    },
  },
};
</script>
