'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import MT from 'MT';
import { KEYS } from '../common/constant.js';

Vue.use(Vuex);
let timer = null;
export default new Vuex.Store({
  state: {
    userInfo: {
      userId: '',
      username: ''
    },
    refresh: {},
    refreshQueue: []
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getRefresh(state) {
      return state.refresh;
    }
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = _.assign({}, state.userInfo, info);
    }
  },
  actions: {
    /**
     * 清除用户信息
     * @param commit
     */
    clearUserInfo({ commit }) {
      commit('setUserInfo', {
        userId: '',
        username: '',
        name: '',
        enable: '',
        roleId: '',
        createTime: '',
        groupId: '',
        menus: [],
        menuList: [],
        authorityList: []
      });
    },
    /**
     * 保存用户信息
     * @param commit
     * @param info
     */
    saveUserInfo({ commit }, info) {
      commit('setUserInfo', info);
    },
    /**
     * 刷新
     * @param dispatch
     * @param commit
     * @param state
     * @param data
     */
    emitRefresh({ dispatch, commit, state }, data) {
      data.customrRandom = Math.random();
      state.refreshQueue.push(data); // 加入列队
      if (timer == null && state.refreshQueue.length >= 1) {
        timer = setInterval(() => {
          // 循环执行先进先出，缓冲执行，不然改变 touchRefresh 值太快，只能监听到第一个和最后一个值得修改
          if (state.refreshQueue.length >= 1) {
            state.refresh = state.refreshQueue.shift();
          } else {
            clearInterval(timer);
            timer = null;
          }
        }, 20);
      }
    }
  }
});
