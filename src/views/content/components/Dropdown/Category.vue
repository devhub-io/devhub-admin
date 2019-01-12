<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      栏目<i class="el-icon-caret-bottom el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-cascader
        :options="categories"
        v-model="category"
        :props="optionProps"
        change-on-select/>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getCategoriesTree } from '@/api/content'

export default {
  props: {
    value: {
      required: true,
      default: () => [],
      type: Array
    },
    siteId: {
      required: true,
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      categories: [],
      optionProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      }
    }
  },
  computed: {
    category: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    siteId: function() {
      this.getCategories()
    }
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      getCategoriesTree({ site_id: this.siteId }).then(res => {
        if (res.code === 200) {
          this.categories = res.data
        }
      })
    }
  }
}
</script>
