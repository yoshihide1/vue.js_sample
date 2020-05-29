<template>
  <div>
    <menuList></menuList>
    <gmap></gmap>
    <b-container>
      <div v-for="(hotel, index) in hotels" :key="index">
        <div>
          <b-row align-h="center">
            <b-button v-b-toggle="'collapse-' + index" variant="primary" class="mt-2 button-width">
              <span class="title-text">{{ hotel.hotelName }}/{{ hotel.address1 }}</span>
              <button @click="hotelLatLng(hotel.latitude, hotel.longitude)">マーカー</button>
            </b-button>
            <b-collapse :id="'collapse-' + index " class="mt-2">
              <b-card>
                <b-row>
                  <b-form-rating
                    :value="hotel.reviewAverage"
                    show-value
                    variant="warning"
                    class="mb-2"
                  ></b-form-rating>
                  <p>{{ hotel.access }}</p>
                  <b-img :src="hotel.hotelImageUrl" fluid alt="外観"></b-img>
                  <b-img :src="hotel.roomImageUrl" fluid alt="室内"></b-img>
                </b-row>
                <p>{{ hotel.latitude }}</p>
                <p>{{ hotel.longitude }}</p>
                <b-row align-h="center">
                  <b-button
                    v-b-toggle="'collapse-' + index + '-inner'"
                    size="sm"
                    class="px-5 py-2 mt-2"
                  >詳しく</b-button>
                </b-row>
                <b-collapse :id="'collapse-' + index + '-inner'" class="mt-2">
                  <b-card>
                    <p>
                      <b-badge variant="success">
                        <span class="font">住所</span>
                      </b-badge>
                      {{ hotel.address1 }} {{ hotel.address2 }}
                    </p>
                    <p>
                      <b-badge variant="info">
                        <span class="font">電話</span>
                      </b-badge>
                      {{ hotel.telephoneNo }}
                    </p>
                    <p>
                      <b-badge variant="info">
                        <span class="font">最安値</span>
                      </b-badge>
                      {{ hotel.hotelMinCharge }}(1部屋1泊あたり、税・サービス料込みの最安値の目安)
                    </p>
                    <p>
                      <b-badge variant="info">
                        <span class="font">駐車場</span>
                      </b-badge>
                      {{ hotel.parkingInformation }}
                    </p>
                    <p>
                      <b-badge variant="info">
                        <span class="font">最寄り駅</span>
                      </b-badge>
                      {{ hotel.nearestStation }}
                    </p>
                    <p>
                      <span class="font">ホームページ</span>
                      {{ hotel.hotelInformationUrl }}
                    </p>
                    <p>
                      <span class="font">宿泊プラン</span>
                      {{ hotel.planListUrl }}
                    </p>
                    <p>
                      <span class="font"></span>
                    </p>
                  </b-card>
                </b-collapse>
              </b-card>
            </b-collapse>
          </b-row>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
import menuList from "@/components/Menu";
import gmap from "@/components/Gmap";
import { mapState } from "vuex";
export default {
  components: {
    menuList,
    gmap
  },
  computed: {
    ...mapState(["hotels", "latLng"])
  },
  data() {
    return {
      check: [],
      uid: firebase.auth().currentUser.uid,
      hotelData: [],
      hotelList: []
    };
  },
  watch: {
    latLng() {
      this.getData();
    }
  },
  methods: {
    getData() {
      const params = {
        applicationId: process.env.VUE_APP_RAKUTEN,
        latitude: this.latLng.latitude, //store
        longitude: this.latLng.longitude,
        largeClassCode: "japan",
        datumType: 1, //測地系のタイプ
        serchRadius: 3 //検索範囲0.1~3.0まで(km)
      };
      axios
        .get(
          "https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426?format=json",
          { params }
        )
        .then(response => {
          this.hotelData = [];
          this.hotelList = response.data.hotels;
          this.setData();
        });
    },
    setData() {
      for (let i in this.hotelList) {
        this.hotelData.push(this.hotelList[i].hotel[0].hotelBasicInfo);
      }
      this.$store.commit("hotelsData", this.hotelData);
    },
    hotelLatLng(latitude, longitude) {
      console.log(latitude, longitude);
      const latLng = {
        latitude: latitude,
        longitude: longitude,
        id: 2
      };
      this.$store.commit("marker", latLng);
    }
  }
};
</script>

<style>
.font {
  font-size: 1rem;
}
.title-text {
  font-size: 1.3rem;
}
</style>
