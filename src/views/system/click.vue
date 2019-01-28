<template>
  <div class="app-container">

    <!--Tools-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" >
        <el-form-item label="Target" prop="target">
          <el-input v-model="searchForm.target" type="url" placeholder="http://"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getClick">Query</el-button>
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
      <el-table-column prop="target" label="target" width="200" />
      <el-table-column prop="referer" label="referer" width="200" />
      <el-table-column prop="ip" label="ip" width="150" />
      <el-table-column prop="user_agent" label="UserAgent" width="250" />
      <el-table-column prop="time" label="Time" width="200">
        <template slot-scope="scope">
          <div>clicked_at</div>
          <div>{{ scope.row.clicked_at }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Operating" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="preview(scope.row.target)">Preview</el-button>
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
import { getClick, switchDeveloper, editDeveloper, fetchLink } from '@/api/app'

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
        { value: 'id', name: 'id' },
        { value: 'clicked_at', name: 'clicked_at' }
      ],

      // search
      searchForm: {
        target: ''
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
    this.getClick()
  },
  methods: {

    preview(url) {
      window.open(url)
    },

    sort() {
      this.getClick()
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
          this.getClick()
        })
      }
    },

    // List
    getClick: function() {
      const param = {
        page: this.page,
        limit: this.pageSize
      }
      if (this.searchForm.target !== '') {
        param.target = this.searchForm.target
      }
      if (this.sortForm.sort_type !== '') {
        param.sort_type = this.sortForm.sort_type
      }

      this.tableLoading = true
      getClick(param).then(res => {
        this.list = res.rows
        this.total = res.count
        this.tableLoading = false
      })
    },

    handleSizeChange: function(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getClick()
      }
    },

    handleCurrentChange: function(page) {
      this.page = page
      this.getClick()
    },

    resetForm(formName) {
      this.pageSize = 10
      this.page = 1
      this.tableSelections = []
      this.$refs[formName].resetFields()
      this.getClick()
    },

    editSubmit() {
      if (this.editForm.status !== '') {
        const params = {
          id: this.editRow.id,
          status: this.editForm.status
        }
        editDeveloper(params).then(() => {
          this.editVisible = false
          this.getClick()
        })
      }
    },
    showEdit(row) {
      this.editForm.status = ''
      this.editRow = row
      this.editVisible = true
    },
    fetch(url) {
      fetchLink({ url: url }).then(() => {
        this.$message({ type: 'success', message: 'Add #LinkFetch job' })
      })
    }
  }
}
</script>

<style scoped>

</style>
