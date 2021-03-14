<template>
  <div id="loginSideWrap" class="close">
    <section id="loginSideBody">
      <section id="nav-tab">
        <article class="signin click" @click="toggleTab">로그인</article>
        <article class="signup" @click="toggleTab">회원가입</article>
      </section>
      <section class="sign-form" v-if="loginTab">
        <label>이메일</label>
        <input
          placeholder="Enter email"
          name="email"
          type="email"
          @input="inputHandler($event)"
          :value="input.email"
        />
        <label>비밀번호</label>
        <input
          placeholder="Enter password"
          name="password"
          type="password"
          @input="inputHandler($event)"
          :value="input.password"
        />
        <button @click="signInHandler">Sign In</button>
        <!-- <p>or</p>
        <button @onClick="socialSignUp">Continue with github 🤖</button> -->
        <!-- <a href="/users/signup">Sign up for an account</a> -->
      </section>
      <section class="sign-form" v-else>
        <label>이름</label>
        <input
          placeholder="Enter name"
          name="name"
          @input="inputHandler($event)"
          :value="input.name"
        />
        <label>이메일</label>
        <input
          placeholder="Enter email"
          name="email"
          type="email"
          @input="inputHandler($event)"
          :value="input.email"
        />
        <label>비밀번호</label>
        <input
          placeholder="Enter password"
          name="password"
          type="password"
          @input="inputHandler($event)"
          :value="input.password"
        />
        <label>비밀번호 확인</label>
        <input
          placeholder="Enter password"
          name="password_check"
          type="password"
          @input="inputHandler($event)"
          :value="input.password_check"
        />
        <button @click="signUpHandler">Sign Up</button>
        <!-- <p>or</p> -->
        <!-- <button @onClick="socialSignUp">Continue with github 🤖</button> -->
        <!-- <a href="/users/signup">Sign up for an account</a> -->
      </section>
    </section>
    <button v-if="!$store.state.isLogin" id="toggleBtn" @click="toggleSideBar">
      <i class="fas fa-times" v-if="isOpen"></i>
      <i class="fas fa-sign-in-alt" v-else></i>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      input: {
        name: '',
        email: '',
        password: '',
        password_check: '',
      },
      loginTab: true,
    };
  },
  methods: {
    toggleSideBar() {
      const $loginSideWrap = document.querySelector('#loginSideWrap');
      if ($loginSideWrap.classList.contains('close')) {
        //sidebar 열기
        $loginSideWrap.style.right = '0px';
        $loginSideWrap.classList.remove('close');
        $loginSideWrap.classList.add('open');
        this.isOpen = true;
      } else {
        $loginSideWrap.style.right = '-485px';
        $loginSideWrap.classList.remove('open');
        $loginSideWrap.classList.add('close');
        this.isOpen = false;
      }
    },
    inputHandler(e) {
      this.input[e.target.name] = e.target.value;
    },
    initInput() {
      console.log('input', this.input);
      this.input = {
        name: '',
        email: '',
        password: '',
        password_check: '',
      };
    },
    async signInHandler() {
      this.$axios
        .$post('/api/signin', {
          email: this.input.email,
          password: this.input.password,
        })
        .then((res) => {
          console.log('[Before] signin vue', this.$store.state.isLogin);
          this.$store.commit('toggleLogin', { data: res });
          console.log('signInHandler');
          console.log('[After] signin vue', this.$store.state.isLogin);
          if (this.$store.state.isLogin) {
            this.$router.push(
              '/hurb'
              // '/manual/1'
              // '/dashboard/8YQY8XcBc6Fh9j6VB6Z8?disaster_control_number=1'
            );
          }
        })
        .catch((err) => {
          alert('존재하지 않는 유저입니다');
        });

      this.initInput();
    },
    async signUpHandler() {
      this.$axios
        .$post('/api/signup', {
          email: this.input.email,
          name: this.input.name,
          password: this.input.password,
        })
        .then((data) => {
          console.log('data', data);
        })
        .then((res) => {
          console.log(res);
          alert('가입완료');
        })
        .catch((err) => {
          alert('존재하는 이메일입니다.');
        });
      this.initInput();
    },
    async socialSignUp() {
      console.log('social signup 준비중입니다');
    },
    toggleTab(e) {
      if (e.target.classList.contains('signin')) {
        const $prev = document.querySelector('#nav-tab .signup');
        $prev.classList.remove('click');
        e.target.classList.add('click');
        this.loginTab = true;
      } else {
        const $prev = document.querySelector('#nav-tab .signin');
        $prev.classList.remove('click');
        e.target.classList.add('click');
        this.loginTab = false;
      }
    },
  },
};
//////////////////////////////////////
</script>

<style>
#loginSideWrap {
  width: 485px;
  background-color: #fff;
  height: 100vh;
  position: fixed;
  /* right: 0px; */
  right: -485px;
  top: 0;
  transition: all 0.5s ease 0s;
  padding: 100px 40px;
  z-index: 100;
  /* background: #fff url(../../images/loginSideWrapBg.png) no-repeat 50% 90%; */
}

#toggleBtn {
  outline: none;
  border: none;
  display: block;
  width: 74px;
  height: 148px;
  border-radius: 148px 0 0 148px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -74px;
  margin-left: -74px;

  background-color: #3574b7;
  color: #fff;
  /* z-index: 1; */
  font-size: 2.5em;
  cursor: pointer;
}
#toggleBtn i {
  margin-top: 5px;
}

#loginSideWrap.open #toggleBtn::before {
  content: '';
  display: block;
  width: 95px;
  height: 190px;
  border-radius: 148px 0 0 148px;
  position: absolute;
  left: -21px;
  top: -21px;
  background-color: rgba(53, 116, 183, 0.3);
  z-index: -1;
}

/* [after opening sideBar]  */
#nav-tab {
  display: flex;
  margin-top: 90px;
}

#nav-tab > * {
  width: 50%;
  text-align: center;
  /* border: 1px black solid; */
  padding: 5px;
  cursor: pointer;
}

#nav-tab > *.click {
  background: #3293f531;
}
</style>
