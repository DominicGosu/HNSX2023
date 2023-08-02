import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false
Vue.filter('htmlEscape', function(value) {
  return value.replace(/amp;/g, '&');
});
Vue.filter('dateTime', function(val) {
  return new Date(val).toGMTString().slice(0, -13);
});
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
Vue.use(VueGoodTablePlugin);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
