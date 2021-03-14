<template>
  <div>
    <client-only>
      <section class="modal-outer">
        <section class="modal-inner">
          <div class="modal-title"><h1>새로운 보드 추가</h1></div>
          <section class="modal-body create-newboard">
            <Label for="c1" align="top">재난 타입을 선택하세요</Label>
            <ComboBox
              inputId="c1"
              v-model="select_control_number"
              :data="disaster_category"
            ></ComboBox>
            <div style="margin-top: 20px; margin-right: 1em">
              <Label for="t1" align="top">재난 상황판 제목</Label>
              <TextBox
                inputId="t1"
                v-model="title"
                placeholder="입력해주세요"
              ></TextBox>
              <!-- <p v-if="title">First Name: {{ title }}</p> -->
            </div>
          </section>
          <div class="modal-btns">
            <button class="submit" @click="submitHandler">저장</button>
            <button @click="toggleCreateNewBoardModal">취소</button>
          </div>
        </section>
      </section>
    </client-only>
  </div>
</template>

<script>
export default {
  props: ['toggleCreateNewBoardModal'],
  created() {
    this.getDashboard();
  },
  data() {
    return {
      title: '',
      disaster_category: [],
      select_control_number: 1,
    };
  },
  methods: {
    getDashboard() {
      // fetch data
      this.$axios.$get('/api/disaster_category').then((res) => {
        console.log('here', res);
        this.disaster_category = res.map((item) => {
          return {
            value: item.control_number,
            text: item.name,
          };
        });
      });
    },
    submitHandler() {
      console.log('CREATE', this.title, this.select_control_number);

      this.$axios
        .$post('/api/dashboard', {
          title: this.title,
          control_number: this.select_control_number,
          user_id: this.$store.state.userInfo.id,
        })
        .then((res) => {
          console.log('res', res);
          this.$props.toggleCreateNewBoardModal();
          this.$router.push(`/dashboard/${res.id}?disaster_control_number=1`)
          // this.getDashboard();
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
