<template>
  <div>
    <client-only>
      <section class="modal-outer">
        <section class="modal-inner">
          <div class="modal-title"><h1>태스크 내용</h1></div>
          <section class="modal-body task-info">
            <!-- {{ task }} -->

            <section v-for="(item_1, idx_1) of data.contents">
              <h2 class="manual-title">{{ item_1.title }}</h2>
              <article v-for="(item_2, idx_2) of item_1.content">
                <div v-if="item_2.type === 'text'">
                  <p v-for="(item_3, idx_3) of item_2.source">{{ item_3 }}</p>
                </div>
                <div v-else-if="item_2.type === 'table'">
                  <h4>{{ item_2.title || item_2.source.sub_title }}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th
                          v-for="column_name of item_2.source.column_name"
                          colspan="1"
                        >
                          {{ column_name }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row of item_2.source.rows" colspan="1">
                        <td v-for="row_item of row">{{ row_item }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
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
  props: ['target', 'toggleModal', 'task'],
  created() {
    // console.log('in modal', this.$props.onlyReports);
    console.log('task', this.$props.task);
  },
  data() {
    return {
      data: this.$props.task,
    };
  },
  methods: {
    // submitHandler(e) {
    //   this.$props.toggleModal(null, this.$props.target);
    // },
    // modifyReport() {
    //   console.log('드디어');
    //   // this.$props.toggleModal(null, this.$target);
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

.modal-body.task-info {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  padding: 0px;

  overflow-y: scroll;
  height: 500px;
}

.modal-body .reporter {
  text-align: right;
}

.modal-title {
  margin-bottom: 20px;
}

.report-all-table {
  padding: 0;
}

.modal-btns button {
  /* border: none;
  outline: none; */
  margin-top: 50px;
  /* width: 49%; */
}

.modal-btns .cancle-only {
  width: 100%;
  /* width: 60px; */
}

table {
  width: 100%;
}

thead {
  background: blanchedalmond;
}

td {
  white-space: pre;
}
</style>
