<template>
  <b-container class="bv-example-row">
    <b-row class="mt-1" align-h="around">
      <b-col cols="2">
        <h3>
          <b-badge variant="secondary">Now {{ temp }}℃</b-badge>
        </h3>
      </b-col>
      <b-col cols="2">
        <h3>
          <b-badge variant="danger">Max {{ tempMax }}℃</b-badge>
        </h3>
      </b-col>
      <b-col cols="2">
        <h3>
          <b-badge variant="primary">Min {{ tempMin }}℃</b-badge>
        </h3>
      </b-col>
      <b-col cols="2">
        <h3>
          <b-badge variant="info">Hum {{ humidity }}％</b-badge>
        </h3>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
// import {mapMutations} from "vuex"
export default {
  name: "Weather",
  data() {
    return {
      weatherData: []
    };
  },
  computed: {
    ...mapState(["latLng", "latLngC", "temp", "tempMax", "tempMin", "humidity"])
  },
  watch: {
    latLng() {
      this.getWeather(this.latLng);
    },
    latLngC() {
      this.getWeather(this.latLngC);
    }
  },
  methods: {
    getWeather(latLng) {
      console.log("mounted");
      const params = {
        lat: latLng.latitude, //store
        lon: latLng.longitude,
        APPID: process.env.VUE_APP_WEATHER,
        lang: "jp",
        units: "metric"
      };
      axios
        .get("http://api.openweathermap.org/data/2.5/forecast/", { params })
        .then(response => {
          this.weatherData = response.data.list;
          this.$store.commit("weatherData", this.weatherData);
        });
    }
  }
};
</script>

<style>
</style>