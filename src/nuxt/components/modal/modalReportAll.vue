<template>
  <div>
    <client-only>
      <section class="modal-outer">
        <section class="modal-inner">
          <div class="modal-title"><h1>보고 내역</h1></div>
          <section class="modal-body report-all-table">
            <DataGrid
              :data="data"
              :pagination="true"
              :pageSize="pageSize"
              :filterable="true"
              @rowClick="rowClick"
            >
              <!-- //@toggleRow="()=>{console.log("click cell")}" -->
              <GridColumn
                v-for="(item, idx) of table_props"
                :field="item.field"
                :title="item.title"
                :width="item.width"
                halign="center"
                :align="item.align"
                :sortable="true"
                :key="idx"
              >
              </GridColumn>
              <!-- <GridColumn field="itemid" title="Item ID"></GridColumn>
            <GridColumn field="name" title="Name"></GridColumn> -->
            </DataGrid>
          </section>
          <div class="modal-btns">
            <!-- <button class="submit" @click="submitHandler">저장</button> -->
            <button class="cancle-only" @click="toggleModal($event, target)">
              취소
            </button>
          </div>
        </section>
      </section>
    </client-only>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['target', 'toggleModal', 'onlyReports', 'event_collect'],
  created() {
    console.log('in modal', this.$props.onlyReports);

    this.data = this.$props.onlyReports.map((report) => {
      return {
        title: report.content.title,
        description: report.content.description,
        reporter: report.reporter,
      };
    });
  },
  data() {
    return {
      table_props: [
        {
          field: 'title',
          title: '보고내역',
          width: '300px',
          align: 'left',
        },
        {
          field: 'reporter',
          title: '보고자',
          width: '100px',
          align: 'center',
        },
      ],
      pageSize: 10,
      data: [],
    };
  },
  methods: {
    rowClick(row) {
      // oh! 바로 넘기네!!!
      console.log('hello', row);
      this.$props.event_collect.row = row;
      this.$props.toggleModal(null, 'report_one');
    },
    // submitHandler(e) {
    //   // this.cur_task_state = this.checked_task_state;
    //   // this.$props.toggleModal(null, this.target);
    //   this.$props.toggleModal(null, this.$props.target);
    // },
  },
};
</script>

<style>
.modal-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.227);
}

.modal-inner {
  background: white;
  width: 600px;
  margin: 50px auto;

  padding: 50px;
}

.modal-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.modal-title {
  margin-bottom: 20px;
}

.report-all-table {
  padding: 0;
}

.modal-btns button {
  margin-top: 50px;
}

.modal-btns .cancle-only {
  width: 100%;
}
</style>
