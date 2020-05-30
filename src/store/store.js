import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    latLng: {
      latitude: 34.662778,
      longitude: 135.572867
    },
    myMarker: [],
    weather: [],
    temp: 0,
    tempMax: 0,
    tempMin: 0,
    humidity: 0,
    shops: [],
    hotels: []
  },

  mutations: {
    geoLatLng(state, payload) {//現在地-クリック位置
      console.log("geoLatLng mutation")
      state.latLng = payload
    },
    shopsData(state, payload) {
      console.log("shops mutation")
      state.shops = payload
    },
    hotelsData(state, payload) {
      console.log("hotels mutation")
      state.hotels = payload
    },
    weatherData(state, payload) {//天気
      console.log("weather mutation")
      let max = [];
      let min = [];
      for (let i = 0; i < 9; i++) {
        max.push(payload[i].main.temp_max);
        min.push(payload[i].main.temp_min);
      }
      state.weather = payload
      state.temp = parseInt(payload[0].main.temp)
      state.tempMax = parseInt(max.reduce((a, b) => (a > b ? a : b)))
      state.tempMin = parseInt(min.reduce((a, b) => (a < b ? a : b)))
      state.humidity = payload[0].main.humidity
    },
    marker(state, payload) {
      console.log("marker mutation")
      state.myMarker.push(payload)
    }
  },
  getters: {
  },

  actions: {
  }


})