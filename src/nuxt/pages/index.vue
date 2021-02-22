<template>
  <div id="main-content">
    <section id="input-form">
      <div>
        <label>이름</label>
        <input name="name" :value="name" @input="inputHandler"/>
      </div>
      <div>
        <label>내용</label>
        <input name="message" :value="message" @input="inputHandler"/>
      </div>
      <button @click="submitHandler">저장</button>
    </section>
    <section id="chat-container">
      <article class="chat" v-for="(chat, idx) of chats" :key="idx">
        <div>{{chat.name}}</div>
        <div>{{chat.message}}</div>
        <div class="buttons">
          <button @click="modifyHandler">수정</button>
          <button @click="deleteHandler">삭제</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
  const axios = require('axios');  //! 왜 이렇게 되지....

  export default {
    data() {
      return {
        input: {
          name: '',
          message: ''
        },
        chats: [
          {
            name: '김선미',
            message: '안녕하세요'
          },
          {
            name: '이현규',
            message: '감사합니다'
          }
        ]
      }
    },
    methods: {
      inputHandler(e){
        this.input[e.target.name] = e.target.value;
      },
      async submitHandler() {
        console.log("input", this.input.name, this.input.message)
        axios.post('/api/users', {
          data: {
            ...this.input
          }
        })
        .then(({data})=>{
          console.log("res", data)
        })

      },
      modifyHandler(){},
      deleteHandler(){},
      getChats(){
        axios.get('/api/users')
        .then(({ data })=>{
          console.log("res", data)
        })

      }
    },


  }
</script>

<style>
  #main-content{
    width: 30%;
    /* display: flex; */
    /* flex-direction: column;
    align-content: center; */
    margin: 0 auto;
    background: rgb(255, 210, 210);
    padding: 2em;
  }

  #chat-container{
    /* background: white; */
  }

  .chat {
    background: white;
    margin-top: 5px;
  }
</style>
