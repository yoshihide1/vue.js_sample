<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/signin">SignIn </router-link>|
      <router-link to="/signup">SignUp </router-link>|
      <router-link to="/sign">Sign </router-link>|
    </div> -->
   
    <router-view />


     <button @click="draw">!!!!!テストmap表示!!!!!</button>
    <div v-if="show">

      <!-- v-bind:渡すときの名前="渡すもの" -->
      <gmap @coord="coordinate" :coord="coord" :geoLatlng="geoLatlng">
        <!-- ここでGmapからmapDataの受け取り -->
      </gmap>
      <b-button variant="outline-success" class="geolocation" @click="geolocation">現在地取得</b-button>
      <!--子から$emitでもらいここで受け取る -->
      <gnavi @coordData="coordSet" :mapData="mapData" :geoLatlng="geoLatlng">
        <!--@子が送るときに付けた名前="処理を実行するメソッド"  -->
      </gnavi>
      <b-button variant="outline-danger" @click="signOut(); draw()">サインアウト</b-button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import gnavi from "@/components/Gnavi";
import gmap from "@/components/Gmap";
export default {
  components: {
    gnavi,
    gmap
  },
  data() {
    return {

      show: false,
      mapData: null, //子からのデータを一回ここに入れる
      coord: null, //子に渡すもの
      geoLatlng: null
    };
  },
  methods: {
    geolocation() {
      //現在地取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.success);
      } else {
        alert("端末が対応していません");
      }
    },
    success(position) {
      this.geoLatlng = position.coords;
    },
    //子からもらった値の代入
    coordinate(mapData) {
      this.mapData = mapData;
    },
    coordSet(coordData) {
      this.coord = coordData;
    },
    draw() {
      console.log("show")
      this.show = !this.show;
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/sign");
        });
    }
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.geolocation {
  margin-top: 15px;
}
</style>
