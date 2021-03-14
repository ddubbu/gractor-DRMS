<template>
  <div>
    <navBar sidebar_type="manual" />
    <section class="manual-wrapper">
      <button @click="toggleAllDropBox">
        {{ isSmall ? '모두 최대화' : '모두 최소화' }}
      </button>
      <h1>재난 대응 프로세스</h1>
      <section id="process-table-list">
        <section
          class="process-table"
          v-for="(response, idx) of disaster_info.response_levels"
          :key="idx"
        >
          <div :class="`process-table-head level-${response.level}`">
            <div class="process-table-head-title">
              <div>{{ `[${response.level} 단계]` }}</div>
              <h2>{{ response.name }}</h2>
            </div>
            <div class="crisis-alert-table">
              <div
                class="crisis-alert-table-head"
                v-for="(column_name, idx) of ['관심', '주의', '경계', '심각']"
              >
                <div
                  class="crisis-alert-table-head title"
                  :style="`background-color:var(--crisis-alert-${idx + 1})`"
                >
                  {{ column_name }}
                </div>
                <div v-if="response.crisis_alert.includes(column_name)">v</div>
                <div v-else style="color: white">v</div>
              </div>
            </div>
          </div>
          <section class="manual-task-list">
            <article
              v-for="(prc, prc_idx) of disaster_info.process"
              :class="`prc-item ${prc_idx + 1}`"
            >
              <div :class="`prc-head ${prc_idx + 1}`">
                {{ prc_idx + '. ' + prc }}
                <div :class="`prc-btns ${prc_idx + 1}`">
                  <button
                    v-if="
                      response.tasks.length > 0 &&
                      isOpen_drop_box[response.level - 1][prc_idx]
                    "
                    @click="toggleDropBox($event, response.level - 1, prc_idx)"
                  >
                    -
                  </button>
                  <button
                    v-else-if="
                      response.tasks.length > 0 &&
                      !isOpen_drop_box[response.level - 1][prc_idx]
                    "
                    @click="toggleDropBox($event, response.level - 1, prc_idx)"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <!-- <transition name="fade" mode="out-in"> -->
                <transition name="slide">
                  <ul
                    class="prc-dropdown-wrapper"
                    v-if="isOpen_drop_box[response.level - 1][prc_idx]"
                  >
                    <li
                      v-for="(task, task_idx) of response.tasks"
                      :key="task_idx"
                      v-if="prc_idx + 1 === task.process_category"
                    >
                      {{
                        `[${task.task_code}] ${
                          disaster_info.task_list[task.task_code]['title']
                        }`
                      }}
                    </li>
                  </ul>
                </transition>
              </div>
            </article>
          </section>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import navBar from '../../../components/navbar.vue';

export default {
  components: {
    navBar,
  },

  created() {
    // data fetch
    this.disaster_control_number = this.$router.currentRoute.params.control_number;
    this.$axios
      .$get('/api/disaster_info', {
        params: {
          control_number: this.disaster_control_number,
        },
      })
      .then((res) => {
        console.log('res', res);
        this.disaster_info = res;

        // data fetch 한 다음에 dropbox open 여부 저장하기
        this.isOpen_drop_box = [
          ...Array(this.disaster_info.response_levels.length),
        ].map((e) => Array(this.disaster_info.process.length).fill(true));

        console.log('this.isOpen_drop_box', this.isOpen_drop_box);
      });
  },
  updated() {
    // process-table width 설정
    document.documentElement.style.setProperty(
      '--process-table-width',
      `${100 / this.disaster_info.response_levels.length}%`
    );
  },
  data() {
    return {
      // data: {},
      disaster_info: {},
      column_name_list: ['구분', '상황', '대응지침', '위기경보'],
      isOpen_drop_box: [], // M(=#response_levels)xN(=#process)
      isSmall: false,
    };
  },
  methods: {
    toggleDropBox(e, a, b) {
      console.log('[Before]', this.isOpen_drop_box);
      this.isOpen_drop_box = this.isOpen_drop_box.map((row, rIdx) => {
        return row.map((col, cIdx) => {
          if (a === rIdx && b === cIdx) {
            console.log('toggle', this.isOpen_drop_box[rIdx][cIdx]);
            return !this.isOpen_drop_box[rIdx][cIdx];
          } else return this.isOpen_drop_box[rIdx][cIdx];
        });
      });
      console.log('[After]', this.isOpen_drop_box);
    },
    toggleAllDropBox(e) {
      this.isOpen_drop_box = this.isOpen_drop_box.map((row) => {
        return row.map(() => {
          return this.isSmall;
        });
      });
      this.isSmall = !this.isSmall;
    },
  },
};
</script>

<style>
/* @import '~/assets/styles/dashboard.css'; */

body {
  margin: 0;
}

.manual-wrapper {
  padding: 50px;
}

.manual-title {
  color: rgb(245, 85, 85);
  border-left: 2px #c94738 solid;
  padding-left: 10px;
  margin-top: 50px;
}

/** //! process each item */
.prc-item {
  margin: 2px;
}

.prc-btns button {
  padding-left: 5px;
  padding-right: 5px;
}

.prc-head {
  display: flex;
  justify-content: space-between;
  background: rgb(225, 222, 222);
}

ul.prc-dropdown-wrapper,
li {
  list-style: none;
  padding: 0;
  margin: 5px;
}

/* //! process diagram */
#process-table-list {
  display: flex;
  max-width: 90%;
  margin: 0 auto;
}

.process-table {
  width: var(--process-table-width);
  margin: 5px;
  border-right: solid 2px #ccc;
  border-bottom: solid 2px #ccc;
  border-left: solid 2px #ccc;
}

.process-table-head {
  margin-bottom: 6rpx;
}

.process-table-head-title {
  display: flex;
  justify-content: center;
  margin-right: 50px;
}

.crisis-alert-table {
  display: flex;
}
.crisis-alert-table-head {
  flex-grow: 1;
  text-align: center;
}

/* 선 긋기 */
.crisis-alert-table-head div,
.prc-item {
  border: solid 1px #ccc;
  border-collapse: collapse;
}
.crisis-alert-table-head.title {
  color: white;
}

.process-table-head.level-1 {
  border-top: var(--crisis-alert-2) solid 5px;
}

.process-table-head.level-2 {
  border-top: var(--crisis-alert-3) solid 5px;
}

.process-table-head.level-3 {
  border-top: var(--crisis-alert-4) solid 5px;
}
.process-table-head.level-4 {
  border-top: var(--crisis-alert-1) solid 5px;
}

:root {
  --crisis-alert-1: #0080a4;
  --crisis-alert-2: #fdcb31;
  --crisis-alert-3: #f37720;
  --crisis-alert-4: #ed242d;
}

.manual-task-list {
  /* overflow-y: auto; */
  /* height: 600px; */
  overflow: visible;
}

/* //! (시작) dropdown animation */
ul.prc-dropdown-wrapper {
  transform-origin: top;
  transition: transform 0.2s linear;
}
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
} */
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /* opacity: 0; */
  transform: scaleY(0);
}
/* //! (끝) dropdown animation */

li.task {
  height: 76px;
  display: flex;
  list-style: none;
}

li.task div {
  /* 말줄임표 (...) */
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
}

/* //! process diagram styling */
</style>
