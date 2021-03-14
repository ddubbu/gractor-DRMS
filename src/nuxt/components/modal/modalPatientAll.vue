<template>
  <div>
    <client-only>
      <section class="modal-outer">
        <section class="modal-inner">
          <div class="modal-title">
            <h1>
              {{ rows[0] ? rows[0].category + ' 보고 내용' : '보고 내용' }}
            </h1>
          </div>
          <section class="modal-body report-all-table">
            <DataGrid
              :data="data"
              :pagination="true"
              :pageSize="pageSize"
              :filterable="true"
              @rowClick="rowClick"
            >
              <GridColumn
                v-for="(item, idx) of table_props"
                :field="item.field"
                :title="item.title"
                :width="item.width"
                halign="center"
                align="center"
                :sortable="true"
                :key="idx"
              >
              </GridColumn>
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
  props: ['target', 'toggleModal', 'rows', 'event_collect'],
  created() {
    console.log('in modal', this.$props.rows);

    this.data = this.$props.rows.map((report) => {
      return {
        ...report.content,
        reporter: report.reporter,
      };
    });
  },
  data() {
    return {
      table_props: [
        {
          field: 'name',
          title: '성명',
          width: '60px',
        },
        {
          field: 'gender',
          title: '성별',
          width: '30px',
        },
        {
          field: 'hospital',
          title: '병원',
          width: '100px',
        },
        {
          field: 'birth',
          title: '생년월일',
          width: '80px',
        },
        {
          field: 'reporter',
          title: '보고자',
          width: '80px',
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
      // this.$props.event_collect.row = row;
      // this.$props.toggleModal(null, 'report_one');
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
