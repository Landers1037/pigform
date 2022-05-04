import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "@/views/Home";
import panel from "@/views/Panel";
import setting from "@/views/Setting";
import settingPage from "@/views/SettingPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: home
  },
  {
    path: '/panel',
    name: 'panel',
    component: panel
  },
  {
    path: '/setting',
    name: 'setting',
    component: setting
  },
  {
    path: '/settingpage',
    name: 'settingpage',
    component: settingPage
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
