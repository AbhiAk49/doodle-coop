<template> 
    <div>
        <v-container class="mx-auto">
            <!-- <v-row v-if="loading"
            class="fill-height"
            align-content="center"
            justify="center"
            >
                <v-col class="ma-0 pa-0">
                    <v-progress-linear
                        color="deep-purple accent-4"
                        indeterminate
                        rounded
                        height="6"
                    ></v-progress-linear>
                </v-col>
            </v-row>
            <div v-else> -->
            <v-row>
                <v-col align = "center">
                    <v-sheet
                        color="gray"
                        elevation="3"
                        height="400"
                        width="900"
                    >
                        <canvas ref="mainCanvas" @mousemove="drawOnCanvas"  
                        @mousedown="beginDrawing" 
                        @mouseup="stopDrawing"  @mouseleave="disableDrawing"
                        >
                            <v-img :src = base64ImgData ></v-img>
                        </canvas>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row >
                <v-col>
                    <v-color-picker
                        dot-size="20"
                        hide-inputs
                        hide-mode-switch
                        mode="rgba"
                        canvas-height=80
                        v-model="strokeColor"
                    ></v-color-picker>
                </v-col>
                <v-col>
                    <v-slider class="ma-2"
                        inverse-label
                        label="Stroke Size"
                        v-model="strokeWidth"
                        :thumb-size="24"
                        thumb-label="always"
                        min=1
                        max=10
                    ></v-slider>
                    <v-row align-content = "space-between">
                        <v-col align-self="start">
                            <v-btn
                            elevation="1"
                            @click="clearCanvas(); sendClear()"
                            >Clear
                            </v-btn>
                        </v-col>
                        <v-col  align-self="end">
                            <v-btn
                            elevation="1"
                            @click="leave()"
                            >Exit
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <!-- </div> -->
        </v-container>
            <v-footer padless>
            <v-col
            class="text-center"
            cols="12"
            >
            Session : <strong>{{sessionId}}</strong>
            </v-col>
        </v-footer>
    </div>
</template>

<script>
import Vue from 'vue';
import io from 'socket.io-client';
export default {
    name: 'Canvas',
    data:() => ({
        canvas:null,
        ctx:null,
        loading:true,
        isDrawing:false,
        coords:{
            x:0,
            y:0
        },
        sessionId:'Test',
        strokeColor:'#000000',
        strokeWidth:1,
        base64ImgData:'',
        socket:{},
        isCanvasCleared:true
        //updateImg: Image
    }),
    computed: {
              userEmail(){
            return this.$store.state.auth.email;
        }
    },
    methods: {
        newUserJoined(user){
            if(user.email !== this.userEmail){
                this.sendToSocket();
                Vue.$toast.success(
                        `${user.name} joined`,
                      {
                          timeout:5000
                      });
            }

        },
        userLeft(user){
            Vue.$toast.error(
                    `${user.name} left`,
                    { timeout : 3000}
            );

        },
        showCoordinates(e) {
            this.coords.x = e.offsetX;
            this.coords.y = e.offsetY;
        },
        drawLine(x1, y1, x2, y2) {
            this.ctx.beginPath();
            this.ctx.lineJoin="round";
            this.ctx.lineCap="round";
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();  
            this.ctx.closePath();
        },
        drawOnCanvas(e) {
            if(this.isDrawing) {
                this.drawLine(this.coords.x, this.coords.y, e.offsetX, e.offsetY);
                this.coords.x = e.offsetX;
                this.coords.y = e.offsetY;
            }
        },
        beginDrawing(e) {
            this.coords.x = e.offsetX;
            this.coords.y = e.offsetY;
            this.isDrawing = true;
            setTimeout(this.sendToSocket,1000);
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
        disableDrawing(){
            this.isDrawing = false;
        },
        sendToSocket(){
                this.base64ImgData  = this.canvas.toDataURL("image/png");
                this.socket.emit("canvas-data",this.base64ImgData);
        },
        updateCanvas(img,context){
            context.ctx.drawImage(img,0,0);
        },
        clearCanvas(){
                this.ctx.clearRect(0, 0, 900, 400);
                // if(!this.isCanvasCleared){
                //     this.sendClear();
                // }
        },
        sendClear(){
            this.socket.emit("canvas-clear");
            //this.isCanvasCleared=true;
        },
        leave(){
            this.socket.emit("leave",this.userEmail);
            this.$router.push({name: 'home'})
        }
        // onResize (){
        //     canvas.width = window.innerWidth;
        //     canvas.height = window.innerHeight;
        // }
    },
   mounted() {
    this.canvas = this.$refs["mainCanvas"];
    this.ctx = this.canvas.getContext("2d");  

    // window.addEventListener('resize', onResize, false);
    // onResize();
    // this.canvas.height = window.innerHeight;
    // this.canvas.width = window.innerWidth;
    this.canvas.height = 400;
    this.canvas.width = 900;
    },
    created(){
    const connectionOptions =  {
    // "force new connection" : true,
    // "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
    };
    this.socket = io('http://localhost:3000', connectionOptions);
    this.socket.emit("joinSession",this.sessionId,this.userEmail);
    this.socket.on('user-join',(foundUser)=>{
        if(foundUser){
            this.newUserJoined(foundUser);
        }
    });
    this.socket.on('user-left',(user)=>{
        if(user){
            this.userLeft(user);
        }
    })
    this.socket.on("sync-data",(data)=>{
            //console.log('Synching');
            const self = this;
            let updateImg = new Image();
            updateImg.src = data;
            //console.log(data);
            updateImg.onload = () => {
            this.updateCanvas(updateImg,self);
            }
        });
    this.socket.on("canvas-data",(data)=>{
            const self = this;
            let updateImg = new Image();
            updateImg.src = data;
            updateImg.onload = () => {
            this.updateCanvas(updateImg,self);
        }
    });
       this.socket.on("canvas-clear",()=>{
        this.clearCanvas();
    });
    }
};
</script>

<style scoped>
</style>