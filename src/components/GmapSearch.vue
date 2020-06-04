<template>
  <div>
    <p>
      <!-- 有料道路除外 -->
      <input type="checkbox" v-model="avoidTolls" />
      <b-button
        class="mt-3"
        block
        variant="success"
        @click="requestMap(myMarker), scrollTop()"
      >ルート検索</b-button>
    </p>

    <select v-model="selected">
      <option value>選択してください</option>
      <option v-for="option in options" :value="option.eName" :key="option.id">{{option.jName}}</option>
    </select>
    <b-button class="mt-3" block variant="success" @click="getPlace">Place</b-button>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "GmapSearch",
  props: {
    map: {
      type: Object,
      default: null
    },
    google: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(["myMarker", "latLng"])
  },
  watch: {},
  data() {
    return {
      plays: null,
      render: null,
      wayPoints: [],
      avoidTolls: false,
      selected: "",
      options: [
        { id: 1, eName: "amusement_park", jName: "遊び場" },
        { id: 2, eName: "aquarium", jName: "水族館" },
        { id: 3, eName: "zoo", jName: "動物園" },
        { id: 4, eName: "art_gallery", jName: "美術館" },
        { id: 5, eName: "campground", jName: "キャンプ場" },
        { id: 6, eName: "museum", jName: "博物館" },
        { id: 7, eName: "shopping_mall", jName: "ショッピングモール" },
      ]
    };
  },
  methods: {
    scrollTop() {
      scrollTo(0, 0);
    },

    requestMap() {
      this.clearRender();
      const direction = new this.google.maps.DirectionsService();
      this.render = new this.google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true, //デフォルトのルート用マーカー削除
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
        console.log("時間:" + totalTime + "分、距離" + totalDistance + "km");
        console.log(this.render);
      });
    },
    clearRender() {
      if (this.render !== null) {
        return this.render.setMap(null);
      }
    },

    getPlace() {
      console.log(this.plays);
      //仮
      const service = new this.google.maps.places.PlacesService(this.map);
      service.nearbySearch(
        {
          location: new this.google.maps.LatLng(34.662778, 135.572867),
          radius: 10000,
          languege: "ja",
          type: this.selected
        },
        (results, status) => {
          if (status == "OK") {
            results.forEach(data => {
              console.log(data);
              this.plays = data;
            });
            console.log(this.plays);
          } else {
            alert("失敗");
          }
        }
      );
    }
  }
};
</script>