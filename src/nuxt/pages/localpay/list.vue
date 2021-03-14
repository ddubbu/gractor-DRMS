<template>
  <client-only>
    <section id="grid-content">
      <grid :selectData="selectData" />
    </section>
  </client-only>
</template>

<script>
import grid from '../../components/localpay/grid.vue';

export default {
  components: {
    grid,
  },
  created() {
    this.selectData.region = this.$route.query.region;
    this.selectData.category = this.$route.query.category;
  },
  data() {
    return {
      selectData: {
        region: undefined,
        category: undefined,
      },
      data: [],
      total: 0,
    };
  },
};
</script>

<style lang="stylus" scoped></style>
