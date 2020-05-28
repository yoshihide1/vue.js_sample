<template>
  <div>
    <div class="map" ref="googleMap" @click="mapCoord"></div>
  </div>
</template>
f
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState } from "vuex";
// import MarkerClusterer from "js-marker-clusterer"
export default {
  props: {
    shopList: {
      default: () => []
    },
    hotelList: {
      default: () => []
    }
  },
  watch: {
    shopList() {
      //Gnaviから
      this.setMarkers(this.shopList);
    },
    hotelList() {
      this.setMarkers(this.hotelList);
    }
  },
  computed: {
    ...mapState(["latLng"])
  },

  data() {
    return {
      map: null,
      google: null,
      mapConfig: {
        center: {
          lat: 34.662778,
          lng: 135.572867
        },
        zoom: 7
      },
      marker: null,
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
        this.marker = new this.google.maps.Marker({
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
        this.marker.addListener("click", () => {
          if (this.currentInfoWindow) {
            this.currentInfoWindow.close();
          }
          infoWindow.open(this.map);
          this.currentInfoWindow = infoWindow;
        });
        this.markers.push(this.marker);
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
        };
        this.$store.commit("geoLatLng", mapData);
        this.mapZoom();
      });
    },
    mapZoom() {
      const latlng = new this.google.maps.LatLng(
        this.latLng.latitude,
        this.latLng.longitude
      );
      this.map.setCenter(latlng);
      this.map.setZoom(15);
    },
    clearMarkers() {
      for (let i in this.markers) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
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