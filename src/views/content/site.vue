<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">新增站点</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table v-loading="listLoading" :data="sites" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60"/>
      <el-table-column prop="name" label="站点名" width="120"/>
      <el-table-column prop="domain" label="域名" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleSite(scope.$index, scope.row)">栏目管理</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </el-col>

    <!--编辑界面-->
    <el-dialog :visible="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <el-form-item label="站点名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" maxlength="15"/>
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="editForm.domain" auto-complete="off" placeholder="请输入域名" maxlength="50">
            <template slot="prepend">http://</template>
          </el-input>
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
        <el-form-item label="站点名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="addForm.domain" auto-complete="off" placeholder="请输入域名">
            <template slot="prepend">http://</template>
          </el-input>
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
  getSite,
  getSites,
  editSite,
  createSite
} from '@/api/content'

export default {
  data() {
    return {
      sites: [],
      total: 0,
      page: 1,
      pageSize: 10,
      listLoading: false,

      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        domain: [
          { required: true, message: '请输入站点名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入域名', trigger: 'blur' }
        ]
      },
      editForm: {
        id: 0,
        domain: '',
        name: ''
      },

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        domain: [
          { required: true, message: '请输入域名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入站点名', trigger: 'blur' }
        ]
      },
      addForm: {
        domain: '',
        name: ''
      }
    }
  },
  mounted() {
    this.getSites()
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
    // 获取列表
    getSites() {
      this.listLoading = true
      getSites().then((res) => {
        this.listLoading = false
        if (res.code === 200) {
          this.total = res.total
          this.sites = res.data
        }
      })
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true
      getSite(row.id).then(res => {
        if (res.code === 200) {
          this.editFormVisible = true
          this.editForm = Object.assign({}, res)
        }
      })
    },
    handleSite(index, row) {
      this.$router.push({ path: `/content/site/${row.id}/category` })
    },
    // 显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        domain: '',
        name: ''
      }
    },
    // 编辑
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const para = Object.assign({}, this.editForm)
            editSite(para).then(res => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getSites()
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
            createSite(para).then(res => {
              this.addLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getSites()
              }
            })
          })
        }
      })
    }
  }
}
</script>
