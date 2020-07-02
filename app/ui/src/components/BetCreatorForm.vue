<template>
  <div>
    <b-form
      class="mb-2"
      @submit.prevent.stop="onSubmit"
    >
      <b-form-group
        id="input-group-1"
        label="Match id"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.matchId"
          type="number"
          min="0"
          required
          placeholder="21"
        />
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Your bet (in ETH)"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="form.value"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="99.9"
        />
      </b-form-group>
      <b-btn
        type="submit"
        variant="primary"
      >
        Create
      </b-btn>
    </b-form>
    {{ latestTxHash }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BetCreatorForm',
  data() {
    return {
      isTxPending: false,
      latestTxHash: null,
      form: {
        matchId: null,
        value: null,
      },
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
  methods: {
    async onSubmit() {
      this.isTxPending = true;

      const accounts = await this.web3.eth.getAccounts();
      const defaultAccount = accounts[0];

      const parsedMatchId = parseInt(this.form.matchId, 10);
      const parsedValue = this.web3.utils.toWei(this.form.value, 'ether');
      console.log(parsedValue);
      const tx = await this.getBettingContract.methods
        .addBet(1, parsedMatchId)
        .send({ from: defaultAccount, value: parsedValue });

      this.latestTxHash = tx.transactionHash;
      this.isTxPending = false;
    },
  },
};
</script>

<style>

</style>
