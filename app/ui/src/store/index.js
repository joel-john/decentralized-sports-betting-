import Vue from 'vue';
import Vuex from 'vuex';
import getWeb3 from '../contracts/web3';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    web3: null,
    contracts: {
      betting: null,
    },
  },
  getters: {
    getBettingContract: (state) => state.contracts.betting,
  },
  mutations: {
    registerWeb3Instance(state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload);
      state.web3 = payload.instance;
      state.contracts.betting = payload.contracts.betting;
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
