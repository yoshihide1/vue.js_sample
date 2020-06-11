<template>
  <div>
    <b-container fluid class="px-0">
      <menuList></menuList>
      <b-row align-h="center">
        <h1>マイページ</h1>
      </b-row>
      <b-row align-h="center">
        <b-button variant="secondary" @click="deleteData(), deleteAlert()">選択した物を削除</b-button>
      </b-row>
      <b-alert v-model="alert" show variant="warning">削除しました</b-alert>
    </b-container>
    <div v-for="(shop, index) in userData" :key="index">
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
export default {
  name: "MyPage",
  components: {
    menuList
  },
  data() {
    return {
      alert: false,
      select: [],
      name: "",
      shopUrl: null,
      imageUrl: null,
      userData: [],
      db: firebase.firestore(),
      uid: firebase.auth().currentUser.uid,
      docId: []
    };
  },
  created() {
    this.getData();
  },
  watch: {
    //route変更で実行
    $route: "getData"
  },
  methods: {
    deleteAlert() {
      this.alert = !this.alert;
      setTimeout(() => {
        this.alert = !this.alert;
      }, 1000);
    },
    getData() {
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
    deleteData() {
      console.log(this.docId);
      this.select.forEach(i => {
        this.db
          .collection("star")
          .doc(this.docId[i])
          .delete()
          .then(() => {
            this.userData = [];
            this.getData();
            console.log([i]);
            console.log("削除");
          })
          .catch(() => {
            console.log("error");
          });
      });
    }
  }
};
</script>

<style scoped>
</style>