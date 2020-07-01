<template>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div> -->
  <b-container fluid="lg">
    <b-row>
      <b-col>
        <div class="text-center mb-5">
          <h1>
            Decentralized Sports betting
          </h1>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div v-if="web3">
          <h2 class="subheader">
            Bets
          </h2>
          Currently {{ betCount }} open bets.
          <b-card
            v-for="(bet, i) in bets"
            :key="i"
            title="Bet"
            class="my-4"
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
            <b-button
              variant="primary"
              @click="confirmBet(bet.betId)"
            >
              Join
            </b-button>
            <b-button
              class="ml-1"
              variant="primary"
              @click="requestBetResult(bet.betId)"
            >
              Update
            </b-button>
          </b-card>

          <b-btn @click="addBet">
            Add a bet
          </b-btn>
        </div>
      </b-col>
      <b-col>
        <h2 class="subheader">
          Create new bet
        </h2>
        <BetCreatorForm />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';
import BetCreatorForm from '@/components/BetCreatorForm.vue';

export default {
  name: 'Home',
  components: {
    BetCreatorForm,
  },
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
