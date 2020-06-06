<template>
  <div>
    <b-container>
      <b-row align-h="center">
      <h3>ルート</h3>
      </b-row>
      <div v-for="(marker, index) in myMarker" :key="index">
        <b-row class="mt-1">
          <b-col cols="2">
            <b-button block variant="outline-success" v-if="index !== 0" @click="upSort(index)">up</b-button>
          </b-col>
          <b-col cols="2">
            <b-button block variant="outline-success" v-if="index !== myMarker.length-1" @click="downSort(index)">down</b-button>
          </b-col>
          <b-col>{{ index+1 }}:{{ marker.name }}</b-col>
          <b-col cols="2">
            <b-button block variant="outline-danger" @click="deleteRoot(index)">削除</b-button>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "root",
  data() {
    return {
      rootIndex: []
    };
  },
  computed: {
    ...mapState(["myMarker"]),
    ...mapGetters(["filterMarker"])
  },
  methods: {
    upSort(index) {
      this.rootIndex = index;
      this.myMarker.splice(
        index - 1,
        2,
        this.myMarker[index],
        this.myMarker[index - 1]
      );
    },
    downSort(index) {
      this.myMarker.splice(
        index,
        2,
        this.myMarker[index + 1],
        this.myMarker[index]
      );
    },
    deleteRoot(index) {
      this.$store.commit(
        "deleteMarker",
        this.filterMarker(this.myMarker[index].name)
      );
    }
  }
};
</script>

<style>
</style>