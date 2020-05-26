<template>
  <b-container>
    <b-row align-h="center" class="my-2">
      <b-button @click="signOut" variant="danger">サインアウト</b-button>
    </b-row>
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