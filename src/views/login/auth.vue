<script>
export default {
  name: 'Auth',
  created() {
    // const hash = window.location.search.slice(1)
    // window.opener.location.href = window.location.origin + '/login#' + hash
    // window.close()
    const token = this.$route.query.token || ''
    if (token.length > 0) {
      this.$store.dispatch('LoginByToken', token).then(() => {
        this.$router.push({ path: '/' })
      }).catch(() => {
        this.$router.push({ path: '/login' })
      })
    } else {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
