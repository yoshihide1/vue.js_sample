<template>
  <div>
    <div id="gmap" class="map" ref="googleMap"></div>
  </div>
</template>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import { mapState, mapGetters } from "vuex";
export default {
  name: "Gmap",

  data() {
    return {
      map: null,
      google: null,
      place: null,
      circle: [],
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

  computed: {
    //myMarker = 選んだ場所などを配列で保持している
    ...mapState(["latLng", "myMarker", "latLngC"]),
    //選択したマーカーの削除
    ...mapGetters(["filterMarker"])
  },

  watch: {
    myMarker() {
      //myMarker = 選択した場所の緯度経度にマーカー設置
      this.setMarkers(this.myMarker);
    },
    latLng() {
      //現在地取得から得た緯度経度にサークル設置
      this.drawCircle(this.latLng);
    },
    latLngC() {
      //マップクリックから得た緯度経度にサークル設置
      this.drawCircle(this.latLngC);
    }
  },

  async mounted() {
    //GoogleMap
    this.google = await GoogleMapsApiLoader({
      apiKey: process.env.VUE_APP_GOOGLE,
      libraries: ["places"]
    });
    this.initializeMap();
    this.$store.commit("google", this.google);
    window.addEventListener("resize", this.updateDevice);
    this.updateDevice();
    //マップクリックで座標取得
    this.map.addListener("click", e => {
      const mapData = {
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng()
      };
      this.$store.commit("clickLatLng", mapData);
      this.mapZoom(12);
    });
  },

  methods: {
    //GoogleMapsApi.PlaceApiの初期化
    initializeMap() {
      this.map = new this.google.maps.Map(this.$refs.googleMap, this.mapConfig);
      this.place = new this.google.maps.places.PlacesService(this.map);
      this.$store.commit("map", this.map);
      this.$store.commit("place", this.place);
    },
    updateDevice() {
      const height = window.innerHeight;
      document.getElementById("gmap").style.height = height - 40 + "px";
      
      if (navigator.geolocation) {
        //現在地取得
        navigator.geolocation.getCurrentPosition(this.success);
      } else {
        alert("端末が対応していません");
      }
    },
    success(position) {
      const geoLatlng = position.coords;
      const latLng = {
        latitude: geoLatlng.latitude,
        longitude: geoLatlng.longitude,
        name: "現在地",
        id: 5 //マーカーの識別の為
      };
      this.$store.commit("geoLatLng", latLng);
      this.$store.commit("newMarker", latLng);
    },
    /**
     * circleの表示
     * @param 選択した場所の緯度経度
     */
    drawCircle(data) {
      // this.circle = []
      this.clearCircle();
      const latLng = new this.google.maps.LatLng(data.latitude, data.longitude);
      //circleの半径(ｍ表記)
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
      //circleを三つ重ねて表示するための処理
      radiusAndColor.forEach(radius => {
        circleOption.fillColor = radius[0];
        circleOption.radius = radius[1];
        this.circle.push(new this.google.maps.Circle(circleOption));
      });
      for (let i in this.circle) {
        this.circle[i].setMap(this.map);
      }
    },

    clearCircle() {
      //circle削除
      if (this.circle.length !== 0) {
        for (let i in this.circle) {
          //マップから削除
          this.circle[i].setMap(null);
        }
        //最後に配列からも削除
        this.circle = [];
      } else {
        return;
      }
    },
    /**
     * マーカーの設置
     * @param 現在地の緯度経度、クリックした場所の緯度経度
     * のいずれかが入る
     */
    setMarkers(latLngData) {
      console.log("setMarker");
      this.clearMarkers();
      let icon;
      latLngData.forEach(data => {
        let content = `<b-button variant="danger" id="infoButton">マーカー削除</b-button>
            <p>${data.name}</p>`;
        switch (
          data.id //マーカーの色分け
        ) {
          case 1: //飲食
            icon = "/gmap/mapicon1.png";
            break;

          case 2: //ホテル
            icon = "/gmap/mapicon2.png";
            break;

          case 3: //観光、遊び
            icon = "/gmap/mapicon3.png";
            break;

          default:
            icon = "/gmap/mapicon5.png";
            content = ` <button id="infoButton">マーカー削除</button><p>現在地<p>`;
            break;
        }
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        //マーカー設置の為の緯度経度
        const latLng = new this.google.maps.LatLng(
          this.latitude,
          this.longitude
        );
        //マーカーの生成
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
        //infoWindowを複数表示させないための処理
        marker.addListener("click", () => {
          if (this.currentInfoWindow) {
            this.currentInfoWindow.close();
          }
          infoWindow.open(this.map);
          this.currentInfoWindow = infoWindow;
        });
        //infoWindow内でボタンを有効にするための処理
        infoWindow.addListener("domready", () => {
          document
            .getElementById("infoButton")
            .addEventListener("click", () => {
              marker.setMap(null);
              this.currentInfoWindow.close();
              /**
               * infoWindow内のボタンが押されたときにマーカーを
               * 配列から削除する
               */
              this.$store.commit("deleteMarker", this.filterMarker(data.name));
            });
        });
        this.markers.push(marker);
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