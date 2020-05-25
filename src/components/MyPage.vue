<template>
  <div>
    <menuList></menuList>
    <h1>マイページ</h1>
    <button @click="getData">データ取得</button>
    <button @click="deleteData">削除</button>
    <div v-for="(shop, index) in userData" :key="index">
      <b-card-group deck>
        <b-card border-variant="success" :header="shop.name" align="center">
          <b-card-text>
            <p>住所:{{shop.address}}</p>
            <p>電話:{{shop.tel}}</p>
            <p>営業時間:{{shop.opentime}}</p>
            <button @click="deleteData">
              削除
              <input type="checkbox" :value="index" v-model="select" />
            </button>
            <p>{{select}}</p>
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
  components: {
    menuList
  },
  data() {
    return {
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
  methods: {
    test(index) {
      console.log(index);
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
      this.db
        .collection("star")
        .doc(this.docId[this.select])
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