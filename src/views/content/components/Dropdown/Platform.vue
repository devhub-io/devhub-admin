<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      站点({{ sites.length }})
      <i class="el-icon-caret-bottom el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-radio-group v-model="platforms" style="padding: 5px 15px;">
        <el-radio v-for="item in sites" :label="item.id" :key="item.id">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getSites } from '@/api/content'

export default {
  props: {
    value: {
      required: true,
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      sites: []
    }
  },
  computed: {
    platforms: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getSites()
  },
  methods: {
    getSites() {
      getSites().then(res => {
        if (res.code === 200) {
          this.sites = res.data
        }
      })
    }
  }
}
</script>
