<template>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div> -->
  <b-container fluid="lg">
    <b-row class="">
      <b-col>
        <div class="content-box text-center py-5 my-4">
          <h1>
            Decentralized Sports betting
          </h1>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <div
          class="content-box content-box--variant-1"
        >
          <h2 class="subheader">
            Bets
          </h2>
          <div v-if="web3 && bets">
            Currently {{ betCount }} open bets.
            <b-card
              v-for="(bet, i) in bets"
              :key="i"
              class="my-4"
            >
              <b-card-title>
                <span :class="{ 'selected': !bet.isPlayerABettingOnHome }">
                  Foo
                </span>
                vs.
                <span :class="{ 'selected': bet.isPlayerABettingOnHome }">
                  Bar
                </span>
              </b-card-title>
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
                <div>
                  state = {{ bet.matchStatus }}
                </div>
              </b-card-text>
              <b-button
                variant="primary"
                @click="confirmBet(bet.betId, bet.amount)"
              >
                Join
              </b-button>
              <b-button
                class="ml-1"
                variant="primary"
                @click="requestBetResult(bet.betId, bet.matchId)"
              >
                Update
              </b-button>
              <b-button
                v-if="bet.winningTeam !== '0'"
                class="ml-1"
                variant="success"
                @click="fulfill(bet.betId)"
              >
                Finalize
              </b-button>
            </b-card>
          </div>
          <div v-else>
            Cannot connect to blockchain. Do you have Metamask installed?
          </div>
        </div>
      </b-col>
      <b-col md="6">
        <div class="content-box content-box--variant-2">
          <h2 class="subheader">
            Create new bet
          </h2>
          <BetCreatorForm />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';
import BetCreatorForm from '@/components/BetCreatorForm.vue';
import saId from '@/contracts/saId.json';

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
    this.$store.dispatch('loadGames');
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
    async confirmBet(betId, amount) {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];
      const value = this.web3.utils.toWei(amount, 'wei');
      this.getBettingContract.methods.confirmBet(betId).send({ from: defaultAccount, value });
    },
    async requestBetResult(betId, matchId) {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];

      const oracle = this.oracle.options.address;
      const jobId = saId.saId;
      console.log(jobId);
      const payment = '3000000000000000000';
      const url = 'http://game-result-api:7070/api';
      console.log(`matchid = ${matchId}`);
      const path = `${matchId}.result`;
      const times = 1;

      console.log(`oracleAddress = ${oracle}`);

      const tx = await this.getBettingContract
        .methods
        .requestBetResult(betId, oracle, jobId, payment, url, path, times)
        .send({ from: defaultAccount });

      console.log(`txhash = ${tx.transactionHash}`);
    },
    async fulfill(betId) {
      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];
      this.getBettingContract.methods.fulfill(betId).send({ from: defaultAccount });
    },
  },
};
</script>

<style lang="scss" scoped>
  .selected {
    border-radius: 0.5rem;
    background-color: var(--light);
    border: 2px solid var(--info);
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 10px;
  }
</style>
