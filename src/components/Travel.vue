<template>
  <div>
    <menuList></menuList>
    <h1>楽天トラベル</h1>
    <button @click="check">UID</button>
  </div>
</template>

<script>
import firebase from "firebase"
import "firebase/firestore"
import menuList from "@/components/Menu"
export default {
  components: {
    menuList,
    
  },
  data() {
    return {
      uid: firebase.auth().currentUser.uid
    }
  },
  methods: {
    check() {//test用ユーザーuid取得
    console.log(this.uid)
      // console.log(firebase.auth().currentUser.uid)
      // if (firebase.auth().currentUser !== null) 
      //   console.log("user id: " + firebase.auth().currentUser.uid);
    }
  }

}
</script>

<style>

</style>
1wd59H8ebYWaOkDpkFW7
 EN88ReJaEKf5ypKLFhhS
 SsPGpl46QYQ7qsC3EsmR
 jR3jO0f0JE9BJhcsGGKM
 xXaqC6gK4tBrPXrKlsRj