<template>
  <div>
    <client-only>
      <section class="modal-outer">
        <section class="modal-inner">
          <div class="modal-title"><h1>보고 내용</h1></div>
          <section class="modal-body">
            <!-- {{ event_collect }} -->
            <div>
              <p class="reporter">작성자 : {{ data.reporter }}</p>
              <!-- <h2>Header and Footer</h2> -->
              <Panel :bodyStyle="{ padding: '20px', width: '500px' }">
                <!-- showFooter="false" -->
                <template slot="header">
                  <div class="f-row">
                    <div class="f-full" style="line-height: 30px">
                      {{ data.title }}
                    </div>
                    <!-- <TextBox> {{ data.reporter }}</TextBox> -->
                  </div>
                </template>
                <p>{{ data.description }}</p>
                <template slot="footer">
                  <div style="padding: 5px">
                    <!-- <LinkButton iconCls="icon-add">New</LinkButton> -->
                    <LinkButton iconCls="icon-edit" @click="modifyReport"
                      >수정하기</LinkButton
                    >
                  </div>
                </template>
              </Panel>
            </div>
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
  props: ['target', 'toggleModal', 'event_collect'],
  created() {
    // console.log('in modal', this.$props.onlyReports);
  },
  data() {
    return {
      data: this.$props.event_collect.row,
    };
  },
  methods: {
    // submitHandler(e) {
    //   this.$props.toggleModal(null, this.$props.target);
    // },
    modifyReport() {
      console.log('드디어', this.data);

      this.$props.toggleModal(null, 'modify_report');
    },
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
  padding: 0px;
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
</style>
