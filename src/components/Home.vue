<template>
  <div>
    <b-container>
      <b-row>
        <router-link to="/gnavi">
          <b-col class="my-3">
            <b-button variant="success" size="lg">食事</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <router-link to="/rakuten">
          <b-col lg="4" class="my-3">
            <b-button variant="success" size="lg">宿泊</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <router-link to="/weather">
          <b-col lg="4" class="my-3">
            <b-button variant="success" size="lg">天気</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <signOut></signOut>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import signOut from "@/components/SignOut";
export default {
  components: {
    signOut
  }
};
</script>

<style>
</style>