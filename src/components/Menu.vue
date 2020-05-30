<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#" class="ml-1">
        Oltower
        <b-button variant="outline-success" class="geolocation ml-1" @click="geoLocation">現在地取得</b-button>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link to="/">
              <b-button variant="outline-success">Home</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/gnavi">
              <b-button variant="outline-success">Gnavi</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/travel">
              <b-button variant="outline-success">Travel</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/sightseeing">
              <b-button variant="outline-success">Sightseeing</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/weather">
              <b-button variant="outline-success">Weather</b-button>
            </router-link>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right class="mr-5">
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item>
              <router-link to="/mypage">
                <b-button variant="success">マイページ</b-button>
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <signOut></signOut>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import signOut from "@/components/SignOut";
export default {
  components: {
    signOut
  },
  data() {
    return {};
  },
  methods: {
    geoLocation() {
      //現在地取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.success);
      } else {
        alert("端末が対応していません");
      }
    },
    success(position) {
      const geoLatlng = position.coords;
      const latLng = {
        latitude: geoLatlng.latitude,
        longitude: geoLatlng.longitude,
        id: 5
      }
      this.$store.commit("geoLatLng", latLng);
      this.$store.commit("marker", latLng);
    }
  }
};
</script>

<style>
</style>