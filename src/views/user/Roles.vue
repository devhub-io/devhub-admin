<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoles">查询</el-button>
          <el-button @click="clearFilter">清除</el-button>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">添加角色</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table v-loading="loading" :data="roles" highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="60" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="is_available" label="是否启用" width="100" >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_available"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchAvailable(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="birth" label="操作" width="300">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" @click="handleBind(scope.$index, scope.row)">分配功能</el-button>
              <el-button size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </el-col>

    <!--新增界面-->
    <el-dialog :visible="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--分配功能-->
    <el-dialog :visible="bindFormVisible" :close-on-click-modal="false" title="分配功能">
      <el-form label-width="80px">
        <el-form-item>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"/>
          <el-tree
            ref="tree"
            :data="tree"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            show-checkbox
            node-key="feature_id"
            default-expand-all/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="bindFormVisible = false">取消</el-button>
        <el-button :loading="bindLoading" type="primary" @click.native="bindSubmit">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getRoles,
  getRoleFeatures,
  createRole,
  updateRole,
  updateRoleFeatures,
  deleteRole,
  getPartnerFeatures
} from '@/api/user'

export default {
  data() {
    return {
      filters: {
        name: ''
      },
      loading: false,
      roles: [],
      total: 0,
      page: 1,
      pageSize: 10,

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      addForm: {
        name: ''
      },

      editFormVisible: false,
      editLoading: false,
      editForm: {
        role_id: 0,
        name: ''
      },

      bindFormVisible: false,
      bindLoading: false,

      tree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: '',
      bindRole: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getRoles()
    this.getFeatures()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleCurrentChange(val) {
      this.page = val
      this.getFeatures()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getFeatures()
    },
    getFeatures() {
      getPartnerFeatures().then(res => {
        if (res.code === 200) {
          this.tree = res.tree
        }
      })
    },
    getRoles: function() {
      const para = {
        name: this.filters.name
      }
      this.loading = true
      getRoles(para, this.page, this.pageSize).then(res => {
        if (res.code === 200) {
          this.roles = res.data
          this.total = res.total
        }
        this.loading = false
      })
    },
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        url: ''
      }
    },
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          const para = Object.assign({}, this.addForm)
          createRole(para).then((res) => {
            this.addLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getRoles()
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
      updateRole(row.role_id, {
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
      this.editFormVisible = true
      this.editForm = {
        role_id: row.role_id,
        name: row.name
      }
    },
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editLoading = true
          const para = Object.assign({}, this.editForm)
          delete para.interface_id
          updateRole(this.editForm.role_id, para).then(res => {
            this.editLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getRoles()
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
      this.getRoles()
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该角色吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteRole(row.role_id).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.getRoles()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      })
    },

    handleBind(index, row) {
      getRoleFeatures(row.role_id).then(res => {
        if (res.code === 200) {
          this.bindFormVisible = true
          this.bindRole = row
          const featureId = []
          res.data.map(i => {
            featureId.push(i.feature_id)
          })
          if (this.$refs.tree !== undefined) {
            this.$refs.tree.setCheckedKeys(featureId)
          }
        }
      })
    },
    bindSubmit() {
      const featureId = this.$refs.tree.getCheckedKeys()
      updateRoleFeatures(this.bindRole.role_id, featureId).then(res => {
        if (res.code === 200) {
          this.bindFormVisible = false
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
