<template>
  <client-only>
    <div>
      <div id="nav-bar">
        <i class="fas fa-home" @click="goToMain"></i>
        <div>
          <!-- {{ $store.state.isLogin }} -->
          <i
            v-if="$store.state.isLogin"
            class="fas fa-sign-out-alt btn-logout"
            @click="logoutHandler"
          ></i>
          <i
            class="fas fa-bars"
            @click="toggleSideBar"
            v-if="!(sidebar_type === 'hurb') && !(sidebar_type === 'map_chart')"
          ></i>
        </div>
      </div>
      <dashboardSideBar
        :getDashboard="getDashboard"
        :toggleSideBar="toggleSideBar"
        :isOpen="isOpen"
        v-if="sidebar_type === 'dashboard'"
      />
      <manualSideBar
        :toggleSideBar="toggleSideBar"
        :isOpen="isOpen"
        v-else-if="sidebar_type === 'manual'"
      />
    </div>
  </client-only>
</template>

<script>
import dashboardSideBar from '../components/sidebar/dashboard.vue';
import manualSideBar from '../components/sidebar/manual.vue';
export default {
  props: ['sidebar_type', 'getDashboard'],
  components: {
    dashboardSideBar,
    manualSideBar,
  },
  mounted() {
    console.log('sidebar_type', this.$props.sidebar_type);
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    goToMain() {
      this.$router.push('/main');
    },
    toggleSideBar() {
      const $sideWrap = document.querySelector('#sideWrap');
      if ($sideWrap.classList.contains('close')) {
        //sidebar 열기
        $sideWrap.style.right = '0px';
        $sideWrap.classList.remove('close');
        $sideWrap.classList.add('open');
        this.isOpen = true;
      } else {
        $sideWrap.style.right = '-485px';
        $sideWrap.classList.remove('open');
        $sideWrap.classList.add('close');
        this.isOpen = false;
      }
    },
    logoutHandler() {
      this.$axios.$delete('/api/logout').then((res) => {
        alert('logout 완료');
        console.log('[Before] signin vue', this.$store.state.isLogin);
        this.$store.commit('toggleLogin', { data: { user_id: '' } });
        console.log('logoutHandler');
        console.log('[After] signin vue', this.$store.state.isLogin);
        this.$router.push('/main');
      });
    },
  },
};
</script>

<style>
#nav-bar {
  font-size: 36px;
  background: #2a3f54;
  color: #fff;
  padding: 0.4em 1.4em;

  display: flex;
  justify-content: space-between;
  /* height: 50px; */

  /* position: fixed;
  top: 0;
  left: 0; */
  /* top: 0%;
  */

  width: 100vw;
}
#nav-bar i {
  cursor: pointer;
}

.btn-logout {
  margin-right: 5px;
}
</style>
