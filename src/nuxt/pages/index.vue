<template>
  <div>
    <div id="modify-modal-wrapper">
      <div id="modify-modal">
        <div>수정하기</div>
        <div>
          <label>이름</label>
          <input name="name" :value="input_modal.name" @input="inputHandler($event, 'input_modal')" />
        </div>
        <div>
          <label>내용</label>
          <input name="message" :value="input_modal.message" @input="inputHandler($event, 'input_modal')" />
        </div>
        <button @click="modifyHandler">저장</button>
        <button @click="toggleModal">취소</button>
      </div>
    </div>

    <div id="main-content">
      <section id="input-form">
        <div>
          <label>이름</label>
          <input name="name" :value="input.name" @input="inputHandler($event, 'input')" />
        </div>
        <div>
          <label>내용</label>
          <input name="message" :value="input.message" @input="inputHandler($event, 'input')" />
        </div>
        <button @click="submitHandler">저장</button>
        <div>Total: {{total}}</div>
      </section>
      <section id="chat-container">
        <article class="chat" v-for="(chat, idx) of chats" :key="chat.name + chat.id">
          <div>name: {{ chat.name }}</div>
          <div>message: {{ chat.message }}</div>
          <div>password: {{ chat.password }}</div>
          <div class="buttons">
            <button @click="toggleModal($event, chat.id, idx)">수정</button>
            <button @click="deleteHandler($event, chat.id)">삭제</button>
          </div>
        </article>
      </section>
      <NuxtLink to="/chart"><button>chart</button></NuxtLink>
    </div>
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
      input_modal: {
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
      event: {
        list_id: "",
        db_id: ""
      },
    };
  },

  mounted() { 
    this.getChats();

  },
  methods: {
    inputHandler(e, object) {
      this[object][e.target.name] = e.target.value;
    },
    async submitHandler() {
      console.log("input", this.input.name, this.input.message);
      this.$axios
      .$post("/api/users", 
        this.input
      )
      .then( data=> {
        // chat 추가
        this.chats.push({
          id: data.id,
          name: this.input.name,
          message: this.input.message
        })

        // input 초기화
        this.input.name = "";
        this.input.message = "";
      });
    },
    modifyHandler(e){
      const {db_id, list_id} = this.event;
      console.log("update", db_id, list_id);

      // db 업데이트 
      this.$axios.$put('/api/users', {
        id: db_id,
        payload: this.input_modal
      })

      // state 업데이트
      this.chats = {
        ...this.chats,
        [list_id] : this.input_modal
      }

      this.toggleModal();
    },
    toggleModal(e, db_id, list_id) {
      const $modal = document.querySelector('#modify-modal-wrapper');
      $modal.style.display = $modal.style.display === "block" ? 'none' : "block";

      const $inputs = document.querySelectorAll('#modify-modal input');
      if(list_id !== undefined){ //열때는 아이디 넘김. 
        this.input_modal = {
          name : this.chats[list_id].name,
          message : this.chats[list_id].message  
        }

        this.event = {
          db_id,
          list_id
        }
      }

    },
    deleteHandler(e, id) {
      this.$axios
      .$delete("api/users", { params : { id } })
      .then(res=>{
        // chats 갱신 
        this.getChats();
        // setTimeout(this.getChats, 1000);
      })

    },
    async getChats() {
      await this.$axios.$get(`/api/users`,{ params: { size: 100 }}).then(({rows, total})=> {
        console.log("total rows :", total)
        this.chats = [... rows.map(row=>{ 
          return {
            id: row._id, 
            ...row._source
          }
        })]
        // this.total = this.chats.length;
      });
    },
  },
  computed: {
    total(){
      return this.chats.length;
    }
  },
};
</script>

<style>
  #main-content {
    width: 30%;
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

  #modify-modal {
    background: white;
    width: 500px;
    margin: 100px auto;
    padding: 20px;
  }

  #modify-modal-wrapper {
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    background: rgba(0, 0, 0, 0.766);
  }
</style>
