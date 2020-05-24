<template>
    <b-container>
      <b-row>
        <router-link to="/mypage">
          <b-col class="my-2">
            <b-button variant="success" size="lg">マイページ</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <router-link to="/gnavi">
          <b-col class="my-2">
            <b-button variant="success" size="lg">食事</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <router-link to="/travel">
          <b-col lg="4" class="my-2">
            <b-button variant="success" size="lg">宿泊</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <router-link to="/sightseeing">
          <b-col lg="4" class="my-2">
            <b-button variant="success" size="lg">観光</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <router-link to="/weather">
          <b-col lg="4" class="my-2">
            <b-button variant="success" size="lg">天気</b-button>
          </b-col>
        </router-link>
      </b-row>
      <b-row>
        <signOut></signOut>
      </b-row>
    </b-container>
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