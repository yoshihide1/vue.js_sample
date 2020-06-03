<template>
  <div>
    <menuList></menuList>
    <gmap></gmap>
    <b-container class="bv-example-row">
      <!-- <b-row>
        <b-input-group prepend="freeword" class="mt-3">
          <b-form-input type="text" v-model="freeword" placeholder="フリーワード"></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-success" v-on:click="searchShops">検索</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-row>-->

      <!-- <b-row>
        <b-col>
          <b-form-group>
            <label class="mt-2">
              検索範囲(半径)
              <b-form-radio-group v-model="selected" :options="options" name="radio-inline"></b-form-radio-group>
            </label>
          </b-form-group>
        </b-col>
      </b-row> -->

      <b-row align-h="center">
        <div v-for="(shop, index) in shops" :key="index">
          <b-col>
            <b-card
              bg-variant="secondary"
              border-variant="success"
              text-variant="white"
              :title="shop.name"
              :img-src="shop.image_url.shop_image1"
              :img-alt="shop.name"
              img-top
              tag="article"
              style="max-width: 20rem;"
            >
              <b-card-text>
                <b-button-group>
                  <b-button id="button-group" variant="secondary" @click="starSet(index)">マイページ登録</b-button>
                  <b-button id="button-group" variant="secondary" @click="shopLatLng(shop)">マーカーを置く</b-button>
                </b-button-group>
                <p>{{ shop.tel }}</p>
                <p>{{ shop.address }}</p>
                <b-form-textarea
                  id="textarea-rows"
                  class="p-0"
                  rows="4"
                  :placeholder="shop.opentime"
                ></b-form-textarea>
              </b-card-text>
            </b-card>
          </b-col>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import gmap from "@/components/Gmap";
import menuList from "@/components/Menu";
import { mapState } from "vuex";
import firebase from "firebase";
import "firebase/firestore";

export default {
  components: {
    gmap,
    menuList
  },
  data() {
    return {
      selected: 5,
      options: [
        //ぐるなびrange
        { text: "300m", value: 1 },
        { text: "500m", value: 2 },
        { text: "1000m", value: 3 },
        { text: "2000m", value: 4 },
        { text: "3000m", value: 5 }
      ],
      freeword: "",
      range: 5, //緯度、経度からの検索範囲
      db: firebase.firestore(),
      uid: firebase.auth().currentUser.uid
    };
  },
  computed: {
    ...mapState(["latLngC", "shops"])
  },
  watch: {
    latLngC() {
      this.searchShops();
    }
  },
  methods: {
    starSet(index) {
      //お気に入り
      const shop = this.shops[index];
      console.log(shop.name);
      this.db
        .collection("star")
        .add({
          category: "食事",
          name: shop.name,
          address: shop.address,
          tel: shop.tel,
          image: shop.image_url.shop_image1,
          opentime: shop.opentime,
          uid: this.uid
        })
        .then(() => {
          console.log("お気に入り登録完了");
        })
        .catch(() => {
          console.log("error");
        });
    },
    searchShops() {
      if (this.freeword != "") {
        this.selected = null;
      }
      const params = {
        keyid: process.env.VUE_APP_GNAVI, //.envから取得
        freeword: this.freeword,
        hit_per_page: 30, //検索結果の表示数
        range: this.selected,
        latitude: this.latLngC.latitude, //stoer
        longitude: this.latLngC.longitude
      };

      axios
        .get("https://api.gnavi.co.jp/RestSearchAPI/v3/", { params })
        .then(response => {
          const shops = response.data.rest;
          this.$store.commit("shopsData", shops);
          this.freeword = "";
          this.selected = 3;
        })
        .catch(() => {
          alert("近くに飲食店がありません");
        });
    },
    shopLatLng(shop) {
      const data = {
        name: shop.name,
        latitude: shop.latitude,
        longitude: shop.longitude,
        id: 1
      };
      this.$store.commit("newMarker", data);
    }
  }
};
</script>
<style>
#button-group {
  border: 1px solid white;
}
</style>