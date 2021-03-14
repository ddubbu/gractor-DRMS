<template>
  <div>
    mqtt test
    <p>{{ message }}</p>
    <!-- <img src="@/assets/images/blank_profile.png" /> -->
    <Chat
      v-if="visible"
      :participants="participants"
      :myself="myself"
      :messages="messages"
      :chat-title="chatTitle"
      :placeholder="placeholder"
      :colors="colors"
      :border-style="borderStyle"
      :hide-close-button="hideCloseButton"
      :close-button-icon-size="closeButtonIconSize"
      :submit-icon-size="submitIconSize"
      :submit-image-icon-size="submitImageIconSize"
      :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
      :async-mode="asyncMode"
      :scroll-bottom="scrollBottom"
      :display-header="true"
      :send-images="true"
      :profile-picture-config="profilePictureConfig"
      :timestamp-config="timestampConfig"
      :link-options="linkOptions"
      :accept-image-types="'.png, .jpeg'"
      @onImageClicked="onImageClicked"
      @onImageSelected="onImageSelected"
      @onMessageSubmit="onMessageSubmit"
      @onType="onType"
      @onClose="onClose"
    />
  </div>
</template>

<script>
import mqtt from 'mqtt';
import { Chat } from 'vue-quick-chat';
import 'vue-quick-chat/dist/vue-quick-chat.css';
export default {
  components: {
    Chat,
  },
  destroyed() {
    if (this.client != null) this.client.end();
  },
  data() {
    return {
      client: null, // mqtt object
      message: 'BEFORE',
      isConnect: false,

      //! for chat service
      visible: true,
      participants: [
        {
          name: 'gractor',
          id: 1,

          profilePicture: '/blank_profile.png',
          //'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/NafSadh_Profile.jpg/768px-NafSadh_Profile.jpg',
        },
        {
          name: 'hky',
          id: 2,
          profilePicture: '/blank_profile.png',
          // profilePicture:
          //   'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg',
        },
      ],
      myself: {
        name: 'ksm',
        id: 3,
        profilePicture: '/blank_profile2.png',
        // profilePicture:
        //   'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg',
      },
      messages: [
        {
          content: 'received messages',
          myself: false,
          participantId: 1,
          timestamp: {
            year: 2019,
            month: 3,
            day: 5,
            hour: 20,
            minute: 10,
            second: 3,
            millisecond: 123,
          },
          type: 'text',
        },
        {
          content: 'sent messages',
          myself: true,
          participantId: 3,
          timestamp: {
            year: 2019,
            month: 4,
            day: 5,
            hour: 19,
            minute: 10,
            second: 3,
            millisecond: 123,
          },
          type: 'text',
        },
        {
          content: 'other received messages',
          myself: false,
          participantId: 2,
          timestamp: {
            year: 2019,
            month: 5,
            day: 5,
            hour: 10,
            minute: 10,
            second: 3,
            millisecond: 123,
          },
          type: 'text',
        },
      ],
      chatTitle: 'MQTT chat service',
      placeholder: 'send your message',
      colors: {
        header: {
          bg: '#4267B2', //'#d30303',
          text: '#fff',
        },
        message: {
          myself: {
            bg: '#fff',
            text: 'black',
          },
          others: {
            bg: '#4267B2', //'#fb4141',
            text: '#fff',
          },
          messagesDisplay: {
            bg: '#f7f3f3',
          },
        },
        submitIcon: '#4267B2',
        submitImageIcon: '#4267B2',
      },
      borderStyle: {
        topLeft: '10px',
        topRight: '10px',
        bottomLeft: '10px',
        bottomRight: '10px',
      },
      hideCloseButton: false,
      submitIconSize: 25,
      submitImageIconSize: 24,
      closeButtonIconSize: '20px',
      asyncMode: false,
      toLoad: [
        {
          content: 'Hey, John Doe! How are you today?',
          myself: false,
          participantId: 2,
          timestamp: {
            year: 2011,
            month: 3,
            day: 5,
            hour: 10,
            minute: 10,
            second: 3,
            millisecond: 123,
          },
          uploaded: true,
          viewed: true,
          type: 'text',
        },
        {
          content: "Hey, Adam! I'm feeling really fine this evening.",
          myself: true,
          participantId: 3,
          timestamp: {
            year: 2010,
            month: 0,
            day: 5,
            hour: 19,
            minute: 10,
            second: 3,
            millisecond: 123,
          },
          uploaded: true,
          viewed: true,
          type: 'text',
        },
      ],
      scrollBottom: {
        messageSent: true,
        messageReceived: false,
      },
      displayHeader: true,
      profilePictureConfig: {
        others: true,
        myself: true,
        styles: {
          width: '30px',
          height: '30px',
          borderRadius: '50%',
        },
      },
      timestampConfig: {
        format: 'HH:mm',
        relative: false,
      },
      // there are other options, you can check them here
      // https://soapbox.github.io/linkifyjs/docs/options.html
      linkOptions: {
        myself: {
          className: 'myLinkClass',
          events: {
            click: function (e) {
              alert('Link clicked!');
            },
            mouseover: function (e) {
              alert('Link hovered!');
            },
          },
          format: function (value, type) {
            if (type === 'url' && value.length > 50) {
              value = value.slice(0, 50) + '…';
            }
            return value;
          },
        },
        others: {
          className: 'othersLinkClass',
          events: {
            click: function (e) {
              alert('Link clicked!');
            },
            mouseover: function (e) {
              alert('Link hovered!');
            },
          },
          format: function (value, type) {
            if (type === 'url' && value.length > 50) {
              value = value.slice(0, 50) + '…';
            }
            return value;
          },
        },
      },
    };
  },
  mounted() {
    this.client = mqtt.connect('ws://192.168.1.91:1884');
    console.log('연결중 .....', this.isConnect);

    this.client.on('connect', () => {
      this.client.subscribe('test/1');

      this.isConnect = true;
      console.log('연결완료 .....', this.isConnect);
    });

    this.client.on('message', (topic, message, packet) => {
      console.log('new message: ', message.toString());
      console.log('packet', packet);
      this.message = message.toString();

      //! MQTT data import 하는 부분
      const temp = {
        content: message.toString(), //'sent messages',
        myself: true,
        participantId: 3,
        timestamp: {
          year: 2019,
          month: 4,
          day: 5,
          hour: 19,
          minute: 10,
          second: 3,
          millisecond: 123,
        },
        type: 'text',
      };
      this.pushMessage(temp);
    });
  },
  methods: {
    onType: function (event) {
      //here you can set any behavior
    },
    loadMoreMessages(resolve) {
      setTimeout(() => {
        resolve(this.toLoad); //We end the loading state and add the messages
        //Make sure the loaded messages are also added to our local messages copy or they will be lost
        this.messages.unshift(...this.toLoad);
        this.toLoad = [];
      }, 1000);
    },
    pushMessage: function (message) {
      console.log('message', message);
      this.messages.push(message);
      /*
       * you can update message state after the server response
       */
      // timeout simulating the request
      setTimeout(() => {
        message.uploaded = true;
      }, 2000);
    },

    onMessageSubmit: function (message) {
      /*
       * example simulating an upload callback.
       * It's important to notice that even when your message wasn't send
       * yet to the server you have to add the message into the array
       */

      // this.pushMessage(message);
      this.client.publish('test', message.content);
    },
    onClose() {
      this.visible = false;
    },
    onImageSelected(files, message) {
      let src =
        'https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg';
      console.log('message', message);
      // this.messages.push(message);
      /**
       * This timeout simulates a requisition that uploads the image file to the server.
       * It's up to you implement the request and deal with the response in order to
       * update the message status and the message URL
       */
      setTimeout(
        (res) => {
          message.uploaded = true;
          message.src = res.src;

          console.log('message2', message);
        },
        3000,
        { src }
      );
    },
    onImageClicked(message) {
      /**
       * This is the callback function that is going to be executed when some image is clicked.
       * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
       */
      console.log('Image clicked', message.src);
    },
  },
};
</script>

<style>
.quick-chat-container {
  width: 500px;
  height: 800px;
}

/* .material-design-icon__svg {
  fill: '#4267B2';
} */
</style>
