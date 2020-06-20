<template>
  <div>
    <b-container fluid class="px-0">
      <b-row align-h="center">
        <h3>お気に入り</h3>
      </b-row>
      <b-row align-h="center">
        <b-button variant="secondary" @click="deleteData">選択した物を削除</b-button>
      </b-row>
    </b-container>
    <div class="my-list" v-for="(data, index) in userData" :key="index">
      <b-card-group deck>
        <b-card border-variant="success" :header="data.name" align="center">
          <b-card-text>
            <p>住所:{{data.address}}</p>
            <p>電話:{{data.tel}}</p>
            <p>営業時間:{{data.opentime}}</p>
            <b-button size="md" class="px-5 py-2 mt-2" @click="setMarker(data)">マーカー</b-button>
            <p>
              <input type="checkbox" :value="index" v-model="select" />
            </p>
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import { mapState } from "vuex";
export default {
  name: "MyPage",

  data() {
    return {
      alert: false,
      select: [],
      shopUrl: null,
      imageUrl: null,
      userData: [],
      db: firebase.firestore(),
      uid: firebase.auth().currentUser.uid,
      displayName: firebase.auth().currentUser.displayName,
      docId: [],
      showDelete: false
    };
  },

  computed: {
    ...mapState(["alternatives"])
  },

  watch: {
    //お気に入り登録された時に即座にページに反映させる
    alternatives() {
      console.log("更新");
      this.getData();
    }
  },

  created() {
    //ページが開かれたときにお気に入りデータの取得
    this.getData();
  },

  methods: {
    setMarker(data) {
      const latLng = {
        id: data.id,
        latitude: data.latitude,
        longitude: data.longitude
      };
      this.$store.commit("newMarker", latLng);
    },
    //お気に入りをfirestoreから取得
    getData() {
      console.log("mypage");
      this.userData = [];
      this.docId = [];
      this.db
        .collection("star")
        .where("uid", "==", this.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.userData.push(doc.data());
            this.docId.push(doc.id);
          });
        })
        .catch(() => {
          console.log("error");
        });
    },
    //選んだ項目のindexを取得して一致するものを削除
    deleteData() {
      this.select.forEach(index => {
        this.db
          .collection("star")
          .doc(this.docId[index])
          .delete()
          .then(() => {
            this.select = []
            this.userData = [];
            //時間を遅らせないと更新されていないため
            setTimeout(() => {
            this.getData();
            },1000)
          })
          .catch(() => {
            console.log("error");
          });
      });
      console.log("削除");
      this.$store.commit("deleteAlert", this.select);
    }
  }
};
</script>
<style>
</style>