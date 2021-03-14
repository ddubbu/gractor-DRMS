<template>
  <div id="sideWrap" class="close">
    <section id="sideBody">
      <button
        v-for="(item, idx) of btn_list"
        :key="idx"
        @click="moveToPage($event, idx + 1)"
      >
        {{ item.content }}
      </button>
    </section>
    <button id="toggleBtn" @click="toggleSideBar" v-if="isOpen">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  created() {
    this.disaster_control_number = this.$router.currentRoute.params.control_number;
  },
  props: ['toggleSideBar', 'isOpen'],
  data() {
    return {
      btn_list: [
        { content: '일반사항' },
        { content: '위기경보' },
        { content: '재난관리체계' },
        { content: '비상연락망' },
        { content: '재난대응단계' },
        { content: '재난대응프로세스' },
        { content: '협업체계 (준비중)' }, //부서별, 대응단계별
        { content: '관련서식' },
        { content: '재개정이력' },
      ],
      disaster_control_number: 1,
    };
  },
  methods: {
    moveToPage(e, page) {
      page = page === 1 ? '' : page;
      this.$router.push(`/manual/${this.disaster_control_number}/${page}`);
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
