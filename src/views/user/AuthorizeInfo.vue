<template>
  <div class="app-container">
    <!-- 密钥信息 -->
    <template v-if="input.length > 0">
      <div class="form-section">
        密钥信息
      </div>

      <el-form ref="saveForm" :model="saveForm" label-width="150px" style="margin:20px;width:60%;min-width:600px;" @submit.prevent="onSubmit">
        <el-form-item v-for="item in input" :label="item.title" :key="item.name" :prop="item.name">
          <el-input v-model="saveForm[item.name]"/>
        </el-form-item>
        <el-form-item>
          <el-button :loading="saveLoading" type="primary" @click.native="saveAuthorizeInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 结算方式 -->
    <template v-if="partner.partner_type == 1 || partner.partner_type == 3">
      <div class="form-section">
        结算方式
      </div>

      <el-button type="primary" class="add" @click="handleAdd">新增结算方式</el-button>

      <el-table v-loading="listLoading" :data="partnerSettlements" highlight-current-row style="width: 60%;">
        <el-table-column type="index" width="60"/>
        <el-table-column prop="settlement_name" label="名称" width="100"/>
        <el-table-column label="">
          <template slot-scope="scope">
            <span v-if="scope.row.mark">{{ scope.row.title }} : {{ scope.row.mark == 'month' ? scope.row.settlement_date : `${scope.row.already_used} / ${scope.row.spare_funds}` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--新增界面-->
      <el-dialog :visible="addFormVisible" :close-on-click-modal="false" title="新增">
        <el-form ref="addForm" :model="form" :rules="addFormRules" label-width="80px">
          <el-form-item label="结算方式" prop="settlement_id">
            <el-select v-model="form.settlement_id" placeholder="请选择结算方式" @change="handleSettlementIdChange">
              <el-option v-for="item in settlementOptions" :label="item.settlement_name" :value="item.settlement_id" :key="item.settlement_id"/>
            </el-select>
          </el-form-item>
          <el-form-item v-for="input in settlementInput" :label="input.title" :key="input.name">
            <el-input v-model.number="form[input.name]"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button :loading="addLoading" type="primary" @click.native="addSubmit">提交</el-button>
        </div>
      </el-dialog>
    </template>

    <!-- 合同 -->
    <template v-if="partner.partner_type == 1 || partner.partner_type == 3">
      <div class="form-section">
        供应商合同
      </div>

      <el-form label-width="150px">
        <el-form-item label="合同编号" prop="contract">
          <el-row v-for="(contract, index) in supplyContracts" :key="index" class="contract-row">
            <el-col :span="7">
              <input v-model="contract.contract_type" type="hidden" value="2">
              <el-input v-model="contract.contract_no" :readonly="contract.contract_id > 0"/>
            </el-col>
            <el-col :span="14" :offset="1">
              <el-button type="danger" icon="el-icon-delete" @click.prevent="removeSupplyContract(index, contract.contract_id)"/>
              <el-button v-if="index == 0" type="info" icon="el-icon-plus" @click.prevent="addSupplyContract"/>
              <el-button v-if="contract.contract_id == 0" type="success" icon="el-icon-check" @click.prevent="saveSupplyContract(index)"/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  getPartnerAuthorize,
  getSettlementOptions,
  createPartnerSettlement,
  getPartnerSettlements,
  deletePartnerSettlement,
  savePartnerAuthorize,
  getPartner,
  getSupplierContracts,
  createContract,
  deleteContract
} from '@/api/partner'

export default {
  data() {
    return {
      id: 0,
      partner: {},
      authorizeInfo: {},
      settlementOptions: [],
      settlement: [],
      settlementInput: [],
      partnerSettlements: [],
      input: [],
      mark: '',
      saveInfoRules: {},
      addLoading: false,
      saveLoading: false,
      addFormVisible: false,
      listLoading: false,
      filters: {
        name: ''
      },
      loading: false,
      users: [],
      form: {
        settlement_id: ''
      },
      saveForm: {},
      addFormRules: {
        settlement_id: [
          { required: true, message: '请选择结算方式' }
        ]
      },

      supplyContracts: [
        {
          contract_type: 1,
          contract_no: '',
          contract_id: 0
        }]
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getPartner()
    this.getAuthorizeInfo()
    this.getPartnerSettlements()
  },
  methods: {
    formatStatus(row, column) {
      return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
    },
    getPartner() {
      getPartner(this.id).then(res => {
        this.fullScreenLoading = false
        if (res.code === 200) {
          this.partner = res
          this.getContracts()
        }
      })
    },
    getAuthorizeInfo() {
      this.loading = true
      getPartnerAuthorize(this.id).then(res => {
        if (res.code === 200) {
          this.authorizeInfo = res
          if (!_.isEmpty(this.authorizeInfo.other_data)) {
            this.mark = this.authorizeInfo.other_data.mark
            this.input = this.authorizeInfo.other_data.input
            _.map(this.input, i => {
              this.saveInfoRules[i.name] = {
                required: true, message: `请填写${i.title}`
              }
              this.saveForm[i.name] = i.value
            })
          }
        }
        this.loading = false
      })
    },
    getSettlementOptions() {
      getSettlementOptions(1).then(res => {
        if (res.code === 200) {
          this.settlementOptions = res.data
          this.settlementOptions.map(i => {
            this.settlement[i.settlement_id] = i
          })
        }
      })
    },
    getPartnerSettlements() {
      this.listLoading = true
      getPartnerSettlements(this.id).then(res => {
        this.listLoading = false
        if (res.code === 200) {
          this.partnerSettlements = res.data
        }
      })
    },
    handleAdd() {
      this.addFormVisible = true
      this.getSettlementOptions()
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          createPartnerSettlement(this.id, this.form).then(res => {
            if (res.code === 200) {
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getPartnerSettlements()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
            this.addLoading = false
          })
        }
      })
    },
    deleteSettlement(id) {
      deletePartnerSettlement(id).then(res => {
        if (res.code === 200) {
          this.getPartnerSettlements()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    saveAuthorizeInfo() {
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          const input = []
          _.map(this.saveForm, (i, k) => {
            input.push({
              title: 'fff',
              name: k,
              value: i
            })
          })
          this.saveLoading = true
          savePartnerAuthorize(this.authorizeInfo.partner_authorize_id, this.mark, input).then(res => {
            this.saveLoading = false
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
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
    handleDelete(index, row) {
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.listLoading = true
        deletePartnerSettlement(row.partner_settlement_id).then(res => {
          if (res.code === 200) {
            this.getPartnerSettlements()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
          this.listLoading = false
        })
      })
    },

    addSupplyContract() {
      this.supplyContracts.push({
        contract_type: 1,
        contract_no: '',
        contract_id: 0
      })
    },
    saveSupplyContract(index) {
      createContract(1, this.supplyContracts[index].contract_no, this.partner.partner_id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加供应合同成功',
            type: 'success'
          })
          this.supplyContracts.splice(index, 1, {
            contract_type: 1,
            contract_no: this.supplyContracts[index].contract_no,
            contract_id: res.contract_id
          })
        }
      })
    },
    removeSupplyContract(index, id) {
      this.$confirm('此操作将删除该供应合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id > 0) {
          deleteContract(id).then(res => {
            if (res.code === 200) {
              if (index !== -1) {
                this.supplyContracts.splice(index, 1)
                this.$message({
                  message: '删除供应合同成功',
                  type: 'success'
                })
                if (this.supplyContracts.length === 0) {
                  this.supplyContracts = [
                    {
                      contract_type: 1,
                      contract_no: '',
                      contract_id: 0
                    }]
                }
              } else {
                this.$message({
                  message: '删除供应合同失败',
                  type: 'error'
                })
              }
            }
          })
        } else {
          if (index !== -1) {
            if (index === 0) {
              this.supplyContracts = [
                {
                  contract_type: 1,
                  contract_no: '',
                  contract_id: 0
                }]
            } else {
              this.supplyContracts.splice(index, 1)
            }
          }
        }
      })
    },

    getContracts() {
      getSupplierContracts(this.partner.partner_id).then(res => {
        if (res.code === 200) {
          this.supplyContracts = res.data
          if (this.supplyContracts.length === 0) {
            this.supplyContracts = [
              {
                contract_type: 1,
                contract_no: '',
                contract_id: 0
              }
            ]
          }
        }
      })
    },

    handleSettlementIdChange(val) {
      if (this.settlement[val] !== undefined) {
        this.settlementInput = this.settlement[val].input
        if (this.settlementInput !== undefined) {
          this.form.spare_funds = ''
          this.form.settlement_date = ''
        } else {
          delete this.form.spare_funds
          delete this.form.settlement_date
        }
      }
    }
  }
}
</script>

<style scoped>
  .form-section {
    height: 35px;
    line-height: 35px;
    margin-bottom: 25px;
    background-color: #f1f1f1;
    padding-left: 12px;
    margin-top: 25px;
  }
  .add {
    margin-bottom: 20px;
  }
  .contract-row {
    margin-bottom: 5px;
  }
</style>
