<template>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div> -->
  <b-container>
    hello
    <div v-if="web3">
      Betcount:
      {{ betCount }}
      bets:
      <b-card
        title="Bet"
        class="my-4"
        :key="i"
        v-for="(bet, i) in bets"
        style="max-width: 20rem;"
      >
        <b-card-text>
          <div>
            betId = {{ bet.betId }}
          </div>
          <div>
            matchId = {{ bet.matchId }}
          </div>
          <div>
            winningTeam = {{ bet.winningTeam }}
          </div>
          <div>
            playerA = {{ bet.playerA.substring(0, 8) }}
          </div>
          <div>
            playerB = {{ bet.playerB.substring(0, 8) }}
          </div>
          <div>
            amount = {{ bet.amount }}
          </div>
        </b-card-text>
        <b-button @click="confirmBet(bet.betId)" variant="primary">Join</b-button>
        <b-button
          class="ml-1"
          @click="requestBetResult(bet.betId,)"
          variant="primary"
        >
          Update
        </b-button>
      </b-card>

      <b-btn @click="addBet">
        Add a bet
      </b-btn>
    </div>
  </b-container>
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
      'oracle',
      'link',
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
    console.log(`hello ${this.oracle.options.address}`);
    this.betCount = await this.getBettingContract.methods.betCount().call();
    console.log(this.betCount);
    const betRequests = !this.betCount
      ? []
      : [...Array(parseInt(this.betCount, 10)).keys()];
    console.log(betRequests);

    const promises = betRequests.map(async (i) => {
      const betId = await this.getBettingContract.methods.iterableBets(i).call();
      const bet = await this.getBettingContract.methods.bet(betId).call();
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
    async addBet() {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];
      const value = this.web3.utils.toWei('2', 'ether');
      this.getBettingContract.methods.addBet(1, 12).send({ from: defaultAccount, value });
    },
    async confirmBet(betId) {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];
      const value = this.web3.utils.toWei('2', 'ether');
      this.getBettingContract.methods.confirmBet(betId, 2).send({ from: defaultAccount, value });
    },
    async requestBetResult(betId) {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];
      const oracleAddress = this.oracle.options.address;

      console.log(`oracleAddress = ${oracleAddress}`);

      const tx = await this.getBettingContract
        .methods
        .requestBetResult(betId, oracleAddress, '1000000000000000000')
        .send({ from: defaultAccount });

      console.log(`txhash = ${tx.transactionHash}`);
    },
  },
};
</script>
