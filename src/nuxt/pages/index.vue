<template>
  <div id="main-content">
    <section id="input-form">
      <div>
        <label>이름</label>
        <input name="name" v-model="name"/>
      </div>
      <div>
        <label>내용</label>
        <input name="message" v-model="message"/>
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
    getHandler() {
      
    },
    submitHandler(){},
    modifyHandler(){},
    deleteHandler(){}
  },

}
</script>

<style>
  #main-content{
    width: 50%;
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
