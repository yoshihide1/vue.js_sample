<template>
  <b-container>
    
    <b-row align-h="center">
      <router-link to="/mypage">
        <b-col class="my-2">
          <b-button variant="success" size="lg">マイページ</b-button>
        </b-col>
      </router-link>
    </b-row>
    <b-row align-h="center">
      <router-link to="/gnavi">
        <b-col class="my-2">
          <b-button class="px-5" variant="success" size="lg">食事</b-button>
        </b-col>
      </router-link>
    </b-row>
    <b-row align-h="center">
      <router-link to="/travel">
        <b-col class="my-2">
          <b-button class="px-5" variant="success" size="lg">宿泊</b-button>
        </b-col>
      </router-link>
    </b-row>
    <b-row align-h="center">
      <router-link to="/sightseeing">
        <b-col class="my-2">
          <b-button class="px-5" variant="success" size="lg">観光</b-button>
        </b-col>
      </router-link>
    </b-row>
    <b-row align-h="center">
      <router-link to="/weather">
        <b-col class="my-2">
          <b-button class="px-5" variant="success" size="lg">天気</b-button>
        </b-col>
      </router-link>
    </b-row>
    <b-row>
      <signOut></signOut>
    </b-row>
    <!-- <gmap></gmap>
    <gnavi></gnavi>
    <travel></travel> -->
  </b-container>
</template>

<script>
// import gmap from "@/components/Gmap"
// import gnavi from "@/components/Gnavi"
// import travel from "@/components/Travel"
import signOut from "@/components/SignOut";
export default {
  components: {
    // gmap,
    // gnavi,
    // travel,
    signOut
  }
};
</script>

<style>
</style>