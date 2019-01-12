<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.account" placeholder="账号"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.group_id" placeholder="请选择所属业务组">
            <el-option v-for="item in groups" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getUsers">查询</el-button>
          <el-button @click="clearFilter">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">新增账号</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table v-loading="listLoading" :data="users" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60"/>
      <el-table-column prop="account" label="账号" width="120"/>
      <el-table-column prop="name" label="姓名" width="120"/>
      <el-table-column prop="group_id" label="业务组" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.group ? scope.row.group.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="角色">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roles" :key="item.role_id" type="gray" style="margin-right: 5px;">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handlePassword(scope.$index, scope.row)">修改密码</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </el-col>

    <!--修改密码界面-->
    <el-dialog :visible="passwordFormVisible" :close-on-click-modal="false" title="修改密码">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" label-width="150px">
        <el-form-item label="密码" prop="password">
          <el-input v-model="passwordForm.password" auto-complete="off" type="password"/>
        </el-form-item>
        <el-form-item label="重复密码" prop="password_confirmed">
          <el-input v-model="passwordForm.password_confirmed" auto-complete="off" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="passwordFormVisible = false">取消</el-button>
        <el-button :loading="passwordLoading" type="primary" @click.native="passwordSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog :visible="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="editForm.account" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="所属业务组" prop="group_id">
          <el-select v-model="editForm.group_id" placeholder="请选择所属业务组">
            <el-option v-for="item in groups" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="拥有权限" prop="role_id">
          <el-checkbox-group v-model="editForm.role_id">
            <el-checkbox v-for="item in roles" :label="item.role_id" :key="item.role_id" name="edit_role_id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
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
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off" type="password"/>
        </el-form-item>
        <el-form-item label="所属业务组" prop="group_id">
          <el-select v-model="addForm.group_id" placeholder="请选择所属业务组">
            <el-option v-for="item in groups" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="权限角色" prop="role_id">
          <el-checkbox-group v-model="addForm.role_id">
            <el-checkbox v-for="item in roles" :label="item.role_id" :key="item.role_id" name="add_role_id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
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
import {
  createUser,
  getUsers,
  getGroups,
  getRoles,
  updateUserPassword,
  updateUser,
  getUser
} from '@/api/user'

export default {
  data() {
    return {
      filters: {
        name: '',
        account: '',
        group_id: ''
      },
      users: [],
      groups: [],
      roles: [],
      total: 0,
      page: 1,
      pageSize: 10,
      listLoading: false,

      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      editForm: {
        id: 0,
        account: '',
        name: '',
        group_id: '',
        role_id: []
      },

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        group_id: [
          { required: true, message: '请选择业务组' }
        ],
        role_id: [
          { required: true, message: '请选择角色' }
        ]
      },
      addForm: {
        account: '',
        name: '',
        password: '',
        group_id: '',
        role_id: []
      },

      passwordForm: {
        password: '',
        password_confirmed: ''
      },
      passwordFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        password_confirmed: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      passwordFormVisible: false,
      passwordLoading: false,
      passwordUser: {}
    }
  },
  mounted() {
    this.getUsers()
    this.getGroups()
    this.getRoles()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getUsers()
    },
    getGroups() {
      getGroups({}, 1, 9999).then(res => {
        if (res.code === 200) {
          this.groups = res.data
        }
      })
    },
    // 获取用户列表
    getUsers() {
      this.listLoading = true
      getUsers(this.filters, this.page, this.perPage).then((res) => {
        this.listLoading = false
        if (res.code === 200) {
          this.total = res.total
          this.users = res.data
        }
      })
    },
    getRoles() {
      getRoles({ is_available: 1 }, 1, 9999).then(res => {
        if (res.code === 200) {
          this.roles = res.data
        }
      })
    },
    // 显示编辑界面
    handleEdit(index, row) {
      getUser(row.id).then(res => {
        if (res.code === 200) {
          this.editFormVisible = true
          this.editForm = Object.assign({}, res)
          this.editForm.role_id = []
          delete this.editForm.roles
          delete this.editForm.group
          res.roles.map(i => {
            this.editForm.role_id.push(i.role_id)
          })
        }
      })
    },
    // 显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        account: '',
        name: '',
        password: '',
        group_id: '',
        role_id: []
      }
    },
    // 编辑
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const para = Object.assign({}, this.editForm)
            delete para.id
            updateUser(this.editForm.id, para).then(res => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getUsers()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    },
    // 新增
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            const para = Object.assign({}, this.addForm)
            createUser(para).then(res => {
              this.addLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getUsers()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    },

    handlePassword(index, row) {
      this.passwordFormVisible = true
      this.passwordUser = row
    },
    passwordSubmit() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.passwordLoading = true
            updateUserPassword(this.passwordUser.id, this.passwordForm).then(res => {
              this.passwordLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '修改密码成功',
                  type: 'success'
                })
                this.$refs['passwordForm'].resetFields()
                this.passwordFormVisible = false
                this.getUsers()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    },

    clearFilter() {
      this.filters = {
        name: '',
        account: '',
        group_id: ''
      }
      this.getUsers()
    }
  }
}

</script>

<style scoped>

</style>
