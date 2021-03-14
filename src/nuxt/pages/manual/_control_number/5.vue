<template>
  <div>
    <navBar sidebar_type="manual" />
    <section class="manual-wrapper">
      <h1>재난대응단계</h1>
      <table>
        <thead>
          <tr>
            <th v-for="column_name of column_name_list" colspan="1">
              {{ column_name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row of data" colspan="1">
            <td>{{ row.name }}</td>
            <td>{{ row.situation }}</td>
            <td>{{ row.guideline }}</td>
            <td>
              <span v-for="item of row.crisis_alert">{{ item }}</span>
            </td>
          </tr>
        </tbody>
      </table>
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
        this.data = res.response_levels;
      });
  },
  data() {
    return {
      data: {},
      column_name_list: ['구분', '상황', '대응지침', '위기경보'],
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

td {
  white-space: pre;
}
</style>
