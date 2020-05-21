<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">HOME</router-link>|
      <router-link to="/gnavi">Gnavi</router-link>|
      <router-link to="/gmap">Gmap</router-link>
    </div>
    <!-- v-bind:渡すときの名前="渡すもの" -->
    <gmap @coord="coordinate" :coord="coord">
      <!-- ここでGmapからmapDataの受け取り -->
    </gmap>
    <!--子から$emitでもらいここで受け取る -->
    <gnavi @coordData="coordSet" :mapData="mapData">
    <!--@子が送るときに付けた名前="処理を実行するメソッド"  -->
    </gnavi>

  </div>
</template>

<script>
import gnavi from "@/components/Gnavi";
import gmap from "@/components/Gmap";
export default {
  components: {
    gnavi,
    gmap
  },
  data() {
    return {
      // coords: [],
      // latlngs: [],
      mapData: null,//子からのデータを一回ここに入れる
      coord: null,//子に渡すもの
      
    };
  },
  methods: {
    //Gmapからの座標
    coordinate (mapData) {
      //子からもらった値の代入
      this.mapData = mapData
    },
    coordSet (coordData) {
      this.coord = coordData
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
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
