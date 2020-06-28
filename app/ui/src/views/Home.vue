<template>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div> -->
  <div>
    hello
    <div v-if="web3">
      Betcount:
      {{ betCount }}
      bets:
      <div :key="i" v-for="(betId, i) in bets">
          betId = {{ betId }}
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      betCount: null,
      bets: [],
    };
  },
  computed: {
    ...mapGetters([
      'getBettingContract',
    ]),
    web3() {
      return this.$store.state.web3;
    },
  },
  beforeCreate() {
    console.log(this.web3);
    this.$store.dispatch('registerWeb3');
  },
  async mounted() {
    console.log(this.getBettingContract);
    this.betCount = await this.getBettingContract.methods.betCount().call();
    const betRequests = [...Array(parseInt(this.betCount, 10)).keys()];
    console.log(betRequests);

    const promises = betRequests.map(async (i) => {
      const bet = await this.getBettingContract.methods.iterableBets(i).call();
      return bet;
    });

    const bets = await Promise.all(promises);
    this.bets = bets;
    console.log('done');
    console.log(promises);
  },
  methods: {
    async retrieveBets() {
      const b = await this.betting.methods.betCount().call();
      return b;
    },
  },
};
</script>
