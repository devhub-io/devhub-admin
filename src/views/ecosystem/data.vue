<template>
  <div class="app-container">
    <el-button v-loading="syncLoading" type="primary" icon="el-icon-tickets" @click="sync">Awesome List Sync</el-button>
  </div>
</template>

<script>
import {
  crawlerEcosystemCollection
} from '@/api/ecosystem'

export default {
  data() {
    return {
      syncLoading: false
    }
  },
  methods: {
    sync() {
      this.syncLoading = true
      crawlerEcosystemCollection({}).then(() => {
        this.syncLoading = false
      }).catch(e => {
        this.syncLoading = false
        this.$message.error(e.message)
      })
    }
  }
}
</script>
