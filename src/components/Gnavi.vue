<template>
  <div id="title">
    <b-container fluid>
      <b-row class="py-1" align-h="center">
        <h3>食事</h3>
      </b-row>
      <b-row class="py-1" align-h="center">
        <p class="font-white">{{error}}</p>
      </b-row>
      <b-row align-h="center" id="shop-list">
        <div v-for="(shop, index) in shops" :key="index">
          <b-card-group>
            <b-col class="mt-2">
              <b-card
                bg-variant="secondary"
                border-variant="light"
                text-variant="white"
                :title="shop.name"
                :img-src="shop.image_url.shop_image1 ? shop.image_url.shop_image1 : noImage"
                :img-alt="shop.name"
                img-top
                tag="article"
                style="max-width: 17rem;"
              >
                <b-card-text>
                  <b-button-group>
                    <b-button id="button-group" variant="secondary" @click="starSet(index)">マイページ</b-button>
                    <b-button id="button-group" variant="secondary" @click="shopLatLng(shop)">マーカー</b-button>
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
          </b-card-group>
        </div>
      </b-row>
      <b-row align-h="center">
        <small>
          <a class="font-white" href="https://api.gnavi.co.jp/api/scope/" target="_blank">Supported by ぐるなびWebService</a>
        </small>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import firebase from "firebase";
export default {
  name: "Gnavi",

  data() {
    return {
      noImage: "/images/no_image.jpg",
      functions: firebase.functions(),
      error: ""
    };
  },

  computed: {
    ...mapState(["latLngC", "latLng", "shops"])
  },

  watch: {
    latLngC() {
      this.searchShops(this.latLngC);
    },
    latLng() {
      this.searchShops(this.latLng);
    }
  },

  methods: {
    starSet(index) {
      /**
       * CloudFunctionsにリクエスト
       * firestoreへ保存
       */
      const shop = this.shops[index];
      const star = this.functions.httpsCallable("star");
      star({
        id: 1, //マーカーを分けるためのid
        category: "食事",
        name: shop.name,
        address: shop.address,
        tel: shop.tel,
        image: shop.image_url.shop_image1,
        opentime: shop.opentime,
        latitude: shop.latitude,
        longitude: shop.longitude
      })
        .then(() => {
          console.log("(食)マイページ登録OK");
          this.$store.commit("myPage", shop.name);
        })
        .catch(() => {
          alert("登録に失敗しました")
          console.log("error");
        });
    },
    //飲食店の検索
    searchShops(latLng) {
      const params = {
        keyid: process.env.VUE_APP_GNAVI,
        hit_per_page: 30,
        range: 5,
        latitude: latLng.latitude,
        longitude: latLng.longitude
      };

      axios
        .get("https://api.gnavi.co.jp/RestSearchAPI/v3/", { params })
        .then(response => {
          this.error = "";
          const shops = response.data.rest;
          this.$store.commit("shopsData", shops);
        })
        .catch(() => {
          //前の履歴を消すため
          const error = [];
          this.error = "近くに飲食店がありません。";
          this.$store.commit("shopsData", error);
        });
    },
    //マーカーを設置する為の情報
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
#shop-list {
  background-color: #ff6a0d;
  background-image: linear-gradient(123deg, #ff6a0d 0%, #ec2e2e 100%);
}
#title {
  background-color: #332015;

  color: white;
}
</style>