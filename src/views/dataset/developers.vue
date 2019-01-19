<template>
  <div class="app-container">

    <!--Tools-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" >
        <el-form-item label="Slug" prop="login">
          <el-input v-model="searchForm.login" placeholder="Input..."/>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="searchForm.type" clearable placeholder="Select...">
            <el-option
              v-for="item in type_lists"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
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
          <el-button type="primary" icon="el-icon-search" @click="getDevelopers">Query</el-button>
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
      <el-table-column prop="avatar_url" label="Avatar" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.avatar_url" alt="" width="100">
        </template>
      </el-table-column>
      <el-table-column prop="login" label="Name" width="100" />
      <el-table-column prop="type" label="Type" align="center" width="120" />
      <el-table-column prop="statistics" label="Statistics" width="200">
        <template slot-scope="scope">
          <div>followers: {{ scope.row.followers }}</div>
          <div>following: {{ scope.row.following }}</div>
          <div>view_number: {{ scope.row.view_number }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="Time" width="200">
        <template slot-scope="scope">
          <div>fetched_at</div>
          <div>{{ scope.row.fetched_at }}</div>
          <div>analytics_at</div>
          <div>{{ scope.row.analytics_at || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatStatus" prop="status" label="Status" align="center" width="100"/>
      <el-table-column label="Operating" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="preview(scope.row.login)">Preview</el-button>
            <el-button size="small" @click="github(scope.row.html_url)">Github</el-button>
            <el-button size="small">Fetch</el-button>
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
    <el-dialog :visible.sync="editVisible" :title="`Edit ${editRow.login}`">
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
import { getDevelopers, switchDeveloper, editDeveloper } from '@/api/app'

export default {
  data() {
    return {
      // Status
      status_lists: [
        { value: 0, name: 'Disable' },
        { value: 1, name: 'Enable' },
        { value: 2, name: 'Delete' }
      ],
      type_lists: [
        { value: 'User', name: 'User' },
        { value: 'Organization', name: 'Organization' }
      ],
      sort_type: [
        { value: 'followers', name: 'followers' },
        { value: 'view_number', name: 'view_number' },
        { value: 'fetched_at', name: 'fetched_at' },
        { value: 'analytics_at', name: 'analytics_at' }
      ],

      // search
      searchForm: {
        login: '',
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
    this.getDevelopers()
  },
  methods: {

    preview(login) {
      window.open(`${process.env.WEB_URL}/developer/${login}`)
    },

    github(url) {
      window.open(url)
    },

    sort() {
      this.getDevelopers()
    },

    formatStatus(row) {
      for (let i = 0; i < this.status_lists.length; i++) {
        if (this.status_lists[i].value === row.status) {
          return this.status_lists[i].name
        }
      }
      return '--'
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
        switchDeveloper(params).then(() => {
          this.getDevelopers()
        })
      }
    },

    // List
    getDevelopers: function() {
      const param = {
        page: this.page,
        limit: this.pageSize
      }
      if (this.searchForm.login !== '') {
        param.login = this.searchForm.login
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
      getDevelopers(param).then(res => {
        this.list = res.rows
        this.total = res.count
        this.tableLoading = false
      })
    },

    handleSizeChange: function(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getDevelopers()
      }
    },

    handleCurrentChange: function(page) {
      this.page = page
      this.getDevelopers()
    },

    resetForm(formName) {
      this.pageSize = 10
      this.page = 1
      this.tableSelections = []
      this.$refs[formName].resetFields()
      this.getDevelopers()
    },

    editSubmit() {
      if (this.editForm.status !== '') {
        const params = {
          id: this.editRow.id,
          status: this.editForm.status
        }
        editDeveloper(params).then(() => {
          this.editVisible = false
          this.getDevelopers()
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
