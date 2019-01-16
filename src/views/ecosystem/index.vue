<template>
  <div class="app-container">

    <!--Tools-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" >
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="searchForm.slug" placeholder="Input..."/>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="Select...">
            <el-option
              v-for="item in status_lists"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getEcosystems">Query</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('searchForm')">Clear</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--Sort-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="sortForm" :model="sortForm" :inline="true" >
        <el-form-item label="Sort" prop="sort_type">
          <el-select v-model="sortForm.sort_type" clearable placeholder="Select..." @change="sort">
            <el-option
              v-for="item in sort_type"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>

    <!--List-->
    <el-table v-loading="tableLoading" ref="multipleTable" :data="list" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="id" label="#" width="100" />
      <el-table-column prop="title" label="Title" width="100" />
      <el-table-column prop="slug" label="Slug" width="130" />
      <el-table-column prop="statistics" label="Statistics" width="200">
        <template slot-scope="scope">
          <div>view_number: {{ scope.row.view_number }}</div>
          <div>sort: {{ scope.row.sort }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="Time" width="200">
        <template slot-scope="scope">
          <div>updated_at</div>
          <div>{{ scope.row.updated_at }}</div>
          <div>created_at</div>
          <div>{{ scope.row.created_at || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatStatus" prop="status" label="Status" align="center" width="100"/>
      <el-table-column prop="homepage" label="Homepage" width="150"/>
      <el-table-column prop="github" label="Github" width="150" />
      <el-table-column prop="wiki" label="Wiki" width="150" />
      <el-table-column label="Operating" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="preview(scope.row.slug)">Preview</el-button>
            <el-button size="small" @click="showEdit(scope.row)">Edit</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--Pagination-->
    <el-col :span="24" class="toolbar">
      <el-button size="mini" type="primary" style="float: left;" @click="batchCheck()">Enable</el-button>
      <el-pagination :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </el-col>

    <!--Edit-->
    <el-dialog :visible.sync="editVisible" :title="`Edit ${editRow.title}`" size="tiny">
      <el-form ref="paymentOrderForm" :model="editForm" label-width="120px">
        <el-form-item label="Status" prop="status">
          <el-select v-model="editForm.status" clearable placeholder="Select...">
            <el-option
              v-for="item in status_lists"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">Cancel</el-button>
        <el-button :loading="editLoading" type="primary" @click="editSubmit">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEcosystems, switchEcosystem, editEcosystem } from '@/api/ecosystem'

export default {
  data() {
    return {
      // Status
      status_lists: [
        { value: 0, name: 'Disable' },
        { value: 1, name: 'Enable' },
        { value: 2, name: 'Delete' }
      ],
      sort_type: [
        { value: 'view_number', name: 'view_number' },
        { value: 'updated_at', name: 'updated_at' },
        { value: 'sort', name: 'sort' }
      ],

      // search
      searchForm: {
        slug: '',
        status: ''
      },

      // sort
      sortForm: {
        sort_type: ''
      },

      // batch
      tableSelections: [],

      // data
      list: [],
      pageSize: 10,
      total: 0,
      page: 1,
      tableLoading: false,

      // edit
      editForm: {
        status: ''
      },
      editVisible: false,
      editLoading: false,
      editRow: {}
    }
  },
  mounted() {
    this.getEcosystems()
  },
  methods: {

    preview(slug) {
      window.open(`${process.env.WEB_URL}/ecosystem/${slug}`)
    },

    sort() {
      this.getEcosystems()
    },

    formatStatus(row) {
      for (let i = 0; i < this.status_lists.length; i++) {
        if (this.status_lists[i].value === row.status) {
          return this.status_lists[i].name
        }
      }
      return '--'
    },

    // 验证订单状态
    checkOrderStatus: function(selections) {
      let result = false
      for (const i in selections) {
        if (selections[i].goods_type === 3) {
          result = true
          break
        }
      }
      return result
    },

    handleSelect: function(selection, row) {
      this.tableSelections = selection
    },

    handleSelectAll: function(selection) {
      this.tableSelections = selection
    },

    // batch
    batchCheck: function() {
      const id = []
      this.tableSelections.forEach(i => {
        id.push(i.id)
      })
      if (id.length > 0) {
        const params = {
          id,
          status: 1
        }
        switchEcosystem(params).then(() => {
          this.getEcosystems()
        })
      }
    },

    // List
    getEcosystems: function() {
      const param = {
        page: this.page,
        limit: this.pageSize
      }
      if (this.searchForm.slug !== '') {
        param.slug = this.searchForm.slug
      }
      if (this.searchForm.type !== '') {
        param.type = this.searchForm.type
      }
      if (this.searchForm.status !== '') {
        param.status = this.searchForm.status
      }
      if (this.sortForm.sort_type !== '') {
        param.sort_type = this.sortForm.sort_type
      }

      this.tableLoading = true
      getEcosystems(param).then(res => {
        this.list = res.rows
        this.total = res.count
        this.tableLoading = false
      })
    },

    handleSizeChange: function(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getEcosystems()
      }
    },

    handleCurrentChange: function(page) {
      this.page = page
      this.getEcosystems()
    },

    resetForm(formName) {
      this.tableSelections = []
      this.$refs[formName].resetFields()
      this.getEcosystems()
    },

    editSubmit() {
      if (this.editForm.status !== '') {
        const params = {
          id: this.editRow.id,
          status: this.editForm.status
        }
        editEcosystem(params).then(() => {
          this.editVisible = false
          this.getEcosystems()
        })
      }
    },
    showEdit(row) {
      this.editForm.status = ''
      this.editRow = row
      this.editVisible = true
    }
  }
}
</script>

<style scoped>

</style>
