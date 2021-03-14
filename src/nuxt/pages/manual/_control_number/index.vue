<template>
  <div>
    <navBar sidebar_type="manual" />

    <section class="manual-wrapper">
      <h1>일반사항</h1>
      <section v-for="(item_1, idx_1) of data.contents">
        <h2 class="manual-title">{{ item_1.title }}</h2>
        <article v-for="(item_2, idx_2) of item_1.content">
          <div v-if="item_2.type === 'text'">
            <p v-for="(item_3, idx_3) of item_2.source">{{ item_3 }}</p>
          </div>
          <div v-else-if="item_2.type === 'table'">
            <h4>{{ item_2.title || item_2.source.sub_title }}</h4>
            <table>
              <thead>
                <tr>
                  <th
                    v-for="column_name of item_2.source.column_name"
                    colspan="1"
                  >
                    {{ column_name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row of item_2.source.rows" colspan="1">
                  <td v-for="row_item of row">{{ row_item }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
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
    this.disaster_control_number = this.$router.currentRoute.params.control_number;
    this.$axios
      .$get('/api/disaster_info', {
        params: {
          control_number: this.disaster_control_number,
        },
      })
      .then((res) => {
        console.log('res', res);
        this.data = res.intro;
      });
  },
  data() {
    return {
      data: {},
    };
  },
};
</script>

<style>
body {
  margin: 0;
}

.manual-wrapper {
  padding: 50px;
  /* overflow: scroll; */
}

.manual-title {
  color: rgb(245, 85, 85);
  border-left: 2px #c94738 solid;
  padding-left: 10px;
  margin-top: 50px;
}

/* table {
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  border-left: 1px solid #333;
} */

thead {
  background: blanchedalmond;
}
</style>
