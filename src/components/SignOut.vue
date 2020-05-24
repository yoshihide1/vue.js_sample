<template>
  <b-container>
    <b-button @click="signOut" variant="danger">サインアウト</b-button>
  </b-container>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {};
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/sign");
        });
    }
  }
};
</script>
<style>
</style>