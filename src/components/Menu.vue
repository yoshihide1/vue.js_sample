<template>
  <div>
    <b-container class="my-2">
      <b-row align-h="center">
        <router-link to="/">
          <b-button variant="outline-success">Home</b-button>
        </router-link>

        <router-link to="/mypage">
          <b-button variant="outline-success">MyPage</b-button>
        </router-link>

        <router-link to="/gnavi">
          <b-button variant="outline-success">Gnavi</b-button>
        </router-link>

        <router-link to="/travel">
          <b-button variant="outline-success">Travel</b-button>
        </router-link>

        <router-link to="/sightseeing">
          <b-button variant="outline-success">Sightseeing</b-button>
        </router-link>

        <router-link to="/weather">
          <b-button variant="outline-success">Weather</b-button>
        </router-link>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>