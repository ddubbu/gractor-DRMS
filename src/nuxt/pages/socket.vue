<template>
  <div>
    <input v-model="input" />

    <button @click="submit">제출</button>
    <p v-for="item of data">{{ item }}</p>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  mounted() {
    //! 1. socket 연결
    this.socket = io('http://192.168.1.91:9001', {
      transports: ['websocket'],
      upgrade: false,
      reconnection: false,
    });

    this.socket.on('connect', () => {
      console.log('connect client ----> server');
    });

    this.socket.on('chat2', (data) => {
      // console.log('[Client]', data);
      this.data.push(data);
    });

    this.socket.on('disconnect', () => {
      console.log('this.socket', this.socket);
      this.socket.disconnect();
      console.log('client disconnected!!!!');
    });
  },
  data() {
    return {
      input: '',
      socket: null,
      data: [],

      // mqtt 용
      client: null, // mqtt object
      message: 'BEFORE',
      isConnect: false,
    };
  },
  methods: {
    submit() {
      this.data.push(this.input);
      this.socket.emit('chat', { data: this.input });
    },
  },
  componentWillUnmount() {
    this.socket.disconnect();

    this.socket.close(); //.disconnect(true);
    // io.close();
  },
};
</script>

<style lang="scss" scoped></style>
