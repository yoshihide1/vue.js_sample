<template>
  <div>
    <div class="map" ref="googleMap" @click="mapCoord"></div>
    <b-container>
      <b-row align-h="center">
        <b-button variant="outline-success" class="geolocation mt-2" @click="geoLocation">現在地取得</b-button>
      </b-row>
    </b-container>
  </div>
</template>
f
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
// import MarkerClusterer from "js-marker-clusterer"
export default {
  props: {
    shopList: {
      default: []
    }
  },
  watch: {
    shopList() {
      //Gnaviから
      this.setMarkers(this.shopList);
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
      latlng: [],
      geoLatlng: null,
      infoWindows: [],
      currentInfoWindow: ""
      // markerCluster: []
    };
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
        const offset = new this.google.maps.Size(0, -10);
        const infoWindow = new this.google.maps.InfoWindow({
          position: this.latlng,
          pixelOffset: offset,
          content: "<div><h4>" + data[i].name + "</h4></div>"
        });
        marker.addListener("click", () => {
          if (this.currentInfoWindow) {
            //infoWindowが開かれていたら
            this.currentInfoWindow.close();
          }
          infoWindow.open(this.map);
          this.currentInfoWindow = infoWindow;
        });
        this.markers.push(marker);
        this.infoWindows.push(infoWindow);
      }
      // this.markerCluster new MarkerClusterer(this.map, this.markers);
    },
    mapCoord() {
      //マップクリックで座標取得
      this.map.addListener("click", e => {
        const mapData = {
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng()
        }; //Gnavi.vueへ緯度、経度を送る
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
      //markerの削除
      for (let i in this.markers) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },
    geoLocation() {
      //現在地取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.success);
      } else {
        alert("端末が対応していません");
      }
    },
    success(position) {
      this.geoLatlng = position.coords;
      this.mapZoom(this.geoLatlng);
      this.$emit("geoLatlng", this.geoLatlng);
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