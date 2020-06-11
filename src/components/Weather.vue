<template>
  <b-container fluid>
    <b-row cols="3" align-h="around" class="text-center">
      <b-col>
        <p class="weather">
          <b-badge variant="danger" class="px-1">Max {{ tempMax }}℃</b-badge>
        </p>
      </b-col>
      <b-col>
        <p class="weather">
          <b-badge variant="primary" class="px-1">Min {{ tempMin }}℃</b-badge>
        </p>
      </b-col>
      <b-col>
        <p class="weather">
          <b-badge variant="info" class="px-1">Hum {{ humidity }}％</b-badge>
        </p>
      </b-col>
      <b-col>
        <p class="weather">
          <b-badge variant="secondary" class="px-1">Now {{ temp }}℃</b-badge>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
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
.weather {
  font-size: 1.4rem;
  /* width: 100%; */
}
</style>