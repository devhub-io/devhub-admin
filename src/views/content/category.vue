<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">新增栏目</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <div class="custom-tree-container">
      <div class="block">
        <p>{{ site.name }}</p>
        <el-tree
          :data="categories"
          :expand-on-click-node="false"
          :show-checkbox="false"
          :props="optionProps"
          node-key="id"
          default-expand-all>
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(data)">
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!--编辑界面-->
    <el-dialog :visible="editFormVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="150px">
        <el-form-item label="栏目名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="上级栏目" prop="pid">
          <el-cascader
            :options="categories"
            v-model="editForm.pid"
            :props="optionProps"
            :clearable="true"
            change-on-select/>
        </el-form-item>
        <el-form-item label="标识" prop="flag">
          <el-input v-model="editForm.flag" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort" auto-complete="off" type="number"/>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="editForm.url" auto-complete="off" />
        </el-form-item>
        <el-form-item label="新窗口打开" prop="target">
          <el-checkbox v-model="editForm.target">是</el-checkbox>
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
        <el-form-item label="栏目名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="上级栏目" prop="pid">
          <el-cascader
            :options="categories"
            v-model="addForm.pid"
            :props="optionProps"
            :clearable="true"
            change-on-select/>
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
  getCategoriesTree,
  getCategory,
  createCategory,
  deleteCategory
} from '@/api/content'
import { editCategory } from '../../api/content'

export default {
  data() {
    return {
      site_id: 0,
      site: {},
      listLoading: false,
      categories: [],
      optionProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      },

      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入站点名', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '请输入域名', trigger: 'blur' }
        ]
      },
      editForm: {
        site_id: this.site_id,
        pid: [],
        name: ''
      },

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入栏目名', trigger: 'blur' }
        ]
      },
      addForm: {
        site_id: this.site_id,
        pid: [],
        name: ''
      }
    }
  },
  mounted() {
    this.site_id = this.$route.params.id
    this.getSite()
    this.getCategories()
  },
  methods: {
    // 显示编辑界面
    edit(data) {
      this.editFormVisible = true
      getCategory(data.id).then(res => {
        if (res.code === 200) {
          this.editFormVisible = true
          const temp = res
          temp.pid = [temp.pid]
          temp.target = temp.target > 0
          this.editForm = Object.assign({}, temp)
        }
      })
    },
    remove(node, data) {
      this.$confirm(`确认删除栏目( ${data.name} )吗？`, '提示', {}).then(() => {
        deleteCategory({ id: data.id }).then(res => {
          this.editLoading = false
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getCategories()
          }
        })
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getUsers()
    },
    getSite() {
      getSite(this.site_id).then(res => {
        if (res.code === 200) {
          this.site = res
        }
      })
    },
    // 获取列表
    getCategories() {
      this.listLoading = true
      getCategoriesTree({ site_id: this.site_id }).then((res) => {
        this.listLoading = false
        if (res.code === 200) {
          this.categories = res.data
        }
      })
    },
    // 显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        site_id: this.site_id,
        pid: []
      }
    },
    // 编辑
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const para = Object.assign({}, this.editForm)
            para.pid = para.pid = this.editForm.pid[this.editForm.pid.length - 1]
            editCategory(para).then(res => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getCategories()
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
            para.pid = para.pid = this.addForm.pid[this.addForm.pid.length - 1]
            createCategory(para).then(res => {
              this.addLoading = false
              if (res.code === 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getCategories()
              }
            })
          })
        }
      })
    }
  }
}

</script>

<style scoped>
  .block {
    flex: 1;
  }
  .custom-tree-node {
    flex: 1;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
