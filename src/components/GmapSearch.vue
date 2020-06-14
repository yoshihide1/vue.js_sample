<template>
  <div>
    <b-nav-item>
      <b-button variant="secondary" @click="requestMap(myMarker), scrollTop()">ルート検索</b-button>
    </b-nav-item>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "GmapSearch",
  computed: {
    ...mapState(["myMarker", "latLng", "map", "google"])
  },
  data() {
    return {
      render: null,
      wayPoints: [],
      avoidTolls: false
    };
  },
  methods: {
    scrollTop() {
      scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },

    requestMap() {
      this.clearRender();
      const direction = new this.google.maps.DirectionsService();
      this.render = new this.google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true, //デフォルトのルート用マーカー削除
        draggable: false
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
    }
  }
};
</script>
<style>
.fontSize {
  font-size: 1.3rem;
  font-weight: bolder;
}
</style>