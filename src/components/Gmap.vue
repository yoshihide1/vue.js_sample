<template>
  <div>
    <div class="map" ref="googleMap" @click="mapCoord"></div>
  </div>
</template>
f
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState, mapGetters } from "vuex";
export default {
  watch: {
    myMarker() {
      console.log("marker");
      this.setMarkers(this.myMarker);
    }
  },
  computed: {
    ...mapState(["latLng", "myMarker"]),
    ...mapGetters(["filterMarker"])
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
      markers: [],
      latitude: [],
      longitude: [],
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

    setMarkers(latLngData) {
      console.log("setMarker");
      this.clearMarkers();
      let icon;
      let content = `<p>
            <button id="infoButton">マーカー削除</button>
            ${data.name}</p>`;
      // for (let i in data) {
      latLngData.forEach((data, index) => {
        switch (data.id) {
          case 1: //飲食
            icon = "/gmap/mapicon1.png";
            break;

          case 2: //ホテル
            icon = "/gmap/mapicon2.png";
            break;

          case 3:
            icon = "/gmap/mapicon3.png";
            content = "<p>観光</p>";
            break;

          default:
            icon = "/gmap/mapicon5.png";
            content = `<p> <button id="infoButton">マーカー削除</button>現在地<p>`;
            break;
        }
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        const latLng = new this.google.maps.LatLng(
          this.latitude,
          this.longitude
        );
        const marker = new this.google.maps.Marker({
          map: this.map,
          position: latLng,
          animation: this.google.maps.Animation.DROP,
          icon: {
            url: icon,
            scaledSize: new this.google.maps.Size(40, 40)
          }
        });
        const offset = new this.google.maps.Size(0, -30);
        const infoWindow = new this.google.maps.InfoWindow({
          position: latLng,
          pixelOffset: offset,
          content: content
        });
        marker.addListener("click", () => {
          if (this.currentInfoWindow) {
            this.currentInfoWindow.close();
          }
          infoWindow.open(this.map);
          this.currentInfoWindow = infoWindow;
        });
        infoWindow.addListener("domready", () => {
          document
            .getElementById("infoButton")
            .addEventListener("click", () => {
              marker.setMap(null);
              this.currentInfoWindow.close();
              this.$store.commit("deleteMarker", this.filterMarker(data.name));
              console.log(this.myMarker);
            });
        });
        this.mapZoom();
        // this.infoWindows.push(infoWindow);
        this.markers.push(marker);
      });
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
      this.map.setZoom(13);
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