<template>
  <div>
    <navBar sidebar_type="manual" />
    <section class="manual-wrapper">
      <h1>재개정이력</h1>
        <!-- <div v-for="item of data"> -->
          <h4>{{ data.title }}</h4>
          <table>
            <thead>
              <tr>
                <th
                  v-for="column_name of data.column_name"
                  colspan="1"
                >
                  {{ column_name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row of data.contents" colspan="1">
                <td v-for="row_item of row">{{ row_item }}</td>
              </tr>
            </tbody>
          </table>
        <!-- </div> -->
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
        this.data = res.revision_history;
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
