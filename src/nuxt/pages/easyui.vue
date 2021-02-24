<template>
  <div>
    <h2>Pagination</h2>
    <div style="margin-bottom: 10px">
      <Label for="c1">Pager on: </Label>
      <ComboBox
        inputId="c1"
        style="width: 120px"
        :data="pageOptions"
        v-model="pagePosition"
        :editable="false"
        :panelStyle="{ height: 'auto' }"
      >
      </ComboBox>
    </div>
    <DataGrid
      style="height: 250px"
      :pagination="true"
      :data="data"
      :total="total"
      :pageSize="pageSize"
      :pagePosition="pagePosition"
    >
      <GridColumn field="inv" title="시설군"></GridColumn>
      <GridColumn field="name" title="시설명"></GridColumn>
      <GridColumn field="amount" title="소재지" align="right"></GridColumn>
      <GridColumn field="price" title="전화번호" align="right"></GridColumn>
      <!-- <GridColumn field="cost" title="Cost" align="right"></GridColumn>
      <GridColumn field="note" title="Note"></GridColumn> -->
    </DataGrid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 10000,
      pageSize: 20,
      data: [],
      pagePosition: "bottom",
      pageOptions: [
        { value: "bottom", text: "Bottom" },
        { value: "top", text: "Top" },
        { value: "both", text: "Both" },
      ],
    };
  },
  created() {
    this.data = this.getData(this.total);
  },
  methods: {
    getData(total) {
      this.$axios.$get("/api/chart", ({ facility_data }) => {
        facility_data;
        console.log("facility_data1", facility_data);
      });
      let data = [];
      for (let i = 1; i <= total; i++) {
        let amount = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 1000);
        data.push({
          inv: "시설군 " + i,
          name: "Name " + i,
          amount: amount,
          price: price,
          cost: amount * price,
          note: "Note " + i,
        });
      }
      return data;
    },
  },
};
</script>
