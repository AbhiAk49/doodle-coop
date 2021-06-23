import Vue from 'vue';
import Router from 'vue-router';
import Vuelidate from 'vuelidate';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vue2TouchEvents);
Vue.config.productionTip = false;
Vue.use( Router );
Vue.use( Vuelidate );
Vue.use( Toast );
