<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  mounted() {
    this.$socket.on('message', msg => {
      this.$notify(msg.data.payload)
    })
  }
}
</script>
