<template>
  <div>
    <CreateNewBoardModal
      v-if="showCreateNewBoardModal"
      :toggleCreateNewBoardModal="toggleCreateNewBoardModal"
    >
    </CreateNewBoardModal>
    <div>
      <navBar sidebar_type="manual" />

      <div class="mainContainer">
        <div class="mainSidebar">
          <div class="sticky">
            <!-- <Profile :userInfo="userInfo" /> -->
            <div class="createBoardButtonDiv">
              <button
                class="createNewBoardButton"
                @click="toggleCreateNewBoardModal"
              >
                New Board ✚
              </button>
            </div>
          </div>
        </div>
        <!-- 위에 없애기 -->
        <div class="mainBody">
          <div class="myBoard">
            <h3>My Board</h3>
            <div class="myBoardListContainer">
              <div class="myBoardList">
                <BoardThumNail
                  v-for="(el, i) of boardList.slice(0, numberOfBoardThumbNails)"
                  :key="i"
                  :board="el"
                ></BoardThumNail>
              </div>
              <button
                v-if="boardList.length > 4"
                class="mainButton"
                @click="
                  () => {
                    boardThumNailShowMore = !boardThumNailShowMore;
                    toggleShowMore();
                  }
                "
              >
                {{ boardThumNailShowMore ? 'Show Less' : 'Show More' }}
              </button>
            </div>
          </div>
          <!-- <div class="myTask">
        <h3>Task</h3>
        <div class="myTaskListContainer">
          <div class="myTaskList">
            <TaskThumNail
              v-for="(el, i) of taskList.slice(0, numberOfTaskThumbNails)"
              :key="i"
              :task="el"
            >
            </TaskThumNail>
            <button
              v-if="taskList.length > 4"
              class="mainButton"
              @click="
                () => {
                  taskThumbNailShowMore = !taskThumbNailShowMore;
                  toggleShowMore();
                }
              "
            >
              {{ taskThumbNailShowMore ? 'Show Less' : 'Show More' }}
            </button>
          </div>
        </div>
      </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '../components/navbar';
import BoardThumNail from '../components/BoardThumNail';
import CreateNewBoardModal from '../components/modal/createNewBoardModal';
export default {
  components: {
    navBar,
    BoardThumNail,
    CreateNewBoardModal,
  },
  created() {
    // console.log('this.===============', this.$store.state.userInfo);

    if (!this.$store.state.userInfo.id === '') {
      alert('로그인이 필요합니다');
      this.$router.push('/main');
    }

    this.$axios
      .$get('/api/dashboard_list', {
        params: {
          user_id: this.$store.state.userInfo.id,
        },
      })
      .then(({ rows, user_id }) => {
        console.log('=================boardList=============\n', rows);
        this.boardList = rows.map((el) => {
          return {
            id: el._id,
            title: el._source.title,
          };
        });

        //! login 갱신
        console.log('user_id', user_id);
        if (user_id && !this.$store.state.isLogin) {
          this.$store.commit('toggleLogin', { data: { user_id } });
        }
      })
      .catch((e) => {
        alert('로그인이 필요한 작업입니다.');
        this.$router.push('/main');
      });
  },
  data() {
    return {
      boardThumNailShowMore: false,
      taskThumbNailShowMore: false,
      showCreateNewBoardModal: false,
      boardList: [
        // { id: 1, title: 'board' },
        // { id: 2, title: 'board2' },
        // { id: 3, title: 'board3' },
        // { id: 4, title: 'board4' },
        // { id: 4, title: 'board4' },
        // { id: 4, title: 'board4' },
        // { id: 4, title: 'board4' },
      ],
      taskList: [
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
        {
          id: 1,
          title: 'Task1',
          boardId: 1,
          boardTitle: 'board1',
          description: '내용입니다',
        },
      ],
      userInfo: {
        userId: 1,
        userName: '김선미',
        userEmail: '11@gmail.com',
      },
      numberOfBoardThumbNails: 8,
      numberOfTaskThumbNails: 5,
    };
  },
  methods: {
    toggleCreateNewBoardModal() {
      this.showCreateNewBoardModal = !this.showCreateNewBoardModal;
    },
    toggleShowMore() {
      this.numberOfBoardThumbNails = this.boardThumNailShowMore
        ? this.boardList.length
        : 4;
      this.numberOfTaskThumbNails = this.taskThumbNailShowMore
        ? this.taskList.length
        : 5;
    },
  },
};
</script>

<style>
@import '~/assets/styles/hurb.css';
</style>
