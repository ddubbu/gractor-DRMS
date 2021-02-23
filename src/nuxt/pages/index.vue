<template>
  <div>
    <div id="modify-modal-wrapper">
      <div id="modify-modal">
        <div>수정하기</div>
        <div>
          <label>이름</label>
          <input name="name" :value="input.name" @input="inputHandler" />
        </div>
        <div>
          <label>내용</label>
          <input name="message" :value="input.message" @input="inputHandler" />
        </div>
        <button @click="modifyHandler">저장</button>
        <button @click="toggleModal">취소</button>
      </div>
    </div>

    <div id="main-content">
      <section id="input-form">
        <div>
          <label>이름</label>
          <input name="name" :value="input.name" @input="inputHandler" />
        </div>
        <div>
          <label>내용</label>
          <input name="message" :value="input.message" @input="inputHandler" />
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
    };
  },

  mounted() { 
    this.getChats();

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

        // input 초기화
        this.input.name = "";
        this.input.message = "";
      });
    },
    modifyHandler(e, db_id, list_id){
      console.log("this.input", this.input);
    },
    toggleModal(e, db_id, list_id) {
      console.log("수정")
      const $modal = document.querySelector('#modify-modal-wrapper');
      $modal.style.display = $modal.style.display === "block" ? 'none' : "block";

      const $inputs = document.querySelectorAll('#modify-modal input');
      if(list_id){ //열때는 아이디 넘김. 
        console.log("this.chats[list_id]", this.chats[list_id])
        $inputs[0].value = this.chats[list_id].name || "";
        $inputs[1].value = this.chats[list_id].message || "";
      }

      console.log("$name", $inputs[0]);
    },
    deleteHandler(e, id) {
      console.log("id", id)

      this.$axios
      .$delete("api/users", { params : { id } })
      .then(res=>{
        console.log("DELETE response", res);
              // chats 갱신 
        console.log("after delte------------------")
        // this.getChats();
        setTimeout(this.getChats, 600);
      })

    },
    async getChats() {
      
      await this.$axios.$get(`/api/users`,{ params: { size: 100 }}).then(({rows, total})=> {
        console.log("total rows :", total)

        console.log("[BEFORE]", this.chats);
        this.chats = [... rows.map(row=>{ 
          // if(!row._source.password) {
            return {
              id: row._id, 
              ...row._source
            }
          // } else{
          //   return undefined; //없으면 출력안되니깐
          // }
        })]
        this.total = this.chats.length;

        console.log("[AFTER]", this.chats);
      });
    },
  },
  computed: {
    total(){
      return this.chats.length;
    }
  },
  // watch: {
  //   chats:{
  //     deep: true,
  //     handler(){
  //       console.log("is change?");
  //       console.log("this.chats", this.chats)
  //     }
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
