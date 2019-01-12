<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增销售合同</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table v-loading="loading" :data="contracts" highlight-current-row style="width: 50%;">
        <el-table-column prop="contract_id" label="ID" width="60" align="center"/>
        <el-table-column prop="contract_no" label="合同编号"/>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row.contract_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--新增界面-->
    <el-dialog :visible="addFormVisible" :close-on-click-modal="false" title="新增">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="合同编号" prop="contract_no">
          <el-input v-model="addForm.contract_no" auto-complete="off"/>
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
import { getSalesContracts, createContract, deleteContract } from '@/api/partner'

export default {
  data() {
    return {
      loading: false,
      contracts: [],
      addForm: {
        contract_no: ''
      },
      addFormRules: {
        contract_no: [
          { required: true, message: '请输入合同编号', trigger: 'blur' }
        ]
      },
      addLoading: false,
      addFormVisible: false
    }
  },
  mounted() {
    this.getContracts()
  },
  methods: {
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        contract_no: ''
      }
    },
    getContracts() {
      this.loading = true
      getSalesContracts().then(res => {
        if (res.code === 200) {
          this.contracts = res.data
        }
        this.loading = false
      })
    },
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          createContract(2, this.addForm.contract_no).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '添加供应合同成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getContracts()
            }
            this.addLoading = false
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该销售合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContract(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除销售合同成功',
              type: 'success'
            })
            this.getContracts()
          } else {
            this.$message({
              message: '删除销售合同失败',
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
