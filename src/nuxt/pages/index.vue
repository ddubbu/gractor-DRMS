<template>
  <div id="main-content">
    <section id="input-form">
      <div>
        <label>이름</label>
        <input name="name" :value="name" @input="inputHandler" />
      </div>
      <div>
        <label>내용</label>
        <input name="message" :value="message" @input="inputHandler" />
      </div>
      <button @click="submitHandler">저장</button>
      <div>Total: {{total}}</div>
    </section>
    <section id="chat-container">
      <article class="chat" v-for="(chat, idx) of chats" :key="idx">
        <div>{{ chat.name }}</div>
        <div>{{ chat.message }}</div>
        <div class="buttons">
          <button @click="modifyHandler">수정</button>
          <button @click="deleteHandler">삭제</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: {
        name: "",
        message: "",
      },
      chats: [ // FAKE DATA
        // {
        //   name: "김선미",
        //   message: "안녕하세요",
        // },
        // {
        //   name: "이현규",
        //   message: "감사합니다",
        // },
      ],
      // total: 0, // <-- watch 옵션이랑 같이 해도되
    };
  },

  mounted() {
    // console.info(this.$axios.$get, { params: { size: 20 }}) //! module import 완료 
    this.$axios.$get(`/api/users`,{ params: { size: 30 }}).then(({rows, total})=> {
      console.log("total rows :", total)
      console.log("res", rows[0]._source);

      // 모든 데이터 저장 완료 
      this.chats = rows.map(row=>row._source);
      this.total = this.chats.length;
      // console.log("this.chats", this.chats)
    });
  },
  methods: {
    inputHandler(e) {
      this.input[e.target.name] = e.target.value;
    },
    async submitHandler() {
      console.log("input", this.input.name, this.input.message);
      this.$axios
      .$post("/api/users", 
        this.input
      )
      .then( data=> {
        console.log("res", data);
        // chat 추가
        this.chats.push({
          id: data.id,
          name: this.input.name,
          message: this.input.message
        })
      });
    },
    modifyHandler() {},
    deleteHandler() {},
    // getChats() {
    // this.$axios.$get("/api/users").then(data=> {
    //   console.log("res", data);
    // });
    // },
  },
  computed: {
    total(){
      return this.chats.length;
    }
  }

  // watch: {
  //   chats(){ // total 개수 증가 시키기
  //     console.log("here")
  //     this.total = this.chats.length
  //     // return this.chats.length
  //   }
  // }
};
</script>

<style>
  #main-content {
    width: 30%;
    /* display: flex; */
    /* flex-direction: column;
      align-content: center; */
    margin: 0 auto;
    background: rgb(255, 210, 210);
    padding: 2em;
  }

  #chat-container {
    /* background: white; */
  }

  .chat {
    background: white;
    margin-top: 5px;
  }
</style>
