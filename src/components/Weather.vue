<template>
  <div>
    <menuList></menuList>
    <p>{{latLng.latitude}}</p>
    <p>{{latLng.longitude}}</p>
    <b-container class="bv-example-row">
      <b-row align-h="center">
        <h4>現在の気温</h4>
      </b-row>
      <b-row align-h="center">
        <h3>{{ temp }}</h3>
      </b-row>
      <b-row class="text-center" align-h="center">
        <b-col cols="4">
          <h5>最高</h5>
          <h3>{{ tempMax }}</h3>
        </b-col>
        <b-col cols="4">
          <h5>最低</h5>
          <h3>{{ tempMin }}</h3>
        </b-col>
        <b-col cols="4">
          <h5>湿度</h5>
          <h3>{{ humidity }}</h3>
        </b-col>
      </b-row>
      <b-row class="text-center" align-h="center"></b-row>
    </b-container>
    <gmap></gmap>
  </div>
</template>

<script>
import axios from "axios";
import menuList from "@/components/Menu";
import gmap from "@/components/Gmap";
import { mapState } from "vuex";
// import {mapMutations} from "vuex"
export default {
  name: "Weather",
  components: {
    menuList,
    gmap
  },

  data() {
    return {
      weatherData: []
    };
  },
  computed: {
    ...mapState(["latLng", "temp", "tempMax", "tempMin", "humidity"])
  },
  watch: {
    latLng() {
      this.getWeather();
    }
  },
  methods: {
    getWeather() {
      console.log("mounted");
      const params = {
        lat: this.latLng.latitude, //store
        lon: this.latLng.longitude,
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