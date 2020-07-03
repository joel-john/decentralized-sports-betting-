import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import getWeb3 from '../contracts/web3';

const gameResultsApi = axios.create({
  baseURL: process.env.VUE_APP_GAME_API || 'http://172.21.8.136:7070/api/',
  timeout: 1000,
  headers: {
    accept: 'application/json',
  },
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    games: null,
    web3: null,
    contracts: {
      betting: null,
      oracle: null,
      link: null,
    },
  },
  getters: {
    getBettingContract: (state) => state.contracts.betting,
    oracle: (state) => state.contracts.oracle,
    link: (state) => state.contracts.link,
    listGames: (state) => state.games,
  },
  mutations: {
    registerWeb3Instance(state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload);
      state.web3 = payload.instance;
      state.contracts.betting = payload.contracts.betting;
      state.contracts.oracle = payload.contracts.oracle;
      state.contracts.link = payload.contracts.link;
    },
    setGames(state, payload) {
      state.games = payload;
    },
  },
  actions: {
    registerWeb3({ commit }) {
      console.log('registerWeb3');
      const instance = getWeb3();
      console.log(instance);
      commit('registerWeb3Instance', instance);
    },
    async loadGames({ commit }) {
      const res = await gameResultsApi.get('');
      const games = res.data;
      console.log(games);
      commit('setGames', games);
    },
  },
  modules: {
  },
});
