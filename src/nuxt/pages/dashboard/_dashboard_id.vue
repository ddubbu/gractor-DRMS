<template>
  <div>
    <navBar sidebar_type="dashboard" :getDashboard="getDashboard" />
    <section id="body-content">
      <section id="summary">
        <div>
          <span> [{{ disaster_info.control_number }}] </span>
          {{ disaster_info.name }}
        </div>
        <div id="title">
          <div
            id="situation"
            class="real"
            v-if="dashboard_info.situation_type === 'real'"
          >
            실제상황
          </div>
          <div id="situation" class="real" v-else>훈련</div>
          <h2>{{ dashboard_info.title }}</h2>
        </div>
        <div id="description">
          <div>접수일시 : {{ dashboard_info.start_date }}</div>
          <div id="state-response-levels">
            <span
              v-for="(response, idx) of disaster_info.response_levels"
              :key="idx"
            >
              {{ response.name }}
            </span>
          </div>
        </div>
      </section>
      <section id="swiper-wrapper">
        <article
          :class="
            category.key === '보고' ? 'swiper-slide report' : 'swiper-slide'
          "
          v-for="(category, idx) of reports.agg_category"
          :key="idx"
          @click="
            toggleModal(
              $event,
              category.key === '보고' ? 'report_all' : 'patient_all',
              category.key
            )
          "
        >
          <div class="slide-header">
            <div><i class="fas fa-bullhorn"></i> {{ category.key }}</div>
            <div class="unit">
              단위:{{ category.include_source.hits.hits[0]._source.unit }}
            </div>
          </div>
          <div class="slide-count">
            {{ category.doc_count }}
            <span class="slide-count-unit">
              {{ category.include_source.hits.hits[0]._source.unit }}
            </span>
          </div>
        </article>
      </section>
      <section id="main-content">
        <section id="report-wrapper">
          <h3>최신 보고내역</h3>
          <!-- <div id="report-wrapper-title"></div> -->
          <li
            v-for="(report, idx) of onlyReports.slice(0, 10)"
            :key="idx"
            @click="clickReportOne($event, report)"
          >
            <span>{{ report.date }}</span>
            <span>{{ report.content.title }}</span>
          </li>
        </section>
        <section id="process-wrapper">
          <section id="process-table-list">
            <section
              class="process-table"
              v-for="(response, idx) of disaster_info.response_levels"
              :key="idx"
            >
              <div class="response-level">{{ response.name }}</div>
              <section class="task-list">
                <li
                  class="task"
                  v-for="(task, idx) of response.tasks"
                  :key="idx"
                >
                  <button
                    :class="`btn-task-state ${
                      dashboard_info.task_states[task.task_code].state
                    }`"
                    @click="toggleModal($event, 'task_state', task)"
                  ></button>
                  <div
                    @click="toggleModal($event, 'task_info', task.task_code)"
                  >
                    {{
                      `[${task.task_code}] ${
                        disaster_info.task_list[task.task_code]['title']
                      }`
                    }}
                  </div>
                </li>
              </section>
            </section>
          </section>

          <section id="task-state-list">
            <div class="task-state-list-icon todo"></div>
            <span>수행이전</span>
            <div class="task-state-list-icon doing"></div>
            <span>수행중</span>
            <div class="task-state-list-icon done"></div>
            <span>수행완료</span>
            <div class="task-state-list-icon stop"></div>
            <span>중단</span>
            <div class="task-state-list-icon delay"></div>
            <span>지연</span>
          </section>
        </section>
      </section>
    </section>
    <modalTaskState
      v-if="openModal['task_state']"
      :toggleModal="toggleModal"
      target="task_state"
      :event_collect="event_collect"
      :dashboard_info="dashboard_info"
    />

    <!-- 일반 report 리스트 -->
    <modalReportAll
      v-if="openModal['report_all']"
      :toggleModal="toggleModal"
      target="report_all"
      :onlyReports="onlyReports"
      :event_collect="event_collect"
    />
    <modalReportOne
      v-if="openModal['report_one']"
      :toggleModal="toggleModal"
      target="report_one"
      :event_collect="event_collect"
    />
    <!-- 환자 report 리스트 -->
    <modalPatientAll
      v-if="openModal['patient_all']"
      :toggleModal="toggleModal"
      target="patient_all"
      :rows="groupByCategory(reports.rows, event_collect.patient_type)"
      :event_collect="event_collect"
    />
    <!-- task 정보 띄우기 -->
    <modalTaskInfo
      v-if="openModal['task_info']"
      :toggleModal="toggleModal"
      target="task_info"
      :task="event_collect.task_info"
    />
    <modalModifyReport
      v-if="openModal['modify_report']"
      :toggleModal="toggleModal"
      target="modify_report"
      :getDashboard="getDashboard"
      :event_collect="event_collect"
    />
  </div>
</template>

<script>
import modalTaskState from '../../components/modal/modalTaskState.vue';
import modalReportAll from '../../components/modal/modalReportAll.vue';
import modalReportOne from '../../components/modal/modalReportOne.vue';
import modalPatientAll from '../../components/modal/modalPatientAll.vue';
import modalTaskInfo from '../../components/modal/modalTaskInfo.vue';
import modalModifyReport from '../../components/modal/modalModifyReport';

import navBar from '../../components/navbar.vue';
export default {
  components: {
    modalTaskState,
    modalReportAll,
    modalReportOne,
    navBar,
    modalPatientAll,
    modalTaskInfo,
    modalModifyReport,
  },
  data() {
    return {
      disaster_info: {},
      dashboard_info: {},
      reports: {},
      onlyReports: [],
      openModal: {
        task_state: false,
        report_all: false,
        report_one: false,
        patient_all: false,
        patient_one: false,
        task_info: false,
        modify_report: false,
      },
      event_collect: {
        task: null,
      },
      // reports: [{ date: '2021-01-10', title: '코로나 확진자 신고 접수' }],
    };
  },
  created() {
    this.getDashboard();
  },

  updated() {
    // 생명주기 고려해야하네.
    // 현재 state-response-levels 표시
    const $items = document.querySelectorAll('#state-response-levels span');
    // console.log('$items', $items, this.cur_response_level);
    $items[this.dashboard_info.cur_response_level - 1].classList.add('active');

    // process-table width 설정
    document.documentElement.style.setProperty(
      '--process-table-width',
      `${100 / this.disaster_info.response_levels.length}%`
    );
  },

  methods: {
    getDashboard() {
      //! data fetch
      this.$axios
        .$get('/api/dashboard', {
          params: {
            disaster_control_number: this.$router.currentRoute.query
              .disaster_control_number, //this.disaster_info.control_number,
            dashboard_id: this.$router.currentRoute.params.dashboard_id, //this.dashboard_info.id,
          },
        })
        .then((res) => {
          console.log('res', res);
          const { disaster_info, dashboard_info, reports_data, user_id } = res;
          this.dashboard_info = {
            ...dashboard_info,
            id: this.$router.currentRoute.params.dashboard_id,
          };
          this.disaster_info = disaster_info;
          this.reports = reports_data;

          // 보고 데이터 가져오기
          this.onlyReports = this.groupByCategory(reports_data.rows, '보고');
          console.log('this.onlyReports', this.onlyReports);

          //! user_info 갱신
          if (user_id && !this.$store.state.isLogin) {
            this.$store.commit('toggleLogin', { data: { user_id } });
          }
        });
    },
    groupByCategory(rows, category) {
      return rows
        .filter(({ _source }) => {
          if (_source.category === category) return true;
          else return false;
        })
        .map((row) => {
          return {
            task_id: row._id,
            ...row._source,
          };
        });
    },
    // task_state() {},
    toggleModal(e, target, data) {
      this.openModal[target] = !this.openModal[target];
      console.log('click', 'this.openModal[target]', this.openModal[target]);

      if (target === 'task_state' && data !== undefined) {
        //task_state 클릭하면
        //여는 용
        this.event_collect.task = data; // 클릭한 task 넘길거임
      } else if (target === 'patient_all') {
        this.event_collect.patient_type = data;
      } else if (target === 'task_info') {
        // data is task_code

        this.event_collect.task_info = this.disaster_info.task_list[data];
        console.log('task_info', data);
      }
    },
    clickReportOne(e, report) {
      console.log('here');
      console.log('report', report);
      this.event_collect.row = {
        task_id: report.task_id,
        title: report.content.title,
        description: report.content.description,
        reporter: report.reporter,
      };
      this.toggleModal(e, 'report_one');
    },
  },
};
</script>

<style>
@import '~/assets/styles/dashboard.css';

.btn-task-state {
  cursor: pointer;
}
</style>
