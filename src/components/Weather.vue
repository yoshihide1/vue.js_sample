<template>
  <div>
    <b-container class="bv-example-row">
      <menuList></menuList>
      <b-row align-h="center">
        <h1>ここは天気情報</h1>
      </b-row>
      <b-row align-h="center">
        <h2>現在の気温</h2>
      </b-row>
      <b-row align-h="center">
        <h3>{{ temp }}</h3>
      </b-row>
      <b-row class="text-center" align-h="center">
        <b-col cols="4">
          <h2>最高</h2>
          <h3>{{ tempMax }}</h3>
        </b-col>
        <b-col cols="4">
          <h2>最低</h2>
          <h3>{{ tempMin }}</h3>
        </b-col>
      </b-row>
      <b-row class="text-center" align-h="center">
        <b-col cols="4">
          <h2>湿度</h2>
          <h3>{{ humidity }}</h3>
        </b-col>
      </b-row>
      <button @click="getWeather">天気取得</button>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import menuList from "@/components/Menu";
export default {
  components: {
    menuList
  },
  data() {
    return {
      temp: 0,
      tempMax: 0,
      tempMin: 0,
      humidity: 0
    };
  },
  methods: {
    getWeather() {
      const params = {
        lat: 35.68944,
        lon: 139.69167,
        APPID: process.env.VUE_APP_WEATHER,
        lang: "jp",
        units: "metric"
      };
      axios
        .get("http://api.openweathermap.org/data/2.5/forecast/", { params })
        .then(response => {
          console.log(response);
        });
    }
  }
};
</script>

<style>
</style>