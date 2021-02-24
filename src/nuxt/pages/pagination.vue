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
      <GridColumn field="inv" title="Inv No"></GridColumn>
      <GridColumn field="name" title="Name"></GridColumn>
      <GridColumn field="amount" title="Amount" align="right"></GridColumn>
      <GridColumn field="price" title="Price" align="right"></GridColumn>
      <GridColumn field="cost" title="Cost" align="right"></GridColumn>
      <GridColumn field="note" title="Note"></GridColumn>
    </DataGrid>
  </div>
</template>

<script>
export default {
  components: {
    Label,
    // ComboBox,
    // DataGrid,
    // GridColumn
  },
  data() {
    return {
      total: 10000,
      pageSize: 20,
      data: [],
      pagePosition: 'bottom',
      pageOptions: [
        { value: 'bottom', text: 'Bottom' },
        { value: 'top', text: 'Top' },
        { value: 'both', text: 'Both' },
      ],
    };
  },
  created() {
    this.data = this.getData(this.total);
  },
  methods: {
    getData(total) {
      let data = [];
      for (let i = 1; i <= total; i++) {
        let amount = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 1000);
        data.push({
          inv: 'Inv No ' + i,
          name: 'Name ' + i,
          amount: amount,
          price: price,
          cost: amount * price,
          note: 'Note ' + i,
        });
      }
      return data;
    },
  },
};
</script>
