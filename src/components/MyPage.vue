<template>
  <div>
    <menuList></menuList>
    <h1>マイページ</h1>
    <button @click="getData">データ取得</button>
    <div v-for="(shop, index) in userData" :key="index">
      <p>・名前:{{shop.name}}</p>
      <p>・住所:{{shop.address}}</p>
      <p>・電話:{{shop.tel}}</p>
      <p>・営業時間:{{shop.opentime}}</p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import menuList from "@/components/Menu";
export default {
  components: {
    menuList
  },
  data() {
    return {
      name: "",
      shopUrl: null,
      imageUrl: null,
      userData: [],
      db: firebase.firestore(),
      uid: firebase.auth().currentUser.uid
    };
  },
  methods: {
    getData() {
      this.db
        .collection("star")
        .where("uid", "==", this.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.userData.push(doc.data());
          });
        })
        .catch(() => {
          console.log("error");
        });
    },
    deleteData() {
      this.db
        .collection("star")
        .doc()
        .where("uid", "==", this.uid)
        .delete()
        .then(() => {
          console.log("削除");
        })
        .catch(() => {
          console.log("error");
        });
    }
  }
};
</script>

<style>
</style>