<template>
  <div id="hotel">
    <b-container>
      <b-row class="py-1" align-h="center">
        <h3>宿泊</h3>
      </b-row>
      <b-row class="py-1" align-h="center">
        <p class="font-white">{{error}}</p>
      </b-row>

      <div v-for="(hotel, index) in hotels" :key="index">
        <div>
          <b-row align-h="center">
            <b-col>
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle="'accordion-' + index" variant="outline-secondary">
                    <b-row>
                      <b-col cols="3">
                        <b-img :src="hotel.hotelThumbnailUrl" />
                        <b-img :src="hotel.roomThumbnailUrl" />
                      </b-col>
                      <b-col>
                        <span class="hotel-name">{{ hotel.hotelName }}</span>
                        <p>
                          <b-badge variant="danger">
                            <span class="font">電話</span>
                          </b-badge>
                          {{ hotel.telephoneNo }}
                        </p>
                      </b-col>
                    </b-row>
                  </b-button>
                </b-card-header>
                <b-collapse :id="'accordion-' + index" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <b-row>
                        <b-form-rating
                          :value="hotel.reviewAverage"
                          show-value
                          variant="warning"
                          class="mb-2"
                        ></b-form-rating>
                        <p>{{ hotel.access }}</p>
                      </b-row>
                      <b-row align-h="center">
                        <b-img :src="hotel.hotelImageUrl" fluid alt="外観"></b-img>
                        <b-img :src="hotel.roomImageUrl" fluid alt="室内"></b-img>
                      </b-row>
                      <b-row align-h="center">
                        <b-button size="md" class="px-5 py-2 mt-2" @click="starSet(index)">MyPage</b-button>
                        <b-button size="md" class="px-5 py-2 mt-2" @click="hotelLatLng(hotel)">マーカー</b-button>
                        <b-button
                          v-b-toggle="'collapse-' + index + '-inner'"
                          size="md"
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
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-container>
    <b-row align-h="center">
      <small>
        <a href="https://webservice.rakuten.co.jp/" target="_blank">Supported by Rakuten Developers</a>
      </small>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import { mapState } from "vuex";
export default {
  name: "Travel",

  data() {
    return {
      functions: firebase.functions(),
      hotelData: [],
      hotelList: [],
      error: ""
    };
  },

  computed: {
    ...mapState(["hotels", "latLngC", "latLng"])
  },

  watch: {
    latLngC() {
      this.searchHotels(this.latLngC);
    },
    latLng() {
      this.searchHotels(this.latLng);
    }
  },

  methods: {
    starSet(index) {
      const hotel = this.hotels[index];
      const star = this.functions.httpsCallable("star");
      console.log(hotel);
      star({
        id: 2,
        category: "宿",
        name: hotel.hotelName,
        address: `${hotel.address1}${hotel.address2}`,
        tel: hotel.telephoneNo,
        image: hotel.hotelThumbnailUrl,
        url: `施設詳細${hotel.hotelInformationUrl}宿泊プラン${hotel.planListUrl}`,
        latitude: hotel.latitude,
        longitude: hotel.longitude
      })
        .then(() => {
          console.log("(宿)マイページ登録OK");
          this.$store.commit("myPage", hotel.hotelName);
        })
        .catch(() => {
          console.log("error");
          alert("登録に失敗しました");
        });
    },
    //宿泊施設の検索
    searchHotels(latLng) {
      const params = {
        applicationId: process.env.VUE_APP_RAKUTEN,
        latitude: latLng.latitude,
        longitude: latLng.longitude,
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
          this.error = "";
          this.hotelData = [];
          this.hotelList = response.data.hotels;
          this.setData();
        })
        .catch(() => {
          this.error = "近くに宿泊施設が見つかりませんでした。";
          this.hotelData = [];
          //前の検索結果を画面から消すため
          this.$store.commit("hotelsData", this.hotelData);
        });
    },
    setData() {
      for (let i in this.hotelList) {
        this.hotelData.push(this.hotelList[i].hotel[0].hotelBasicInfo);
      }
      this.$store.commit("hotelsData", this.hotelData);
    },
    hotelLatLng(hotel) {
      const data = {
        name: hotel.hotelName,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        id: 2 //マーカー識別の為
      };
      this.$store.commit("newMarker", data);
    }
  }
};
</script>

<style>
#hotel {
  background-color: #332015;
  color: black;
}
#hotel-list {
  background-color: #ff6a0d;
  background-image: linear-gradient(123deg, #ff6a0d 0%, #ec2e2e 100%);
}
.font {
  font-size: 1rem;
}
.title-text {
  font-size: 1.3rem;
}
.hotel-name {
  font-size: 1.5rem;
}
</style>
