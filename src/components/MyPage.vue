<template>
  <div>
    <b-container fluid class="px-0">
      <menuList></menuList>
      <b-row align-h="center">
        <h3>お気に入り</h3>
      </b-row>
      <b-row align-h="center">
        <b-button variant="secondary" @click="deleteData(), deleteAlert()">選択した物を削除</b-button>
      </b-row>
      <b-alert v-model="alert" show variant="warning">削除しました</b-alert>
    </b-container>
    <div class="my-list" v-for="(shop, index) in userData" :key="index">
      <b-card-group deck>
        <b-card border-variant="success" :header="shop.name" align="center">
          <b-card-text>
            <p>住所:{{shop.address}}</p>
            <p>電話:{{shop.tel}}</p>
            <p>営業時間:{{shop.opentime}}</p>
            <input type="checkbox" :value="index" v-model="select" />
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import menuList from "@/components/Menu";
import { mapState } from "vuex";
export default {
  name: "MyPage",

  components: {
    menuList
  },

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
      docId: []
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
    deleteAlert() {
      this.alert = !this.alert;
      setTimeout(() => {
        this.alert = !this.alert;
      }, 1000);
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
            console.log(this.docId);
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
            this.userData = [];
            this.getData();
            console.log([index]);
            console.log("削除");
          })
          .catch(() => {
            console.error("error");
          });
      });
    }
  }
};
</script>
<style>
</style>