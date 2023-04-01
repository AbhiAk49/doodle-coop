<template>
  <div>
    <v-container class="mx-auto">
      <v-row>
        <v-text-field
          class="mt-5"
          label="Title"
          v-model="doodleTitle"
          placeholder="Enter the title for doodle"
          outlined
        ></v-text-field>
        <v-col align="center">
          <v-sheet color="gray" elevation="3" height="400" width="900">
            <canvas
              ref="mainCanvas"
              @mousemove="drawOnCanvas"
              @mousedown="beginDrawing"
              @mouseup="stopDrawing"
              @mouseleave="disableDrawing"
            >
              <v-img :src="base64ImgData"></v-img>
            </canvas>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-color-picker
            dot-size="20"
            hide-inputs
            hide-mode-switch
            mode="rgba"
            canvas-height="80"
            v-model="strokeColor"
          ></v-color-picker>
        </v-col>
        <v-col>
          <v-slider
            class="ma-2"
            inverse-label
            label="Stroke Size"
            v-model="strokeWidth"
            :thumb-size="24"
            thumb-label="always"
            min="1"
            max="10"
          ></v-slider>
          <v-row align-content="space-between">
            <v-col>
              <v-btn
                elevation="1"
                @click="
                  clearCanvas();
                  sendClear();
                "
                >Clear
              </v-btn>
            </v-col>
            <v-col>
              <v-btn elevation="1" @click="showDialog = true"
                >Exit
                <PopupModalDialog
                  v-if="showDialog"
                  label="Exit Session"
                  @yes="leave"
                  @no="showDialog = false"
                  @close="showDialog = false"
                >
                  Are you sure you want to leave this session?
                </PopupModalDialog>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                elevation="1"
                :loading="savingComplete"
                :disabled="savingComplete"
                @click="saveSession"
                >Save & End
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- </div> -->
    </v-container>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        Session : <strong>{{ sessionId }}</strong>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
import { saveDoodle } from '@/services/doodles';
import PopupModalDialog from '@/components/utils/PopupModalDialog.vue';
import Vue from 'vue';
export default {
  name: 'Canvas',
  components: {
    PopupModalDialog,
  },
  data: () => ({
    doodleTitle: '',
    loader: null,
    savingComplete: false,
    isHost: false,
    showDialog: false,
    canvas: null,
    ctx: null,
    loading: true,
    isDrawing: false,
    coords: {
      x: 0,
      y: 0,
    },
    sessionId: '',
    strokeColor: '#000000',
    strokeWidth: 1,
    base64ImgData: '',
    isCanvasCleared: true,
    //updateImg: Image
  }),
  sockets: {
    connect() {
      //console.log(`connected to socket`);
      this.$socket.client.emit('subscribe', this.sessionId, this.userEmail);
      this.sendToSocket();
      this.loading = false;
    },
  },
  computed: {
    userEmail() {
      return this.$store.state.auth.email;
    },
    token() {
      return this.$store.state.auth.token;
    },
  },
  methods: {
    newUserJoined(user) {
      if (user.email !== this.userEmail) {
        this.sendToSocket();
        Vue.$toast.success(`${user.name} joined`, {
          timeout: 5000,
        });
      }
    },
    userLeft(user) {
      Vue.$toast.error(`${user.name} left`, { timeout: 3000 });
    },
    showCoordinates(e) {
      this.coords.x = e.offsetX;
      this.coords.y = e.offsetY;
    },
    drawLine(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.strokeWidth;
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    drawOnCanvas(e) {
      if (this.isDrawing) {
        this.drawLine(this.coords.x, this.coords.y, e.offsetX, e.offsetY);
        this.coords.x = e.offsetX;
        this.coords.y = e.offsetY;
      }
    },
    beginDrawing(e) {
      this.coords.x = e.offsetX;
      this.coords.y = e.offsetY;
      this.isDrawing = true;
      setTimeout(this.sendToSocket, 1000);
    },
    stopDrawing(e) {
      if (this.isDrawing) {
        this.drawLine(this.coords.x, this.coords.y, e.offsetX, e.offsetY);
        this.coords.x = 0;
        this.coords.y = 0;
        this.isDrawing = false;
        this.sendToSocket();
        this.isCanvasCleared = false;
      }
    },
    disableDrawing() {
      this.isDrawing = false;
    },
    sendToSocket() {
      this.base64ImgData = this.canvas.toDataURL('image/png');
      this.$socket.client.emit(
        'canvas-data',
        this.sessionId,
        this.base64ImgData
      );
    },
    updateCanvas(img, context) {
      context.ctx.drawImage(img, 0, 0);
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, 900, 400);
      // if(!this.isCanvasCleared){
      //     this.sendClear();
      // }
    },
    sendClear() {
      this.$socket.client.emit('canvas-clear', this.sessionId);
      //this.isCanvasCleared=true;
    },
    exitEvent() {
      this.$socket.client.emit('leave', this.sessionId, this.userEmail);
    },
    leave() {
      localStorage.setItem('exit', true);
      this.exitEvent();
      this.$router.push({ name: 'home' }).catch(() => {});
    },
    saveSession() {
      this.savingComplete = true;
      this.base64ImgData = this.canvas.toDataURL('image/png');
      let doodleDetails = {
        title: this.doodleTitle,
        sessionId: this.sessionId,
        base64: this.base64ImgData,
      };
      saveDoodle(this.token, doodleDetails).then(() => {
        this.$socket.client.emit('terminate-session', this.sessionId);
        this.savingComplete = false;
        this.leave();
      });
    },
    // onResize (){
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    // }
  },
  mounted() {
    this.sessionId = this.$route.params.sessionId;
    this.canvas = this.$refs['mainCanvas'];
    this.ctx = this.canvas.getContext('2d');
    this.canvas.height = 400;
    this.canvas.width = 900;
    if (localStorage.getItem('reloaded')) {
      // The page was just reloaded. Clear the value from local storage
      // so that it will reload the next time this page is visited.
      localStorage.removeItem('reloaded');
    } else {
      // Set a flag so that we know not to reload the page twice.
      localStorage.setItem('reloaded', '1');
      this.$router.go();
    }
  },
  created() {
    localStorage.removeItem('exit');
    // const connectionOptions =  {
    // "timeout" : 10000,
    // "transports" : ["websocket"]
    // };
    // this.socket = io('http://localhost:3000', connectionOptions);
    this.$socket.$subscribe('user-join', (room, foundUser) => {
      if (room === this.sessionId) {
        this.newUserJoined(foundUser);
      }
    });
    this.$socket.$subscribe('user-left', (room, user) => {
      if (room === this.sessionId) {
        if (user) {
          this.userLeft(user);
        }
      }
    });
    this.$socket.$subscribe('canvas-data', (room, data) => {
      if (room === this.sessionId) {
        const self = this;
        let updateImg = new Image();
        updateImg.src = data;
        updateImg.onload = () => {
          this.updateCanvas(updateImg, self);
        };
      }
    });

    this.$socket.$subscribe('canvas-clear', (room) => {
      if (room === this.sessionId) this.clearCanvas();
    });
    this.$socket.$subscribe('terminate-session', (room) => {
      if (room === this.sessionId) {
        setTimeout(() => {
          this.leave();
        }, 5000);
      }
    });
  },
};
</script>

<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
