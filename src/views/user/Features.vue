<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filterText" placeholder="功能名"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="clearFilter">清除</el-button>
          <el-button type="info" icon="el-icon-plus" @click="handleAdd">增加功能</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <div style="height: 10px; clear: both;"/>
      <el-tree
        v-loading="loading"
        id="zyx-feature-tree"
        ref="tree"
        :data="tree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :render-content="renderContent"
        node-key="id"
        default-expand-all/>
    </template>

    <!--新增界面-->
    <el-dialog :visible="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="addForm.url" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="标识" prop="flag">
          <el-input v-model="addForm.flag" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="是否菜单">
          <el-radio-group v-model="addForm.menu_type">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能类型">
          <el-radio-group v-model="addForm.feature_type">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">公共功能</el-radio>
            <el-radio :label="2">供应商</el-radio>
            <el-radio :label="3">分销商</el-radio>
            <el-radio :label="4">系统</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="addForm.sort"/>
        </el-form-item>
        <el-form-item label="父级">
          <el-cascader
            :props="cascaderProps"
            :options="tree"
            v-model="addForm.parent_id"
            filterable
            change-on-select
            clearable
            expand-trigger="hover"/>
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
        <el-form-item label="链接" prop="url">
          <el-input v-model="editForm.url" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="标识" prop="flag">
          <el-input v-model="editForm.flag" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="是否菜单">
          <el-radio-group v-model="editForm.menu_type">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能类型">
          <el-radio-group v-model="editForm.feature_type">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">公共功能</el-radio>
            <el-radio :label="2">供应商</el-radio>
            <el-radio :label="3">分销商</el-radio>
            <el-radio :label="4">系统</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="editForm.sort"/>
        </el-form-item>
        <el-form-item label="父级">
          <el-cascader
            :props="cascaderProps"
            :options="tree"
            v-model="editForm.parent_path"
            filterable
            change-on-select
            clearable
            expand-trigger="hover"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--绑定界面-->
    <el-dialog :visible="bindFormVisible" :close-on-click-modal="false" title="绑定接口">
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item>
          <el-transfer
            :filter-method="filterTransfer"
            v-model="bindInterfaceId"
            :props="transferProps"
            :titles="['可选的接口', '绑定的接口']"
            :render-content="renderTransfer"
            :footer-format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="interfaces"
            filterable
            filter-placeholder="请输入接口名称"/>
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
  getFeatures,
  createFeature,
  getFeature,
  updateFeature,
  updateFeatureInterfaces,
  getInterfaces,
  getFeatureInterfaces
} from '@/api/user'

export default {
  data() {
    return {
      filterText: '',
      filters: {
        name: ''
      },
      loading: false,
      features: [],
      total: 0,
      page: 1,
      pageSize: 10,
      interfaces: [],

      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      addForm: {
        name: '',
        url: '',
        flag: '',
        parent_id: [],
        sort: 100,
        menu_type: 0,
        feature_type: 0
      },

      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editForm: {},

      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cascaderProps: {
        value: 'feature_id',
        label: 'name'
      },

      bindFormVisible: false,
      transferProps: {
        key: 'interface_id',
        label: 'name'
      },
      bindInterfaceId: [],
      bindLoading: false,
      bindFeature: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getFeatures()
    this.getInterfaces()
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
    filterTransfer(query, item) {
      return item.name.indexOf(query) > -1 || item.uri.indexOf(query) > -1
    },
    renderTransfer(h, option) {
      return <span>{ option.name }</span>
    },
    getInterfaces() {
      getInterfaces({ is_available: 1 }, 1, 9999).then(res => {
        if (res.code === 200) {
          this.interfaces = res.data
        }
      })
    },
    getFeatures() {
      const para = {
        name: this.filters.name
      }
      this.loading = true
      getFeatures(para).then(res => {
        if (res.code === 200) {
          this.tree = res.tree
        }
        this.loading = false
      })
    },
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        url: '',
        flag: '',
        parent_id: [],
        sort: 100,
        menu_type: 0,
        feature_type: 0
      }
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          const para = Object.assign({}, this.addForm)
          para.parent_path = para.parent_id
          para.parent_id = para.parent_id[para.parent_id.length - 1]
          createFeature(para).then((res) => {
            this.addLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getFeatures()
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
    handleSwitchAvailable(row) {
      updateFeature(row.feature_id, {
        is_available: row.is_available ? 0 : 1
      }).then(res => {
        if (res.code !== 200) {
          this.$message({
            message: res.message,
            type: 'error'
          })
        } else {
          this.getFeatures()
        }
      }).catch(() => {
        this.$message({
          message: '切换状态失败',
          type: 'error'
        })
      })
    },
    handleEdit(data) {
      getFeature(data.feature_id).then(res => {
        if (res.code === 200) {
          this.editFormVisible = true
          this.editForm = Object.assign({}, res)
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
          delete para.feature_id
          para.parent_id = para.parent_path.length === 0 ? 0 : para.parent_path[para.parent_path.length - 1]
          updateFeature(this.editForm.feature_id, para).then(res => {
            this.editLoading = false
            if (res.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getFeatures()
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
      this.filterText = ''
    },
    handleBindInterfaces(data) {
      getFeatureInterfaces(data.feature_id).then(res => {
        if (res.code === 200) {
          this.bindInterfaceId = []
          res.data.map(i => {
            this.bindInterfaceId.push(i.interface_id)
          })
          this.bindFeature = data
          this.bindFormVisible = true
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    bindSubmit() {
      updateFeatureInterfaces(this.bindFeature.feature_id, this.bindInterfaceId).then(res => {
        this.bindFormVisible = false
        if (res.code === 200) {
          this.bindFeature = {}
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // Tree
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{data.menu_type === 1 ? (<el-tag type='gray'>菜单</el-tag>) : ''} {data.name} {data.url ? `(${data.url})` : ''} </span>
          </span>
          <span style='float: right; margin-right: 20px'>
            <el-button size='mini' on-click={ () => this.handleSwitchAvailable(data) } type={data.is_available === 1 ? 'warning' : 'info'}>
              {data.is_available === 1 ? '点击禁用' : '点击启用'}
            </el-button>
            <el-button size='mini' on-click={ () => this.handleEdit(data) }>编辑</el-button>
            <el-button size='mini' on-click={ () => this.handleBindInterfaces(data) }>绑定接口</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style>
  #zyx-feature-tree .el-tree-node {
    white-space: normal;
  }
</style>
