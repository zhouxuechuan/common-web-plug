import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login/login';
import Demo from '@/pages/main/demo';
import MapPage from '@/pages/main/map';
import home from '@/pages/home/homePage'; // 首页
import homePage1 from '@/pages/datav/index'; // 首页1
import homePage2 from '@/pages/datav1/index'; // 首页2
import homePage3 from '@/pages/datav2/index'; // 首页3
import NoAuthorityPage from '@/pages/demo1/edit-demo'; // fwb
import Demo1 from '@/components/403.vue'; // 没有权限
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      redirect: { path: '/login' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo
    },
    {
      path: '/map',
      name: 'Map',
      component: MapPage
    },
    {
      path: '/main',
      name: 'main',
      component: Demo,
      children: []
    },
    {
      path: '/home',
      name: 'homePage',
      component: home,
      children: []
    },
    {
      path: '/demo1',
      name: 'demo1',
      component: NoAuthorityPage,
      children: []
    },
    {
      path: '/home1',
      name: 'homePage1',
      component: homePage1,
      children: []
    },
    {
      path: '/home2',
      name: 'homePage2',
      component: homePage2,
      children: []
    },
    {
      path: '/home3',
      name: 'homePage3',
      component: homePage3,
      children: []
    },
    {
      path: '/403',
      name: 'NoAuthority',
      component: NoAuthorityPage
    }
  ]
});
