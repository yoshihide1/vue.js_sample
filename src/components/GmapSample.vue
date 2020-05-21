<template>
  <div>
   <div class="map" ref="googleMap"></div>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
export default {
  name: 'Map',
  data() {
    return {
      google: null,
      mapConfig: {
        center: {
          lat: 35.68944,
          lng: 139.69167
        },
        zoom: 8,
      }
    }
  },
  async mounted() {
    this.google = await GoogleMapsApiLoader({
      apiKey: process.env.VUE_APP_GOOGLE,
    })
    this.initializeMap()
  },
  methods: {
    initializeMap() {
      new this.google.maps.Map(this.$refs.googleMap, this.mapConfig)
    }
  }

}
</script>

<style>
.map {
  width: 100%;
  height: 300px;
}
</style>