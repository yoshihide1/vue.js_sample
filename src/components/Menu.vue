<template>
  <div>
    <b-container>
      <b-row align-h="center">
        <router-link to="/gnavi">
          <b-button variant="outline-success">Gnavi</b-button>
        </router-link>

        <router-link to="/rakuten">
          <b-button variant="outline-success">Rakuten</b-button>
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