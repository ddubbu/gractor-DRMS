<template>
  <div>
    <section
      id="btn-disaster-category"
      class="main-link-btn"
      @click="toggleHandler"
    >
      재난 유형선택
    </section>
    <section id="disaster-select-wrapper">
      <article
        class="disaster-select-item"
        v-for="(item, idx) of disaster_category"
        :key="idx"
      >
        <img
          :src="`/${item.control_number}.png`"
          @click="linkToManual($event, item.control_number)"
        />
        <p>{{ item.name }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  created() {
    // fetch data
    this.$axios.$get('/api/disaster_category').then(({ result, user_id }) => {
      console.log('here', result);
      this.disaster_category = result;

      if (user_id && !this.$store.state.isLogin) {
        this.$store.commit('toggleLogin', { data: { user_id } });
      }
    });
  },
  data() {
    return {
      disaster_category: [],
    };
  },
  methods: {
    toggleHandler() {
      const $disaster_select_wrapper = document.querySelector(
        '#disaster-select-wrapper'
      );
      if ($disaster_select_wrapper.style.display === 'none') {
        $disaster_select_wrapper.style.display = 'flex';
      } else {
        $disaster_select_wrapper.style.display = 'none';
      }
    },
    linkToManual(e, control_number) {
      this.$router.push(`/manual/${control_number}/6`);
    },
  },
};
</script>

<style>
#disaster-select-wrapper {
  width: 710px;
  height: 500px;
  overflow: auto;
  border: solid 1px #dcdcdc;
  box-shadow: 5px 5px 5px rgb(0 0 0 / 10%);
  position: absolute;
  padding: 20px;
  /* top: 54px;
  left: 0px; */
  display: none;
  background-color: #fff;
  z-index: 100;

  flex-wrap: wrap;
}

.disaster-select-item {
  width: 16.6666%;
  padding: 10px;
  text-align: center;
  font-size: 13px;
  line-height: 1.1;
  /* flex-wrap: wrap; */
}

.disaster-select-item div {
  overflow-wrap: break-word;
}

.disaster-select-item img {
  background: white;
  max-width: 100%;
  border-radius: 100%;
  border: solid 1px #ccc;
  cursor: pointer;
}

.disaster-select-item img:hover {
  filter: invert(100%);
}
</style>
