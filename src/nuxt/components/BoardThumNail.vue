<template>
  <NuxtLink :to = "`/dashboard/${board.id}?disaster_control_number=1`" class = "boardThumbNail">
    <div class = "boardThumbNailDiv">
      {{board.title}}
    </div>
  </NuxtLink>
</template>

<script>
  export default {
    props:['board'],
  }
</script>

<style lang="scss" scoped>

</style>