<template>
  <div>
    <h2>Basic PasswordBox</h2>
    <div style="margin-bottom: 20px">
      <TextBox v-model="name" placeholder="name" iconCls="icon-man"></TextBox>
    </div>
    <div style="margin-bottom: 20px">
      <PasswordBox v-model="password" placeholder="Password"></PasswordBox>
    </div>
    <p v-if="name">Username: {{ name }}</p>
    <p v-if="password">Password: {{ password }}</p>
    <LinkButton :disabled="false" @click="signIn()" style="width: 100px"
      >SignIn</LinkButton
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      password: null,
    };
  },
  methods: {
    signIn() {
      this.$axios.$get('/api/sign').then((data) => {
        console.log('searchdata', data.rows);
        const { rows, total } = data;
        this.data = rows.map(({ _source }) => {
          return _source;
        });
        console.log('this.data', this.data);
        console.log('this.data', this.data['name']);
        // if(this.data!==){

        // }
      });
    },
  },
};
</script>
