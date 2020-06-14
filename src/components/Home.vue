<template>
  <div id="container">
    <b-container fluid class="px-0">
      <div class="home">
        <menuList></menuList>
        <gmap></gmap>
      </div>
    </b-container>
    <b-container fluid class="home px-0">
      <b-row class="text-center">
        <weather></weather>
      </b-row>
    </b-container>
    <div>
      <b-tabs content-class="mt-2 mb-3" fill>
        <b-tab title="食事">
          <gnavi></gnavi>
        </b-tab>
        <b-tab title="宿泊">
          <travel></travel>
        </b-tab>
        <b-tab title="観光">
          <sightseeing></sightseeing>
        </b-tab>
        <b-tab title="ルート">
          <root></root>
        </b-tab>
        <b-tab title="お気に入り">
          <myPage></myPage>
        </b-tab>
      </b-tabs>
    </div>

    <div class="scroll-top" v-show="position > 500" @click="scrollTop">
      <i class="fas fa-angle-double-up fa-lg"></i>
    </div>
  </div>
</template>

<script>
import menuList from "@/components/Menu";
import gmap from "@/components/Gmap";
import weather from "@/components/Weather";
import gnavi from "@/components/Gnavi";
import travel from "@/components/Travel";
import root from "@/components/Root";
import myPage from "@/components/MyPage";
import sightseeing from "@/components/Sightseeing";
export default {
  components: {
    menuList,
    gmap,
    weather,
    gnavi,
    travel,
    root,
    myPage,
    sightseeing
  },
  data() {
    return {
      position: null
    };
  },
  mounted() {
    document.onscroll = () => {
      this.position =
        document.documentElement.scrollTop || document.body.scrollTop;
    };
  },
  methods: {
    scrollTop() {
      scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style>
#container {
  background-color: #332015;
}
.scroll-top {
  animation: fadeIn 1s ease 0s 1 normal;
  position: fixed;
  bottom: 20px;
  right: 30px;
  font-size: 5vw;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.nav-fill .nav-item {
  color: white;
  background-color: #ff6a0d;
  background-image: linear-gradient(123deg, #ff6a0d 0%, #ec2e2e 100%);
  border: 1px solid #332015;
  border-radius: 10%;
}
.nav-fill .nav-item a {
  color: white;
}
</style>