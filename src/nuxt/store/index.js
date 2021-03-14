export const state = () => ({
  isLogin: false,
  accessToken: '',
  userInfo: { id: '' }
})

export const mutations = {
  toggleLogin: function (state, { data }) {
    state.isLogin = !state.isLogin;
    console.log("[AFTER] toggleLogin", state.isLogin)
    if (data.user_id) {
      state.userInfo.id = data.user_id;
    }
    // if (data && data.data) { //success login
    //   state.accessToken = data.data;
    //   state.isLogin = true;
    // } else { //success logout
    //   state.accessToken = '';
    //   state.isLogin = false;
    // }
  },
  handleExpire: function (state, data) {
    console.log("expirerperiepr", this.$router);
    alert('로그인이 만료되었습니다.')
    this.$router.push('/main');
  }
}