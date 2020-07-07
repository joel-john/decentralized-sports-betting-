<template>
  <div>
    <b-container>
      <div v-if="!games || Object.keys(games).length === 0">
        If you see this, you've messed up
      </div>
      <b-row
        v-for="(game, i) of games"
        :key="`game${i}`"
        :class="{ 'game--is-failing': isFailing }"
        class="game my-3 py-2 px-1"
      >
        <b-col
          sm="2"
          class="game__match-id"
        >
          {{ i }}
        </b-col>
        <b-col
          sm="10"
          class="game__teams"
        >
          <span
            class="mr-3"
            :class="{ 'selected': game.result === 1,
                      'selected--schedule': game.result === 1 }"
          >
            {{ game.team1 }}
          </span>
          vs.
          <span
            class="ml-3"
            :class="{ 'selected': game.result === 2,
                      'selected--schedule': game.result === 2 }"
          >
            {{ game.team2 }}
          </span>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'GameSchedule',
  props: {
    isFailing: {
      type: Boolean,
      default: false,
    },
    games: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .game {
    background: #b83657;
    border-radius: 1rem;
    margin-bottom: 0.5rem;

    &--is-failing {
      background: #544c18;
    }
  }
</style>
