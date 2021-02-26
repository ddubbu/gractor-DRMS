<template>
  <div>
    <h2>Floating Label</h2>
    <Form
      ref="form"
      :model="user"
      :rules="rules"
      labelPosition="top"
      :labelWidth="150"
      :floatingLabel="true"
      @validate="errors = $event"
      style="max-width: 500px"
    >
      <FormField name="name" label="Name">
        <TextBox v-model="user.name"></TextBox>
      </FormField>
      <FormField name="email" label="Email">
        <TextBox v-model="user.email"></TextBox>
      </FormField>
      <FormField name="password" label="Password">
        <PasswordBox v-model="user.password"></PasswordBox>
      </FormField>
      <FormField name="accept" label="Accept Me" labelPosition="after">
        <CheckBox v-model="user.accept"></CheckBox>
      </FormField>
      <FormField>
        <LinkButton :disabled="false" @click="submitForm()">Submit</LinkButton>
      </FormField>
    </Form>
    <p>{{ user }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        accept: false,
      },
      rules: {
        name: ['required', 'length[5,10]'],
        email: 'required',
        password: 'required',
      },
      errors: {},
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        console.log(valid);
        this.$axios.$post('/api/sign', this.user).then((data) => {});
      });
    },
  },
};
</script>
