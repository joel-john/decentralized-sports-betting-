import Vue from 'vue';
import Vuex from 'vuex';
import getWeb3 from '../contracts/web3';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
  },
  mutations: {
    registerWeb3Instance(state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload);
      state.web3 = payload.instance;
      state.contracts.betting = payload.contracts.betting;
      state.contracts.oracle = payload.contracts.oracle;
      state.contracts.link = payload.contracts.link;
    },
  },
  actions: {
    registerWeb3({ commit }) {
      console.log('registerWeb3');
      const instance = getWeb3();
      console.log(instance);
      commit('registerWeb3Instance', instance);
    },
  },
  modules: {
  },
});
