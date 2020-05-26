<template>
  <div>
    <b-container class="bv-example-row">
      <menuList></menuList>
      <b-row align-h="center">
        <h4>現在の気温</h4>
      </b-row>
      <b-row align-h="center">
        <h3>{{ temp }}</h3>
      </b-row>
      <b-row class="text-center" align-h="center">
        <b-col cols="4">
          <h4>最高</h4>
          <h3>{{ tempMax }}</h3>
        </b-col>
        <b-col cols="4">
          <h4>最低</h4>
          <h3>{{ tempMin }}</h3>
        </b-col>
      </b-row>
      <b-row class="text-center" align-h="center">
        <b-col cols="4">
          <h5>湿度</h5>
          <h3>{{ humidity }}</h3>
        </b-col>
      </b-row>
      <button @click="getWeather">天気取得</button>
    </b-container>
    <gmap @geoLatlng="coordinate" @coord="coordinate"></gmap>
  </div>
</template>

<script>
import axios from "axios";
import menuList from "@/components/Menu";
import gmap from "@/components/Gmap";
export default {
  name: "Weather",
  components: {
    menuList,
    gmap
  },
  data() {
    return {
      weatherData: [],
      temp: 0,
      tempMax: 0,
      tempMin: 0,
      humidity: 0,
      latitude: 35.68944,
      longitude: 139.69167
    };
  },
  created() {
    this.getWeather();
  },
  watch: {
    $route: "getWeather"
  },
  methods: {
    coordinate(geoLatlng) {
      this.latitude = geoLatlng.latitude;
      this.longitude = geoLatlng.longitude;
      this.getWeather();
    },

    getWeather() {
      const params = {
        lat: this.latitude,
        lon: this.longitude,
        APPID: process.env.VUE_APP_WEATHER,
        lang: "jp",
        units: "metric"
      };
      axios
        .get("http://api.openweathermap.org/data/2.5/forecast/", { params })
        .then(response => {
          this.weatherData = response.data.list;
          this.setWeather();
          console.log(response);
        });
    },
    setWeather() {
      let max = [];
      let min = [];
      for (let i = 0; i < 9; i++) {
        max.push(this.weatherData[i].main.temp_max);
        min.push(this.weatherData[i].main.temp_min);
      }
      this.temp = parseInt(this.weatherData[0].main.temp);
      //24時間の中での最高気温と最低気温
      this.tempMax = parseInt(max.reduce((a, b) => (a > b ? a : b)));
      this.tempMin = parseInt(min.reduce((a, b) => (a < b ? a : b)));
      this.humidity = this.weatherData[0].main.humidity; //湿度
    }
  }
};
</script>

<style>
</style>