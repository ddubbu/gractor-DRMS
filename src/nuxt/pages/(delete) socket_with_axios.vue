<template>
  <div>
    <input v-model="input" />
    <button @click="submit">제출</button>
  </div>
</template>

<script>
// import * as io from '../../../node_modules/socket.io/dist/socket';
export default {
  mounted() {
    // const socket = io();
    // const socketClient = io('http:192.168.1.91:9001');
    // console.log('io', io);
    // socketClient.on('connect', () => {
    //   console.log('[Clinet side] Connect to server');
    // });
  },
  data() {
    return {
      input: '',
    };
  },
  methods: {
    submit() {
      console.log('input', this.input);
      this.$axios.post('socket', {
        input: this.input,
      });
    },
  },
};


// <template>
//   <div>
//     <input v-model="input" />
//     {{ input }}
//     <button @click="submit">제출</button>
//   </div>
// </template>

// <script>
// import io from 'socket.io-client';

// export default {
//   mounted() {
//     this.socket = io.connect('http://192.168.1.91:9001'); //("http://192.168.1.91:9001");

//     this.socket.on('connect', () => {
//       console.log('connect client ----> server');
//     });

//     this.socket.on('chat', (data) => {
//       console.log('[Client]', data);
//       this.input = data;
//     });
//   },
//   data() {
//     return {
//       input: '',
//       socket: null,
//     };
//   },
//   methods: {
//     submit() {
//       this.socket.emit('chat', { data: input });
//     },
//   },
// };
// </script>

// <style lang="scss" scoped></style>

</script>

<style lang="scss" scoped></style>


