<template>
  <div>
    <div id="gmap" class="map" ref="googleMap" @click="mapCoord"></div>
    <weather></weather>
    <b-container>
      <b-row>
        <div v-for="(marker, index) in myMarker" :key="index">
          <p>{{ marker.name }}</p>
        </div>
      </b-row>
    </b-container>
    <GmapSearch :map="map" :google="google"></GmapSearch>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState, mapGetters } from "vuex";
import weather from "@/components/Weather";
import GmapSearch from "@/components/GmapSearch";
export default {
  components: {
    weather,
    GmapSearch
  },
  watch: {
    myMarker() {
      console.log("marker");
      console.log(this.myMarker);
      this.setMarkers(this.myMarker);
    }
  },
  computed: {
    ...mapState(["latLng", "myMarker", "latLngC"]),
    ...mapGetters(["filterMarker", "pointMarker"])
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
      apiKey:
        process.env.VUE_APP_GOOGLE + "&libraries=visualization&libraries=places"
    });
    this.initializeMap();
    window.addEventListener("resize", this.updateDevice);
    this.updateDevice();
  },

  methods: {
    initializeMap() {
      this.map = new this.google.maps.Map(this.$refs.googleMap, this.mapConfig);
    },
    updateDevice() {
      const height = window.innerHeight;
      document.getElementById("gmap").style.height = height + "px";
    },

    setMarkers(latLngData) {
      console.log("setMarker");
      this.clearMarkers();
      let icon;
      latLngData.forEach(data => {
        let content = `<button id="infoButton">マーカー削除</button>
            <p>${data.name}</p>`;
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
            content = ` <button id="infoButton">マーカー削除</button><p>現在地<p>`;
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
            });
        });
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
        this.$store.commit("clickLatLng", mapData);
        this.mapZoom(10);
      });
    },
    mapZoom(zoom) {
      let latlng = new this.google.maps.LatLng(
        this.latLngC.latitude,
        this.latLngC.longitude
      );
      this.map.setCenter(latlng);
      this.map.setZoom(zoom);
    },
    clearMarkers() {
      for (let i in this.markers) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },
    heatMap() {
      //仮
      let heatmapData = [
        {
          location: new this.google.maps.LatLng(this.latitude, this.longitude),
          weight: 8
        }
      ];

      let heatmap = new this.google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.setMap(this.map);
    }
  }
};
</script>

<style>
#gmap {
  width: 100%;
  height: 500px;
}
</style>