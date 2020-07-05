<template>
  <b-container fluid="lg">
    <b-row class="">
      <b-col>
        <div class="content-box content-box--variant-2 my-4">
          <h1>
            Admin things
          </h1>
          <small>This is not part of the user experience</small>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="content-box content-box--variant-2">
          <h2>
            Submit game result
          </h2>
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
                id="input-group-3"
                label="Winning team"
                label-for="input-3"
              >
                <b-form-select
                  v-model="form.team"
                  :options="options"
                  value="1"
                />
              </b-form-group>
              <b-btn
                class="mr-1"
                variant="info"
                @click="sendRequest(7070)"
              >
                Send to API 1
              </b-btn>
              <b-btn
                class="mr-1"
                variant="info"
                @click="sendRequest(7071)"
              >
                Send to API 2
              </b-btn>
              <b-btn
                class="mr-1"
                variant="warning"
                @click="sendRequest(7072)"
              >
                Send to API 3
              </b-btn>
            </b-form>
          </div>
        </div>
      </b-col>
      <b-col>
        <div class="content-box content-box--variant-2">
          hi
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'BetCreatorForm',
  data() {
    return {
      form: {
        matchId: null,
        team: 1,
      },
      options: [
        { value: 1, text: 'Home' },
        { value: 2, text: 'Guest' },
      ],
    };
  },
  methods: {
    async sendRequest(port) {
      const res = await this.$store.dispatch('setGame', { id: this.form.matchId, result: this.form.team, port });
      console.log(res.data);
    },
  },
};
</script>
