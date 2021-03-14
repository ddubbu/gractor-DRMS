<template>
  <div>
    <client-only>
      <section class="modal-outer">
        <section class="modal-inner">
          <div class="modal-title"><h1>새로운 보고서 추가</h1></div>
          <section class="modal-body create-newboard">
            <Label for="c1" align="top">보고서 타입을 선택하세요</Label>
            <ComboBox
              inputId="c1"
              v-model="select_number"
              :data="report_category"
            ></ComboBox>
            <!-- {{ input[select_number] }} -->
            <section v-if="select_number === 1">
              <Label for="t1" align="top">작성자</Label>
              <TextBox
                inputId="t1"
                v-model="input[select_number].reporter"
                placeholder="입력해주세요"
              ></TextBox>

              <Label for="t2" align="top">날짜</Label>
              <DateBox v-model="todayDate" inputId="t2"></DateBox>

              <Label for="t3" align="top">업무 타입을 선택하세요</Label>
              <ComboBox
                inputId="t3"
                v-model="input[select_number].task_code"
                :data="task_code_list"
              ></ComboBox>

              <Label for="t4" align="top">제목</Label>
              <TextBox
                inputId="t4"
                v-model="input[select_number].content.title"
                placeholder="입력해주세요"
              ></TextBox>
              <Label for="t5" align="top">내용</Label>
              <TextBox
                inputId="t5"
                v-model="input[select_number].content.description"
                placeholder="입력해주세요"
              ></TextBox>
            </section>

            <!-- <div style="margin-top: 20px; margin-right: 1em">
              <Label for="t1" align="top">재난 상황판 제목</Label>
              <TextBox
                inputId="t1"
                v-model="title"
                placeholder="입력해주세요"
              ></TextBox>
              <p v-if="title">First Name: {{ title }}</p>
             </div> -->
          </section>
          <div class="modal-btns">
            <button class="submit" @click="submitHandler">저장</button>
            <button @click="toggleModal($event, target)">취소</button>
          </div>
        </section>
      </section>
    </client-only>
  </div>
</template>

<script>
export default {
  props: ['toggleModal', 'target', 'getDashboard'],
  created() {
    // this.getDashboard();
    this.dashboard_id = this.$router.currentRoute.params.dashboard_id;
    console.log('dashboard_id', this.dashboard_id);
  },
  data() {
    return {
      dashboard_id: '',
      select_number: 1,
      report_category: [
        { value: 1, text: '보고' },
        { value: 2, text: '확진자' },
        { value: 3, text: '사망자' },
        { value: 4, text: '조사중' },
      ],
      task_code_list: [
        {
          value: '1-1',
          text: '1-1',
        },
        {
          value: '2-1',
          text: '2-1',
        },
        {
          value: '2-2',
          text: '2-2',
        },
        {
          value: '3-2',
          text: '3-2',
        },
        {
          value: '20-1',
          text: '20-1',
        },
        {
          value: '6-1',
          text: '6-1',
        },
        {
          value: '7-5',
          text: '7-5',
        },
        {
          value: '47-1',
          text: '47-1',
        },
      ],
      todayDate: new Date(),
      input: {
        1: {
          priority: 1,
          category: '보고',
          reporter: '',
          unit: '건',
          date: '',
          task_code: '2-1',
          content: {
            title: '',
            description: '',
          },
        },
      },
    };
  },
  methods: {
    formatDate(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      return [y, d, m].join('-');
    },
    submitHandler() {
      //!{{ formatDate(todayDate) }}
      // console.log('CREATE', this.title, this.select_control_number);
      this.$axios
        .$post('/api/report', {
          ...this.input[this.select_number],
          date: this.formatDate(this.todayDate),
          dashboard_id: this.dashboard_id,
        })
        .then((res) => {
          console.log('res', res);
          this.$props.toggleModal(null, this.$props.target);
          this.$props.getDashboard();
          console.log('업데이트 완료');
        })
        .catch((e) => {
          alert('로그인이 만료되었습니다.');
          this.$router.push('/main');
        });
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
  z-index: 100;
}

.modal-inner {
  background: white;
  width: 600px;
  margin: 50px auto;

  padding: 50px;
}

.modal-body.create-newboard {
  display: flex;
  flex-direction: column;
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
  width: 49%;
}
</style>
