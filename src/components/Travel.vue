<template>
  <div>
    <menuList></menuList>
    <h1>楽天トラベル</h1>
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
  }

}
</script>

<style>

</style>
