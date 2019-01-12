<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="业务组名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getGroups">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">新增用户组</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleLogs">操作日志</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table v-loading="listLoading" :data="groups" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :page-size="20" :total="total" layout="total, sizes, prev, pager, next" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </el-col>

    <!--编辑界面-->
    <el-dialog :visible="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <el-form-item label="业务组名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog :visible="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="150px">
        <el-form-item label="业务组名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button :loading="addLoading" type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroups, createGroup, updateGroup } from '@/api/user'

export default {
  data() {
    return {
      filters: {
        keyword: ''
      },
      groups: [],
      total: 0,
      page: 1,
      perPage: 10,
      listLoading: false,

      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入业务组名称', trigger: 'blur' }
        ]
      },
      editForm: {
        id: 0,
        name: ''
      },

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入业务组名称', trigger: 'blur' }
        ]
      },
      addForm: {
        name: ''
      }

    }
  },
  mounted() {
    this.getGroups()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getGroups()
    },
    handleSizeChange(pageSize) {
      this.perPage = pageSize
      this.getPartners()
    },
    getGroups() {
      const para = {
        keyword: this.filters.keyword
      }
      this.listLoading = true
      getGroups(para, this.page, this.perPage).then((res) => {
        if (res.code === 200) {
          this.total = res.total
          this.groups = res.data
        }
        this.listLoading = false
      })
    },
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: ''
      }
    },
    handleLogs: function() {
      alert('coming soon')
    },
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editLoading = true
          const para = Object.assign({}, this.editForm)
          updateGroup(para).then((res) => {
            this.editLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getGroups()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 新增
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          const para = Object.assign({}, this.addForm)
          createGroup(para).then((res) => {
            this.addLoading = false
            if (res.code === 200) {
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getGroups()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}

</script>

<style scoped>

</style>
