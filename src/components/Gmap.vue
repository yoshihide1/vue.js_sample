<template>
  <div>
    <div id="gmap" class="map" ref="googleMap" @click="mapCoord"></div>
    <weather></weather>
    <b-container>
      <b-row>
        <p>
          <button @click="requestMap(myMarker)">ルート検索</button>
        </p>有料道路除外
        <input type="checkbox" v-model="avoidTolls" />
        {{avoidTolls}}
        <div v-for="(marker, index) in myMarker" :key="index">
          <p>{{ marker.name }}</p>
        </div>
      </b-row>
    </b-container>
    <button @click="heatMap">heatMapTest</button>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState, mapGetters } from "vuex";
import weather from "@/components/Weather";
export default {
  components: {
    weather
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
      currentInfoWindow: "",
      wayPoints: [],
      avoidTolls: false,
      render: null
    };
  },

  async mounted() {
    this.google = await GoogleMapsApiLoader({
      apiKey: process.env.VUE_APP_GOOGLE + "&libraries=visualization"
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
    clearRender() {
      if (this.render !== null) {
        return this.render.setMap(null);
      }
    },

    requestMap() {
      this.clearRender();
      const direction = new this.google.maps.DirectionsService();
      this.render = new this.google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true, //ルート用のマーカー削除
        draggable: true
      });
      this.myMarker.forEach(data => {
        let points = {
          location: new this.google.maps.LatLng(data.latitude, data.longitude)
        };
        this.wayPoints.push(points);
      });
      let request = {
        origin: new this.google.maps.LatLng(
          this.latLng.latitude,
          this.latLng.longitude
        ), // 出発地
        destination: new this.google.maps.LatLng(
          this.myMarker.slice(-1)[0].latitude,
          this.myMarker.slice(-1)[0].longitude
        ),
        waypoints: this.wayPoints,
        travelMode: this.google.maps.DirectionsTravelMode.DRIVING, // 交通手段
        optimizeWaypoints: true, //rootの最適化(最短ルートに並べ替え)
        avoidTolls: this.avoidTolls //有料道路の除外
      };

      direction.route(request, (result, status) => {
        let totalTime = 0;
        let totalDistance = 0;
        if (status == this.google.maps.DirectionsStatus.OK) {
          this.render.setDirections(result);

          let totalData = result.routes[0].legs;

          for (let i in totalData) {
            totalTime += totalData[i].duration.value / 60;
            totalDistance += totalData[i].distance.value / 1000;
          }
          totalTime = totalTime.toFixed(0);
          totalDistance = totalDistance.toFixed(1);
          this.$store.commit("time", totalTime);
          this.$store.commit("distance", totalDistance);
          this.wayPoints = [];
        }
        this.mapZoom(8);
        console.log("時間:" + totalTime + "分、距離" + totalDistance + "km");
        console.log(this.render);
      });
    },
    heatMap() {
      let heatmapData = [
        //仮
        {
          location: new this.google.maps.LatLng(this.latitude, this.longitude),
          weight: 8
        }
      ];
      //  var sanFrancisco = new this.google.maps.LatLng(37.774546, -122.433523);

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