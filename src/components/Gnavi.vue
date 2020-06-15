<template>
  <div id="title">
    <!-- <b-row>
        <b-col>
          <b-form-group>
            <label class="mt-2">
              検索範囲(半径)
              <b-form-radio-group v-model="selected" :options="options" name="radio-inline"></b-form-radio-group>
            </label>
          </b-form-group>
        </b-col>
    </b-row>-->
    <b-container fluid>
      <b-row class="py-1" align-h="center">
        <h3>食事</h3>
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
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import firebase from "firebase";
export default {
  data() {
    return {
      noImage: "/images/no_image.jpg",
      selected: 5,
      // options: [
      //   //ぐるなびrange
      //   { text: "300m", value: 1 },
      //   { text: "500m", value: 2 },
      //   { text: "1000m", value: 3 },
      //   { text: "2000m", value: 4 },
      //   { text: "3000m", value: 5 }
      // ],
      // freeword: "",
      // range: 5, //緯度、経度からの検索範囲
      functions: firebase.functions()
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
      console.log(shop);
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
          console.error("error");
        });
    },
    //飲食店の検索
    searchShops(latLng) {
      const params = {
        keyid: process.env.VUE_APP_GNAVI,
        hit_per_page: 30,
        range: this.selected,
        latitude: latLng.latitude,
        longitude: latLng.longitude
      };

      axios
        .get("https://api.gnavi.co.jp/RestSearchAPI/v3/", { params })
        .then(response => {
          console.log(response);
          const shops = response.data.rest;
          this.$store.commit("shopsData", shops);
          this.selected = 5;
        })
        .catch(() => {
          alert("近くに飲食店がありません");
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