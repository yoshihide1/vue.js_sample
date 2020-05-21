<template>
  <div>
    <!-- <p>{{coord}}</p> -->
    <div id="map" @click="mapCoord"></div>
  </div>
</template>

<script>
export default {
  props: {
    coord: {
      type: Array,
      deafult: []
    }
  },
  data() {
    return {
      mapName: "map",
      map: null,
      markers: [],
      latitude: [],
      longitude: [],
      latlng: []
    };
  },
  watch: {
    coord () {//propsで受けとる値が変化したらここが実行される
      this.setMarkers(this.coord)
    }
  },

  methods: {
    initMap () {
      console.log(this.coord)
      //mapの初期化
      //windowがないとエラーが出る
      this.map = new window.google.maps.Map(
        document.getElementById(this.mapName),
        {
          center: {
            lat: 35.6810409,
            lng: 139.7670516
          },
          zoom: 8
        }
      );
    },
    setMarkers (data) {
      this.clearMarkers();
      for (let i in data) {
        this.latitude = data[i].latitude;
        this.longitude = data[i].longitude;
        this.latlng = new window.google.maps.LatLng(
          this.latitude,
          this.longitude
        );
        const marker = new window.google.maps.Marker({
          map: this.map,
          position: this.latlng,
          animation: window.google.maps.Animation.DROP
        });
        this.markers.push(marker);
      }
    },
    mapCoord () {
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
    mapZoom (mapData) {
      const latlng = new window.google.maps.LatLng(
        mapData.latitude,
        mapData.longitude
      );
      this.map.setCenter(latlng);
      this.map.setZoom(15);
    },

    clearMarkers () {
      //markerの削除（検索毎に）
      for (let i in this.markers) {
        this.markers[i].setMap(null);
      }
      this.markers = []; //ここで初期化しないと、ひたすら配列が長くなる
    }
  },

  mounted: function() {
    this.initMap();
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 500px;
}
</style>