<template>
  <div>
    <div class="map" ref="googleMap" @click="mapCoord"></div>
  </div>
</template>
f
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState } from "vuex";
export default {
  watch: {
    myMarker() {
      console.log("marker");
      this.setMarkers(this.myMarker);
      console.log(this.myMarker);
    }
  },
  computed: {
    ...mapState(["latLng", "myMarker", "shops", "hotels"])
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
      infoWindows: [],
      currentInfoWindow: ""
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
      console.log(data);
      let icon;
      let content = "<div></div>";
      for (let i in data) {
        switch (data[i].id) {
          case 1:
            icon = "/gmap/mapicon1.png";
            break;
          case 2:
            icon = "/gmap/mapicon2.png";
            break;
          case 3:
            icon = "/gmap/mapicon3.png";
            break;
          default:
            icon = "/gmap/mapicon5.png";
            break;
        }
        this.latitude = data[i].latitude;
        this.longitude = data[i].longitude;
        this.latlng = new this.google.maps.LatLng(
          this.latitude,
          this.longitude
        );
        this.marker = new this.google.maps.Marker({
          map: this.map,
          position: this.latlng,
          animation: this.google.maps.Animation.DROP,
          icon: {
            url: icon,
            scaledSize: new this.google.maps.Size(40, 40)
          }
        });
        const offset = new this.google.maps.Size(0, -10);
        const infoWindow = new this.google.maps.InfoWindow({
          position: this.latlng,
          pixelOffset: offset,
          content: content
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