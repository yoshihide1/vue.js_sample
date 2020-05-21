<template>
  <b-container>
    <b-row>
      <b-input-group prepend="freeword" class="mt-3">
        <b-form-input type="text" v-model="freeword" placeholder="フリーワード"></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-success" v-on:click="searchShops">検索</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-row>

    <b-row>
      <b-col>
        <b-form-group>
          <b-form-radio-group v-model="selected" :options="options" name="radio-inline"></b-form-radio-group>
          <div>
            <label>検索範囲(半径)</label>
            <strong>{{ selected }}</strong>
          </div>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-checkbox v-model="no_smoking">禁煙席</b-form-checkbox>
      </b-col>

      <b-col>
        <b-form-checkbox v-model="lunch">ランチ</b-form-checkbox>
      </b-col>

      <b-col>
        <b-form-checkbox v-model="parking">駐車場</b-form-checkbox>
      </b-col>

      <b-col>
        <b-form-checkbox v-model="private_room">個室</b-form-checkbox>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-checkbox v-model="card">カード利用</b-form-checkbox>
      </b-col>

      <b-col>
        <b-form-checkbox v-model="kids_menu">キッズメニュー</b-form-checkbox>
      </b-col>

      <b-col>
        <b-form-checkbox v-model="wifi">WiFi</b-form-checkbox>
      </b-col>
    </b-row>

    <b-row align-h="center">
      <!-- indexをkeyにしないとエラーになる -->
      <div v-for="(shop, index) in shops" :key="index">
        <b-col>
          <!-- v-bind === : -->
          <b-card
            :title="shop.name"
            :img-src="shop.image_url.shop_image1"
            :img-alt="shop.name"
            img-top
            tag="article"
            style="max-width: 20rem;"
          >
            <b-card-text>
              <p>{{ shop.tel }}</p>
              <p>{{ shop.address }}</p>
              <b-form-textarea id="textarea-rows" class="p-0" rows="4" :placeholder="shop.opentime"></b-form-textarea>
            </b-card-text>
          </b-card>
        </b-col>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  props: {
    mapData: {
      //クリックした場所の座標
      type: Object,
      default: null
    },
    geoLatlng: {
      //現在地の座標
      // type: Object,//入れるとエラーがでる
      default: null
    }
  },
  data() {
    return {
      selected: 3,
      options: [
        //ぐるなびrange
        { text: "300m", value: 1 },
        { text: "500m", value: 2 },
        { text: "1000m", value: 3 },
        { text: "2000m", value: 4 },
        { text: "3000m", value: 5 }
      ],
      show: false, //要素の表示、非表示
      freeword: "",
      lunch: 0, //ランチ
      no_smoking: 0, //禁煙席あり
      card: 0, //カード利用
      private_room: 0, //個室
      parking: 0, //駐車場
      kids_menu: 0, //キッズメニュー
      wifi: 0, //
      range: 3, //緯度、経度からの検索範囲
      shops: [],
      latlng: []
    };
  },
  watch: {
    mapData() {
      //propsで受けとる値が変化したらここが実行される
      this.searchShops(this.mapData);
    },
    geoLatlng() {
      this.searchShops(this.geoLatlng);
    }
  },
  methods: {
    searchShops(coord) {
      console.log(coord);
      //親、経由mapから座標もらう
      if (this.freeword != "") {
        //freeword検索時にrangeを入れない為
        this.selected = null;
      }
      const params = {
        keyid: process.env.VUE_APP_GNAVI, //.envから取得
        freeword: this.freeword,
        hit_per_page: 20, //検索結果の表示数
        lunch: this.lunch ? 1 : 0, //ランチ
        no_smoking: this.no_smoking ? 1 : 0, //禁煙席あり
        card: this.card ? 1 : 0, //カード利用
        private_room: this.private_room ? 1 : 0, //個室
        parking: this.parking ? 1 : 0, //駐車場
        kids_menu: this.kids_menu ? 1 : 0, //キッズメニュー
        wifi: this.wifi ? 1 : 0,
        range: this.selected,
        latitude: coord.latitude, //App.vueから受け取り
        longitude: coord.longitude
      };

      axios
        .get("https://api.gnavi.co.jp/RestSearchAPI/v3/", { params })
        .then(response => {
          console.log("axios");
          console.log(response);
          this.shops = response.data.rest;
          this.$emit("coordData", this.shops); //親に渡す$emit(渡すときの名前, 渡すもの)
          this.freeword = "";
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
</style>