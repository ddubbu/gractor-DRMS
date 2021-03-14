<template>
  <div>
    <client-only>
      <waveLoading v-if="isLoading" />

      <section id="main" v-else>
        <section id="side-banner">
          <h1 id="logo">DRMS</h1>
          <p>재난현장조치</p>
          <p>행동매뉴얼</p>
        </section>
        <section id="menu">
          <search />
          <section id="menu-wrapper">
            <div class="menu-item">
              <h2>행동매뉴얼</h2>
              <p>
                재난유형별 재난대응 절차 및 프로세스, 행동요령을 조회할 수 있습니다.
              </p>
              <disasterCategory />
              <img class="menu-img" src="/menu1.png" />
            </div>
            <div class="menu-item">
              <h2>재난상황판</h2>
              <p>재난별 대응 프로세스를 관리할 수 있는 플랫폼을 제공합니다.</p>
              <section
                class="main-link-btn"
                @click="
                  () => {
                    this.$router.push('/hurb/');
                  }
                "
              >
                자세히보기
              </section>
              <img class="menu-img" src="/menu2.png" />
            </div>
            <div class="menu-item">
              <h2>위험시설물 데이터 분석</h2>
              <p>MQTT 통신을 통한 실시간 데이터 수집</p>
              <section
                class="main-link-btn"
                @click="
                  () => {
                    this.$router.push('/map_chart');
                  }
                "
              >
                자세히보기
              </section>
              <img class="menu-img" src="/menu3.png" />

            </div>
            <!-- <div class="menu-item"><h2>LiveDRMS이야기</h2></div>
            <div class="menu-item"><h2>LiveDRMS 소개</h2></div>
            <div class="menu-item"><h2>LiveDRMS 주요기능 사용법</h2></div> -->
          </section>
        </section>
        <loginSideBar />
      </section>
    </client-only>
  </div>
</template>

<script>
import search from '../components/search.vue';
import disasterCategory from '../components/selectbox/disasterCategory.vue';
import loginSideBar from '../components/loginSideBar.vue';
import waveLoading from '../components/animation/wave';

// to go http://localhost:8000/dashboard/bTzq63cBSBqlwJRG-rfu?disaster_control_number=1
export default {
  // created() {
  //   this.$axios.$get('/api/session', (res) => {
  //     console.log("clinet '/api/session'", res);
  //   });
  // },
  components: {
    search,
    disasterCategory,
    loginSideBar,
    waveLoading,
  },
  data() {
    return {
      board_id: '8YQY8XcBc6Fh9j6VB6Z8',
      isLoading: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = !this.isLoading;
      const $canvas = document.querySelector('canvas');
      $canvas.remove();
    }, 1000);
  },
};
</script>

<style>
@import '~assets/styles/signin.css';

body {
  margin: 0;
  background-color: #ffffff;
}

* {
  box-sizing: border-box;
}

#main {
  display: flex;
}

#main > section {
  height: 100vh;
}

#main > #side-banner {
  width: 30%;
  min-width: 400px;
  max-width: 560px;
  background: #3574b7 url('@/assets/images/intro_bg.png') no-repeat 100% 100%;
  background-size: 80%;

  padding-top: 50px;
}

/* #side-banner h1 {
  margin-top: 20px;
} */

#side-banner p {
  margin: 0;
}

#logo,
#side-banner p {
  color: white;
  font-size: 2.2em;
  margin-left: 10%;
}

#menu {
  background-color: #ecf1f8;
  width: 100%;
  padding: 250px 10%;
  min-width: 885px;
}

#menu-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* min-width: 500px; */
}

.menu-item {
  width: 32%;
  margin-bottom: 2%;

  /* border: 1px solid black; */
  border-radius: 10px;
  background-color: #fff;
  padding: 40px 25px 5px 25px;
  /* height: 230px; */
  height: 450px;
}

.menu-item h2 {
  margin: 0;

  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
}

.menu-item p {
  /* 
    max-height: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden; */

  height: 50px;
  white-space: normal;
  word-wrap: normal;
  overflow: hidden;
}

/* 파란색 버튼 */
.main-link-btn {
  background-color: #f7f8fa;
  padding: 10px;
  transition: all 0.5s ease 0s;
  border-radius: 5px;
  font-size: 16px;

  /* text-align: center; */

  margin-top: 20px;

  cursor: pointer;
}
.main-link-btn:hover {
  background-color: #337ab7;
  color: white;
}

.menu-img {
  margin-top: 20px;
  width: 100%;
}

.menu-img:hover {
  transform: scale(1.1);
  /* width: 150%; */
}
</style>
