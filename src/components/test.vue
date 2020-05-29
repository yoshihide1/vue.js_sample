<template>
  <div>
    <menuList></menuList>
   <b-container>
     <b-row>
       <b-col>
         <gmap></gmap>
       </b-col>
       <b-col>
         <weather></weather>
       </b-col>
     </b-row>
     <b-row>
       <b-col>
         <travel></travel>
       </b-col>
       <b-col>
         <gnavi></gnavi>
       </b-col>
     </b-row>
   </b-container>
  </div>
</template>

<script>
import menuList from "@/components/Menu"
 import gmap from "@/components/Gmap"
import gnavi from "@/components/Gnavi"
import travel from "@/components/Travel"
import weather from "@/components/Weather"
export default {
components: {
  menuList,
  gmap,
  gnavi,
  travel,
  weather
}
}
</script>

<style>

</style>