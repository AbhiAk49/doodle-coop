import Vue from 'vue';
import Router from 'vue-router';
import Vuelidate from 'vuelidate';
import Toast from "vue-toastification";
import PortalVue from 'portal-vue'
import "vue-toastification/dist/index.css";
import Vue2TouchEvents from 'vue2-touch-events';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
const options = { "timeout" : 10000,"transports" : ["websocket"] };
const NODE_ENV = process.env.NODE_ENV ;
let socketString = '';
if(NODE_ENV === 'development'){
    socketString = 'http://localhost:3000'
}
else{
    socketString = 'https://doodle-coop.herokuapp.com/'
}
const SocketInstance = io(socketString, options);
Vue.use(PortalVue);
Vue.use(VueSocketIOExt, SocketInstance);
Vue.use(Vue2TouchEvents);
Vue.config.productionTip = false;
Vue.use( Router );
Vue.use( Vuelidate );
Vue.use( Toast );
