<template>
  <div>
    <div class="map" ref="googleMap" @click="mapCoord"></div>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
export default {
  props: {
    coord: {
      type: Array,
      deafult: []
    }
  },
  data() {
    return {
      map: null,
      google: null,
      mapConfig: {
        center: {
          lat: 35.68944,
          lng: 139.69167
        },
        zoom: 8
      },
      markers: [],
      latitude: [],
      longitude: [],
      latlng: []
    };
  },
  watch: {
    coord() {
      //propsで受けとる値が変化したらここが実行される
      this.setMarkers(this.coord);
    }
  },

  async mounted() {
    this.google = await GoogleMapsApiLoader({
      apiKey: process.env.VUE_APP_GOOGLE
    });
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      //初期化の時はLoaderのthis.googleを使うそれ以外は基本的にここで代入したthis.map
      this.map = new this.google.maps.Map(this.$refs.googleMap, this.mapConfig);
    },

    setMarkers(data) {
      this.clearMarkers();
      for (let i in data) {
        this.latitude = data[i].latitude;
        this.longitude = data[i].longitude;
        this.latlng = new this.google.maps.LatLng(
          this.latitude,
          this.longitude
        );
        const marker = new this.google.maps.Marker({
          map: this.map,
          position: this.latlng,
          animation: this.google.maps.Animation.DROP
        });
        // const infoWindow = new this.google.maps.InfoWindow({
        //   position: this.latlng,
        //   content:
        // })
        this.markers.push(marker);
      }
    },
    mapCoord() {
      //マップクリックで座標取得
      this.map.addListener("click", e => {
        const mapData = {
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng()
        }; //App.vueへ緯度、経度を送る
        this.$emit("coord", mapData);
        this.mapZoom(mapData);
      });
    },
    mapZoom(mapData) {
      const latlng = new this.google.maps.LatLng(
        mapData.latitude,
        mapData.longitude
      );
      this.map.setCenter(latlng);
      this.map.setZoom(15);
    },

    clearMarkers() {
      //markerの削除（検索毎に）
      for (let i in this.markers) {
        this.markers[i].setMap(null);
      }
      this.markers = []; //ここで初期化しないと、ひたすら配列が長くなる
    }
  }
};
</script>

<style>
.map {
  width: 100%;
  height: 500px;
}
</style>