<template>
  <div>
    <b-button @click="signOut" pill variant="outline-danger">サインアウト</b-button>
  </div>
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