<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">HOME</router-link>|
      <router-link to="/gnavi">Gnavi</router-link>|
      <router-link to="/gmap">Gmap</router-link>
    </div>
    <!-- メソッドにv-bindして上げるデータを入れる -->
    <!-- 子に送るデータ 子はpropsで受け取る ref=""を使うと親から子のメソッドを$refsで呼べる -->
    <gmap ref="marker" @coord="coordinate">
      <!-- ここでGmapからmapDataの受け取り -->
    </gmap>
    <!-- 子からもらった↓のをcoordSetで処理 -->
    <!-- refでgnaviへ -->
    <gnavi ref="coord" @coordSet="coordSet">
      <!--  -->
    </gnavi>
    <!-- gnavi タグで囲むと駄目 -->
    <!-- <div v-for="(latlng, index) in latlngs" :key="index"> -->
    <!-- <p>
        子からもたった緯度、経度情報
        {{latlng.latitude}}
        {{latlng.longitude}}
    </p>-->
    <!-- </div> -->
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
      coords: [],
      latlngs: []
    };
  },
  methods: {
    //店の情報
    coordinate: function(mapData) {
      //マップをクリックからの座標
      console.log(mapData);
      this.$refs.coord.searchShops(mapData);
    },
    coordSet: function(data) {
      console.log("CoodSet");
      this.$refs.marker.setMarkers(data); //子のメソッド実行引数で値が送れる
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
