<template>
  <div>
    <b-navbar id="navbar" toggleable="lg" type="dark" variant="dark" fill>
      <b-navbar-brand href="#" class="ml-1">Oltower</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link to="/">
              <b-button variant="secondary" @click="scrollTop">Home</b-button>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <b-button variant="secondary" class="geolocation" @click="geoLocation">現在地取得</b-button>
          </b-nav-item>
          <gmapSearch></gmapSearch>
          <b-nav-item>
            <h4>
              <b-badge variant="success">TotalTime：{{ time }}分</b-badge>
            </h4>
          </b-nav-item>
          <b-nav-item>
            <h4>
              <b-badge variant="success">TotalDistance：{{ distance }}㎞</b-badge>
            </h4>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right class="mr-1">
            <template v-slot:button-content>
              <em>User</em>
            </template>
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
import gmapSearch from "@/components/GmapSearch";
import { mapState } from "vuex";
export default {
  name: "Menu",

  components: {
    signOut,
    gmapSearch
  },

  data() {
    return {};
  },

  computed: {
    ...mapState(["time", "distance"])
  },

  methods: {
    scrollTop() {
      scrollTo(0, 0);
    },
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
        name: "現在地",
        id: 5 //マーカーの識別の為
      };
      this.$store.commit("geoLatLng", latLng);
      this.$store.commit("newMarker", latLng);
    }
  }
};
</script>

<style>
#navbar {
  position: fixed;
  width: 100%;
  z-index: 100;
  height: 55px;
}
</style>