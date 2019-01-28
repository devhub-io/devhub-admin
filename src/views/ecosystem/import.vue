<template>
  <div class="app-container">
    <h1>{{ title }}</h1>
    <el-form>
      <el-form-item>
        <el-input v-model="url" placeholder="http://"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="text" type="textarea" placeholder="Markdown" class="markdown" />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" type="primary" @click="click">Import Collections</el-button>
        <el-button type="info" @click="$router.back()">Back</el-button>
      </el-form-item>
    </el-form>
    <pre>{{ res }}</pre>
  </div>
</template>

<script>
import {
  importEcosystemCollection
} from '@/api/ecosystem'

export default {
  data() {
    return {
      topic_id: 0,
      title: '',
      url: '',
      text: '',
      res: '',
      loading: false
    }
  },
  mounted() {
    this.title = this.$route.query.title || '--'
    this.topic_id = this.$route.params.id || 0
  },
  methods: {
    click() {
      this.loading = true
      importEcosystemCollection({ url: this.url, text: this.text, topic_id: this.topic_id }).then(res => {
        this.res = res
        this.loading = false
      })
    }
  }
}
</script>
