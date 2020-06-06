<template>
  <div>
    <menuList></menuList>
    <b-container fluid class="px-0">
      <div class="home">
        <gmap></gmap>
        <weather class="mb-1"></weather>
      </div>
    </b-container>
    <div>
      <b-tabs content-class="mt-3" fill>
        <b-tab title="食事" active>
          <gnavi></gnavi>
        </b-tab>
        <b-tab title="宿泊">
          <travel></travel>
        </b-tab>
        <b-tab title="ルート">
          <root></root>
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
import root from "@/components/Root"
export default {
  components: {
    menuList,
    gmap,
    weather,
    gnavi,
    travel,
    root
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
.home {
  background-color: #303030;
}
.scroll-top {
  animation: fadeIn 1s ease 0s 1 normal;
  position: fixed;
  bottom: 20px;
  right: 20px;
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
</style>