<template>
  <div>
    <menuList></menuList>
    <h1>観光情報</h1>
    <button @click="getData">GET!!</button>
  </div>
</template>

<script>
import menuList from "@/components/Menu";
import axios from "axios"

export default {
  components: {
    menuList
  },
  computed: {
  },

  data() {
    return {
    };
  },

  methods: {
    getData() {
     const params = {
       appid: "",
        lat: 35.404421,
        lon:139.454344,
        dist: 5
     }
      axios
      .get("https://map.yahooapis.jp/search/local/V1/localSearch", { params} ,
      )
      .then((res) => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }

  }
};
</script>

<style>
</style>