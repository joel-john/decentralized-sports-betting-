import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import getWeb3 from '../contracts/web3';

const gameResultsApi = axios.create({
  baseURL: process.env.VUE_APP_GAME_API || 'http://localhost:7070/api/',
  timeout: 1000,
  headers: {
    accept: 'application/json',
  },
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api0: { },
    api1: { },
    api2: { },
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
      payload.forEach((res, i) => {
        state[`api${i}`] = res;
      });
    },
    bla() {
      console.log('hello');
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
      const responses = await Promise.all([
        gameResultsApi.get('http://localhost:7070/api'),
        gameResultsApi.get('http://localhost:7071/api'),
        gameResultsApi.get('http://localhost:7072/api'),
      ]);
      const games = responses.map((res) => res.data);
      console.log(games);
      commit('setGames', games);
    },
    async setGame({ commit }, { id, result, port }) {
      const api = axios.create({
        baseURL: `http://localhost:${port}/api/`,
        timeout: 1000,
        headers: {
          accept: 'application/json',
        },
      });

      const res = await api.post('', { id, result });
      commit('bla');
      return res;
    },
  },
  modules: {
  },
});
