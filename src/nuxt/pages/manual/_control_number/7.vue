<template>
  <div class="temp-wrapper">
    <navBar sidebar_type="manual" />
    <waveLoading v-if="isLoading" />
  </div>
</template>

<script>
//! wave
import navBar from '../../../components/navbar.vue';
import waveLoading from '../../../components/animation/wave';
export default {
  components: {
    navBar,
    waveLoading,
  },
  // created() {
  //   const control_number = this.$router.currentRoute.params.control_number;
  //   this.$axios
  //     .$get('/api/disaster_info', {
  //       params: {
  //         control_number,
  //       },
  //     })
  //     .then((res) => {
  //       console.log('res', res);
  //     });
  // },
  data() {
    return {
      isLoading: true,
    };
  },
  destroyed() {
    this.isLoading = !this.isLoading;

    const $canvas = document.querySelector('canvas');
    $canvas.remove();
  },
};
</script>

<style>
body {
  margin: 0;
}

.temp-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
