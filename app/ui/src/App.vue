<template>
  <div class="pb-5" id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

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
    background: rgb(239,75,75);
    background: linear-gradient(45deg, rgba(239,75,75,1) 0%, rgba(245,131,139,1) 100%);
    border-radius: 2rem;
    padding: 2rem;
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
