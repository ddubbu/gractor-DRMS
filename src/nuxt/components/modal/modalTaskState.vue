<template>
  <div>
    <section class="modal-outer">
      <section class="modal-inner">
        <div class="modal-title"><h1>조치내용 수행단계</h1></div>
        <section class="modal-body">
          <div
            id="input-task-states"
            v-for="(item, idx) of task_state_levels"
            :key="idx"
          >
            <input
              type="checkbox"
              :id="`checkbox-${item.state}`"
              :value="item.state"
              :checked="item.state === cur_task_state"
              name="checkbox-task-state"
              @click="changeCheckBox($event, item.state)"
            />
            <!-- checked="checked" -->

            <!-- <label for="checkbox-todo">v</label> -->
            <span>{{ item.text }}</span>
          </div>
        </section>
        <div class="modal-btns">
          <button class="submit" @click="submitHandler">저장</button>
          <button class="cancle" @click="toggleModal($event, target)">
            취소
          </button>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  props: ['target', 'toggleModal', 'event_collect', 'dashboard_info'],
  created() {
    this.cur_task_state = this.$props.dashboard_info.task_states[
      this.$props.event_collect.task.task_code
    ].state;
    this.checked_task_state = this.cur_task_state;
  },
  data() {
    return {
      task_state_levels: [
        {
          state: 'todo',
          text: '수행이전',
        },
        {
          state: 'doing',
          text: '수행중',
        },
        {
          state: 'done',
          text: '수행완료',
        },
        {
          state: 'stop',
          text: '중단',
        },
        {
          state: 'delay',
          text: '지연',
        },
      ],
      cur_task_state: 'todo',
      checked_task_state: '',
    };
  },
  methods: {
    // changeCheckBox() {
    //   console.log('click');
    // },
    changeCheckBox(e, check_state) {
      //체크 모두 해제하고
      const $checkboxes = Array.from(
        document.querySelectorAll(
          'input[type="checkbox"][name="checkbox-task-state"]'
        )
      );
      $checkboxes.map((item) => {
        item.checked = false;
      });

      //선택한거 true
      e.target.checked = true;
      this.checked_task_state = check_state;
    },
    submitHandler(e) {
      this.cur_task_state = this.checked_task_state;

      this.$props.toggleModal(null, this.target);
      console.log('=============', this.cur_task_state);
      this.$axios
        .$put('/api/dashboard', {
          id: this.$props.dashboard_info.id,
          payload: {
            task_states: {
              [this.$props.event_collect.task.task_code]: {
                state: this.cur_task_state,
              },
            },
            // [`task_states[${this.$props.event_collect.task.task_code}]`]: this
            //   .cur_task_state,
          },
        })
        .then((res) => {
          if (res === 'expired') {
            console.log('res==========', res);
            this.$store.commit('handleExpire');
          } else {
            //진짜 업데이트
            this.$props.dashboard_info.task_states[
              this.$props.event_collect.task.task_code
            ].state = this.cur_task_state;
          }
        });
      // console.log('herehrherhehr');
      // console.log(this.$props.event_collect.task, this.$props.dashboard_info);
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
  padding: 0 50px;
}

.modal-btns button {
  /* border: none;
  outline: none; */
  margin-top: 50px;
  width: 49%;
}

/* .modal-body input {
}
input[id='checkbox-todo'] + label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #bcbcbc;
  cursor: pointer;
  color: 'red';
  background-color: 'red';
}

label {
  background-color: 'red';
}

input[id='checkbox-todo']:checked + label {
  background-color: 'yellow';
} */
</style>
