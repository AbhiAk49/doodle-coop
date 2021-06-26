import Vue from 'vue';
import Router from 'vue-router';
import Vuelidate from 'vuelidate';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Vue2TouchEvents from 'vue2-touch-events';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
const options = { "timeout" : 10000,"transports" : ["websocket"] };
const SocketInstance = io('http://localhost:3000', options);

Vue.use(VueSocketIOExt, SocketInstance);
Vue.use(Vue2TouchEvents);
Vue.config.productionTip = false;
Vue.use( Router );
Vue.use( Vuelidate );
Vue.use( Toast );
