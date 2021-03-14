<template>
  <div>
    <div id="sideWrap" class="close">
      <section id="sideBody">
        <button>상세보기/상황이력</button>
        <button>단계전환/상황종료</button>
        <button @click="toggleModal($event, 'createReport')">상황 보고</button>
        <button>상황 전파</button>
        <button>조치내용 수행결과</button>
        <button>결과 및 개선사항</button>
      </section>
      <button id="toggleBtn" @click="toggleSideBar" v-if="isOpen">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <createNewReportModal
      v-if="openModal.createReport"
      :toggleModal="toggleModal"
      target="createReport"
      :getDashboard="getDashboard"
    />
  </div>
</template>

<script>
import createNewReportModal from '../modal/createNewReportModal';
export default {
  components: {
    createNewReportModal,
  },
  props: ['toggleSideBar', 'isOpen', 'getDashboard'],
  data() {
    return {
      openModal: {
        createReport: false,
      },
    };
  },
  methods: {
    toggleModal(e, target) {
      this.openModal[target] = !this.openModal[target];
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

#sideBody {
  padding: 50px;
}

#sideBody button {
  display: flex;
  flex-direction: column;

  border: none;
  outline: none;
  width: 90%;
  margin: 5px 0 5px 0;

  font-size: 20px;
  background-color: #3574b7;
  color: white;
  padding: 5px;

  cursor: pointer;
}

/*//! default sidebar styling */
#sideWrap {
  width: 485px;
  background-color: #fff;
  height: 100vh;
  position: fixed;
  /* right: 0px; */
  right: -485px;
  top: 0;
  transition: all 0.5s ease 0s;
  /* padding: 100px 40px; */
  z-index: 100;
  /* background: #fff url(../../images/sideWrapBg.png) no-repeat 50% 90%; */
}

#toggleBtn {
  outline: none;
  border: none;
  display: block;
  width: 74px;
  height: 148px;
  border-radius: 148px 0 0 148px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -74px;
  margin-left: -74px;

  background-color: #3574b7;
  color: #fff;
  /* z-index: 1; */
  font-size: 2.5em;
  cursor: pointer;
}
#toggleBtn i {
  margin-top: 5px;
}

#sideWrap.open #toggleBtn::before {
  content: '';
  display: block;
  width: 95px;
  height: 190px;
  border-radius: 148px 0 0 148px;
  position: absolute;
  left: -21px;
  top: -21px;
  background-color: rgba(53, 116, 183, 0.3);
  z-index: -1;
}

/* [after opening sideBar]  */
#nav-tab {
  display: flex;
  margin-top: 90px;
}

#nav-tab > * {
  width: 50%;
  text-align: center;
  /* border: 1px black solid; */
  padding: 5px;
  cursor: pointer;
}

#nav-tab > *.click {
  background: #3293f531;
}
</style>
