// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Element from 'element-ui';
import vuescroll from 'vuescroll';
// 将自动注册所有组件为全局组件
import DataV from '@jiaminghi/data-view';
import VueQuillEditor from 'vue-quill-editor';
// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import store from './store/index';
import 'leaflet/dist/leaflet.css';
import 'vuescroll/dist/vuescroll.css';
import '@/assets/css/element-variables.scss';
import '@/assets/css/common.scss';

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(VueQuillEditor);
Vue.use(vuescroll);
Vue.use(DataV);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
