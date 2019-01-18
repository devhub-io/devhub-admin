<template>
  <div>
    <el-input-number v-model="topic_id" placeholder="topic_id"/>
    <el-input v-model="url" placeholder="url"/>
    <el-input v-model="text" type="textarea" placeholder="text" />
    <el-button v-loading="loading" @click="click">Submit</el-button>
    <pre>{{ res }}</pre>
  </div>
</template>

<script>
import {
  fetchEcosystemCollection
} from '@/api/ecosystem'

export default {
  data() {
    return {
      topic_id: 0,
      url: '',
      text: '',
      res: '',
      loading: false
    }
  },
  methods: {
    click() {
      this.loading = true
      fetchEcosystemCollection({ url: this.url, text: this.text, topic_id: this.topic_id }).then(res => {
        this.res = res
        this.loading = false
      })
    }
  }
}
</script>
