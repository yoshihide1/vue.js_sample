<template>
  <div>
    <div id="gmap" class="map" ref="googleMap" @click="mapCoord"></div>
    <b-container>
      <b-row>
        <div v-for="(marker, index) in myMarker" :key="index">
          <p id="waypoints">{{ index+1 }}:{{ marker.name }}>></p>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState, mapGetters } from "vuex";
export default {
  name: "Gmap",
  watch: {
    myMarker() {
      this.setMarkers(this.myMarker);
    },
    latLng() {
      this.drawCircle(this.latLng);
    },
    latLngC() {
      this.drawCircle(this.latLngC);
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
      place: null,
      circle: null,
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
      apiKey: process.env.VUE_APP_GOOGLE,
      libraries: ["places"]
    });
    this.initializeMap();
    this.$store.commit("google", this.google);
    window.addEventListener("resize", this.updateDevice);
    this.updateDevice();
  },

  methods: {
    initializeMap() {
      this.map = new this.google.maps.Map(this.$refs.googleMap, this.mapConfig);
      this.place = new this.google.maps.places.PlacesService(this.map);
      this.$store.commit("map", this.map);
      this.$store.commit("place", this.place);
    },
    updateDevice() {
      const height = window.innerHeight;
      document.getElementById("gmap").style.height = height + "px";
    },
    drawCircle(data) {
      // this.clearCircle();
      const latLng = new this.google.maps.LatLng(data.latitude, data.longitude);
      let radiusAndColor = [
        ["#FE2E2E", 2000],
        ["#FFFF00", 3000],
        ["#013ADF", 6000]
      ];
      let circleOption = {
        center: latLng,
        radius: null,
        strokeColor: "FF0000",
        strokeOpacity: 0.3,
        strokeWeight: 1,
        fillColor: null,
        fillOpacity: 0.2
      };
      radiusAndColor.forEach(radius => {
        circleOption.fillColor = radius[0];
        circleOption.radius = radius[1];
        this.circle = new this.google.maps.Circle(circleOption);
        this.circle.setMap(this.map);
      });
      console.log(this.circle.length);
    },

    // clearCircle() {
    //   if (this.circle !== null) {
    //     return this.circle.setMap(null);
    //   }
    // },

    setMarkers(latLngData) {
      console.log("setMarker");
      this.clearMarkers();
      let icon;
      latLngData.forEach(data => {
        let content = `<b-button variant="danger" id="infoButton">マーカー削除</b-button>
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
        this.mapZoom(13);
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
    }
  }
};
</script>
<style>
#gmap {
  width: 100%;
  height: 500px;
}
#waypoints {
  color: whitesmoke;
}
</style>