<template>
  <div>
    <menuList></menuList>
    <h1>ここは天気情報</h1>
    <signOut></signOut>
  </div>
</template>

<script>
import menuList from "@/components/Menu";
import signOut from "@/components/SignOut"
export default {
  components: {
    menuList,
    signOut
  }
};
</script>

<style>
</style>