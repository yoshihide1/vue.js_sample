<template>
  <div>
    <b-container class="bv-example-row" fluid>
      <b-row align-h="center">
        <h3>ルート</h3>
      </b-row>
      <div v-for="(marker, index) in myMarker" :key="index">
        <b-row align-h="center" class="mt-1 text-center" cols="3">
          <b-col align-h="center">
            <b-button-group>
              <b-button variant="outline-success" v-if="index !== 0" @click="upSort(index)">up</b-button>
              <b-button
                variant="outline-success"
                v-if="index !== myMarker.length-1"
                @click="downSort(index)"
              >down</b-button>
            </b-button-group>
          </b-col>
          <b-col block>{{ index+1 }}:{{ marker.name }}</b-col>
          <b-col>
            <b-button variant="outline-danger" @click="deleteRoot(index)">delete</b-button>
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