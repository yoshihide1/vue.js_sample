<template>
  <div>
    <b-container fluid>
      <b-row class="py-1" align-h="center">
        <h3>遊び・観光</h3>
        <select v-model="selected" @change="searchPlace">
          <option value>選択してください</option>
          <option v-for="option in options" :value="option.eName" :key="option.id">{{option.jName}}</option>
        </select>
        <p>{{selected}}</p>
      </b-row>
      <b-row align-h="center" id="shop-list">
        <div class="font-sample" v-for="(place, index) in places" :key="index">
          <b-card-group>
            <b-col class="mt-2">
              <b-card
                bg-variant="secondary"
                border-variant="light"
                text-variant="white"
                :title="place.name"
                :img-src="place.photos ? place.photos[0].getUrl() : noImage"
                :img-alt="place.name"
                img-top
                tag="article"
                style="max-width: 17rem;"
              >
                <b-card-text>
                  <b-button-group>
                    <b-button id="button-group" variant="secondary" @click="starSet(index)">マイページ</b-button>
                    <b-button id="button-group" variant="secondary" @click="placeLatLng(place)">マーカー</b-button>
                  </b-button-group>
                  <p>住所{{ place.vicinity }}</p>
                  <b-form-textarea id="textarea-rows" class="p-0" rows="4" placeholder="説明～？"></b-form-textarea>
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
import { mapState } from "vuex";
import firebase from "firebase";

export default {
  components: {},
  computed: {
    ...mapState(["places", "latLng", "latLngC", "map", "google", "place"])
  },

  data() {
    return {
      selected: "shopping_mall", //デフォルト
      options: [
        { id: 1, eName: "amusement_park", jName: "遊び場" },
        { id: 2, eName: "aquarium", jName: "水族館" },
        { id: 3, eName: "zoo", jName: "動物園" },
        { id: 4, eName: "art_gallery", jName: "美術館" },
        { id: 5, eName: "campground", jName: "キャンプ場" },
        { id: 6, eName: "museum", jName: "博物館" },
        { id: 7, eName: "shopping_mall", jName: "ショッピングモール" }
      ],
      functions: firebase.functions(),
      noImage: "/images/no_image.jpg"
    };
  },
  watch: {
    latLng() {
      this.searchPlace(this.latLng);
    },
    latLngC() {
      this.searchPlace(this.latLngC);
    }
  },

  methods: {
    starSet(index) {
      const place = this.places[index];
      const star = this.functions.httpsCallable("star");
      console.log(place);
      star({
        id: 3,
        category: "遊び",
        name: place.name,
        address: place.vicinity,
        image: place.photos ? place.photos[0].getUrl() : this.noImage,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      })
        .then(() => {
          console.log("(遊)マイページ登録OK");
          this.$store.commit("myPage", place.name);
        })
        .catch(() => {
          console.error("error");
        });
    },
    searchPlace(latLng) {
      console.log(latLng);
      this.place.nearbySearch(
        {
          location: new this.google.maps.LatLng(
            latLng.latitude,
            latLng.longitude
          ),
          type: this.selected, //選択出来るように
          radius: 6000
        },
        result => {
          console.log(result);
          this.$store.commit("placeData", result);
        }
      );
    },

    placeLatLng(place) {
      const data = {
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        id: 3
      };
      this.$store.commit("newMarker", data);
    }
  }
};
</script>

<style>
h3 {
  color: white;
}
.font-sample {
  color: white;
}
#button-group {
  border: 1px solid white;
}
</style>