<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.uri" placeholder="链接"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.method" placeholder="请求方式">
            <el-option label="GET" value="GET"/>
            <el-option label="POST" value="POST"/>
            <el-option label="PUT" value="PUT"/>
            <el-option label="DELETE" value="DELETE"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInterfaces">查询</el-button>
          <el-button @click="clearFilter">清除</el-button>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">增加接口</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table v-loading="loading" :data="interfaces" highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="100" align="right"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="method" label="请求方法" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method == 'DELETE'" type="danger">DELETE</el-tag>
            <el-tag v-else-if="scope.row.method === 'GET'" type="success">GET</el-tag>
            <el-tag v-else-if="scope.row.method === 'POST'" type="warning">POST</el-tag>
            <el-tag v-else-if="scope.row.method === 'PUT'" type="gray">PUT</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uri" label="链接" width="400"/>
        <el-table-column prop="is_available" label="是否启用" width="100" >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_available"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchAvailable(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="birth" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        style="float:right;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"/>
    </el-col>

    <!--新增界面-->
    <el-dialog :visible="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-radio-group v-model="addForm.method">
            <el-radio label="GET"/>
            <el-radio label="POST"/>
            <el-radio label="PUT"/>
            <el-radio label="DELETE"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接" prop="uri">
          <el-input v-model="addForm.uri" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button :loading="addLoading" type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog :visible="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-radio-group v-model="editForm.method">
            <el-radio label="GET"/>
            <el-radio label="POST"/>
            <el-radio label="PUT"/>
            <el-radio label="DELETE"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接" prop="uri">
          <el-input v-model="editForm.uri" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getInterfaces, createInterface, getInterface, updateInterface } from '@/api/user'

export default {
  data() {
    return {
      filters: {
        name: '',
        uri: '',
        method: ''
      },
      loading: false,
      interfaces: [],
      total: 0,
      page: 1,
      pageSize: 10,

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择请求方式' }
        ],
        url: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ]
      },
      addForm: {
        name: '',
        uri: '',
        method: ''
      },

      editFormVisible: false,
      editLoading: false,
      editForm: {
        interface_id: 0,
        name: '',
        uri: '',
        method: ''
      }
    }
  },
  mounted() {
    this.getInterfaces()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getInterfaces()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getInterfaces()
    },
    getInterfaces: function() {
      this.loading = true
      getInterfaces(this.filters, this.page, this.pageSize).then(res => {
        if (res.code === 200) {
          this.interfaces = res.data
          this.total = res.total
        }
        this.loading = false
      })
    },
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        uri: '',
        method: ''
      }
    },
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          const para = Object.assign({}, this.addForm)
          createInterface(para).then((res) => {
            this.addLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getInterfaces()
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
    // 禁用、启用
    handleSwitchAvailable: function(index, row, s) {
      const oldState = row.is_available
      updateInterface(row.interface_id, {
        is_available: row.is_available ? 0 : 1
      }).then(res => {
        if (res.code !== 200) {
          this.partners[index].is_available = oldState
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          message: '切换状态失败',
          type: 'error'
        })
      })
    },
    handleEdit: function(index, row) {
      getInterface(row.interface_id).then(res => {
        if (res.code === 200) {
          this.editFormVisible = true
          this.editForm = {
            interface_id: res.interface_id,
            name: res.name,
            uri: res.uri,
            method: res.method
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editLoading = true
          const para = Object.assign({}, this.editForm)
          delete para.interface_id
          updateInterface(this.editForm.interface_id, para).then(res => {
            this.editLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getInterfaces()
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
    // 清除
    clearFilter() {
      this.filters.name = ''
      this.filters.uri = ''
      this.filters.method = ''
      this.getInterfaces()
    }
  }
}
</script>

<style scoped>

</style>
