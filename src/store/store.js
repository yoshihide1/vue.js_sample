import Vue from "vue"
import Vuex from "vuex"


Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    userId: [],
    latLng: null,
    latLngC: null,
    myMarker: [],
    shops: [],
    hotels: [],
    places: [],
    photos: [],
    time: 0,
    distance: 0,
    google: null,
    map: null,
    place: null,//PlaceAPI
    alternatives: "",
    deleteAlert: ""//alert用
  },

  mutations: {
    myPage(state, name) {//myPageを更新させるため
      state.alternatives = name
    },
    google(state, google) {
      state.google = google
    },
    map(state, googleMap) {
      state.map = googleMap
    },
    place(state, place) {
      state.place = place
    },
    geoLatLng(state, latLng) {//現在地
      state.latLng = latLng
    },
    clickLatLng(state, latLng) {//クリック位置
      state.latLngC = latLng
    },
    shopsData(state, shops) {//APIで取得したshopのデータ
      state.shops = shops
    },
    hotelsData(state, hotels) {//APIで取得したhotelのデータ
      state.hotels = hotels
    },
    placeData(state, place) {//APIで取得したplaceのデータ
      state.places = place
    },
    newMarker(state, payload) {//ルート検索に使うマーカーの数の監視
      if (state.myMarker.length > 9) {
        alert("最大１０件まで")
      } else {
        state.myMarker.push(payload)
      }
    },
    deleteMarker(state, payload) {
      state.myMarker = payload
    },
    time(state, payload) {//トータルの時間
      state.time = payload
    },
    distance(state, payload) {//トータルの移動距離
      state.distance = payload
    },
    deleteAlert(state, payload) {//削除用
      state.deleteAlert = payload
    }
  },
  getters: {//選択したマーカーの削除
    filterMarker: (state) => (name) => {
      return state.myMarker.filter(marker => marker.name !== name)
    },
  },
})