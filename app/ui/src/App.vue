<template>
  <div
    id="app"
    class="pb-5"
  >
    <div id="nav">
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/about">
        Admin
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'BetCreatorForm',
  created() {
    this.$store.dispatch('loadGames');
  },
};
</script>

<style lang="scss">
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */

  background-color: white;

  h1, h2 {
    font-weight: bold;
  }

  .content-box {
    color: white;
    &--variant-1 {
      background: #E37F5B;
    }
    &--variant-2 {
      background: #AC3F36;
    }
    &--variant-3 {
      background: #260d16;
    }
    &--variant-4 {
      background: #041725;
    }
    background: rgb(239,75,75);
    background: linear-gradient(45deg, rgba(239,75,75,1) 0%, rgba(245,131,139,1) 100%);
    border-radius: 2rem;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }

  .selected {
    border-radius: 0.5rem;
    background-color: rgba(255,255,255, 0.1);
    border: 2px solid var(--info);
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 10px;
    &--schedule {
      border-color: #bcdaff;
    }
  }
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
