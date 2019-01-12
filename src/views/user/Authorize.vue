<template>
  <div class="app-container">
    <el-tabs v-model="active">
      <el-tab-pane label="供应商" name="a"/>
      <el-tab-pane label="渠道" name="b"/>
    </el-tabs>

    <!--列表-->
    <section v-show="active == 'a'">
      <el-table v-loading="listSuppliersLoading" :data="authorizeSuppliers" highlight-current-row style="width: 50%;">
        <el-table-column prop="partner_target_id" label="ID" width="60"/>
        <el-table-column prop="partner_name" label="供应商名称"/>
        <el-table-column :formatter="formatCooperateMethod" prop="cooperate_method" label="合作模式" width="100" align="center"/>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row, 1)">管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <!--列表-->
    <section v-show="active == 'b'">
      <el-table v-loading="listSellersLoading" :data="authorizeSellers" highlight-current-row style="width: 50%;">
        <el-table-column prop="partner_target_id" label="ID" width="60"/>
        <el-table-column prop="partner_name" label="渠道" />
        <el-table-column :formatter="formatCooperateMethod" prop="cooperate_method" label="合作模式"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row, 1)">管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import { userSellers, userSuppliers } from '@/api/user'

export default {
  data() {
    return {
      id: 0,
      authorizeSuppliers: [],
      authorizeSellers: [],
      active: 'a',
      partner: {},
      listLoading: false,
      options: [],
      listSuppliersLoading: false,
      listSellersLoading: false
    }
  },
  mounted() {
    this.getSuppliers()
    this.getSellers()
  },
  methods: {
    formatCooperateMethod(row, column) {
      return row.cooperate_method === 1 ? '系统直连' : '同行分销'
    },
    getSuppliers() {
      this.listSuppliersLoading = true
      userSuppliers().then(res => {
        if (res.code === 200) {
          this.authorizeSuppliers = res.data
        }
        this.listSuppliersLoading = false
      })
    },
    getSellers() {
      this.listSellersLoading = true
      userSellers().then(res => {
        if (res.code === 200) {
          this.authorizeSellers = res.data
        }
        this.listSellersLoading = false
      })
    },
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.$router.push({ path: `/partner/authorize/${row.partner_target_id}/info` })
    }
  }
}
</script>
