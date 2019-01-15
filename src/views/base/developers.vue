<template>
  <div class="app-container">

    <!--Tools-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="searchFrom" :model="searchFrom" :inline="true" >
        <el-col :span="24">
          <el-form-item label="Keyword" prop="keyword">
            <el-input v-model="searchFrom.keyword" placeholder="Input..."/>
          </el-form-item>
          <el-form-item label="Slug" prop="slug">
            <el-input v-model="searchFrom.slug" placeholder="Input..."/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Status" prop="status">
            <el-select v-model="searchFrom.status" clearable placeholder="Select...">
              <el-option
                v-for="item in status_lists"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Type" prop="status">
            <el-select v-model="searchFrom.status" clearable placeholder="Select...">
              <el-option
                v-for="item in status_lists"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getEcosystems">Query</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('searchFrom')">Clear</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handelLog('order')">Logs</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--Sort-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="sortFrom" :model="searchFrom" :inline="true" >
        <el-form-item label="Sort" prop="type">
          <el-select v-model="sortFrom.type" clearable placeholder="Select...">
            <el-option
              v-for="item in sort_type"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>

    <!--List-->
    <el-table v-loading="tableLoading" ref="multipleTable" :data="orderList" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="id" label="#" width="50" />
      <el-table-column prop="title" label="Name" width="100" />
      <el-table-column prop="cover" label="Type" width="100" />
      <el-table-column prop="category_id" label="Avatar" width="100" />
      <el-table-column prop="statistics" label="Statistics" min-width="150"/>
      <el-table-column prop="status" label="Status" align="center" width="150" />
      <el-table-column label="Operating" width="180">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small">Preview</el-button>
            <el-button size="small">Fetch</el-button>
            <el-button size="small">Edit</el-button>
            <el-button size="small">Github</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--Pagination-->
    <el-col :span="24" class="toolbar">
      <el-button v-if="list_type !== 1" size="mini" type="primary" style="float: left;" @click="batchCheck()">Enable</el-button>
      <el-pagination :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </el-col>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  getEcosystems
} from '@/api/ecosystem'

export default {
  data() {
    return {
      // Status
      status_lists: [
        { value: 0, name: 'Disable' },
        { value: 1, name: 'Enable' },
        { value: 2, name: 'Delete' }
      ],
      sort_type: [
        { value: 1, name: 'view_number' },
        { value: 1, name: 'followers' },
        { value: 2, name: 'fetched_at' },
        { value: 2, name: 'analytics_at' }
      ],

      // search
      searchFrom: {
        partner_target_id: '',
        order_status: '',
        order_no: '',
        goods_name: '',
        contact_name: '',
        contact_mobile: '',
        date_out_range: '',
        select_date_type: 'created_at',
        settlement_status: ''
      },

      // sort
      sortFrom: {
        partner_target_id: '',
        order_status: '',
        order_no: '',
        goods_name: '',
        contact_name: '',
        contact_mobile: '',
        date_out_range: '',
        select_date_type: 'created_at',
        settlement_status: ''
      },

      // 订单供应商申请结算
      settlementLoading: false,
      tableSettlementSelections: [],

      // 批量操作
      checkBoxOrder: [],
      batchButtonName: '批量选择',

      // 列表数据、分页信息
      orderList: [],
      pageSize: 10,
      total: 0,
      page: 1,
      tableLoading: false,

      applyRefundVisible: false
    }
  },
  mounted() {
    this.getEcosystems()
  },
  methods: {

    // 验证订单状态
    checkOrderStatus: function(selections) {
      let result = false
      for (const i in selections) {
        if (selections[i].goods_type === 3) {
          result = true
          break
        }
      }
      return result
    },

    handleSelect: function(selection, row) {
      this.tableSelections = selection
    },

    // 全选
    handleSelectAll: function(selection) {
      this.tableSelections = selection
    },

    handleSettlementSelect: function(selection, row) {
      this.tableSettlementSelections = selection
    },

    // 全选
    handleSettlementSelectAll: function(selection) {
      this.tableSettlementSelections = selection
    },

    // 批量选择非套票订单
    batchCheck: function() {
      if (!_.isEmpty(this.checkBoxOrder)) {
        this.batchButtonName = '批量选择'
        this.$refs.multipleTable.clearSelection()
        this.tableSelections = []
        this.checkBoxOrder = []
      } else {
        if (!_.isEmpty(this.orderList)) {
          this.checkBoxOrder = []
          for (const i in this.orderList) {
            if (this.orderList[i].goods_type !== 3 && this.orderList[i].settlement_status === 0 && this.orderList[i].ticket_status === 2) {
              this.checkBoxOrder.push(this.orderList[i])
            }
          }
        }
        if (!_.isEmpty(this.checkBoxOrder)) {
          this.batchButtonName = '取消选择'
          this.$refs.multipleTable.clearSelection()
          this.checkBoxOrder.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
          this.tableSelections = this.checkBoxOrder
        } else {
          this.$message({
            message: '没有符合条件的订单！',
            type: 'warning'
          })
        }
      }
    },

    // 取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    // 获取列表
    getEcosystems: function() {
      const param = {
        page: this.page,
        per_page: this.pageSize
      }
      if (this.searchFrom.partner_target_id) {
        param.supplier_id = this.searchFrom.partner_target_id
      }
      if (this.searchFrom.order_status !== '') {
        param.order_status = this.searchFrom.order_status
      }
      if (this.searchFrom.order_no) {
        param.order_no = this.searchFrom.order_no
      }
      if (this.searchFrom.contact_name) {
        param.contact_name = this.searchFrom.contact_name
      }
      if (this.searchFrom.contact_mobile) {
        param.contact_mobile = this.searchFrom.contact_mobile
      }
      if (this.searchFrom.settlement_status) {
        param.settlement_status = this.searchFrom.settlement_status
      }
      if (this.searchFrom.goods_name) {
        param.goods_name = this.searchFrom.goods_name
      }
      if (this.searchFrom.date_out_range[0] && this.searchFrom.date_out_range[1]) {
        param.select_date_type = this.searchFrom.select_date_type
        let dateFormat = 'yyyy-MM-dd hh:mm:ss'
        if (this.searchFrom.select_date_type === 'travel_date') {
          dateFormat = 'yyyy-MM-dd'
        }
        param.start_time = this.formatDate(this.searchFrom.date_out_range[0], dateFormat)
        param.end_time = this.formatDate(this.searchFrom.date_out_range[1], dateFormat)
      }
      this.tableLoading = true

      getEcosystems(param).then(res => {
        if (res.code === 200) {
          this.tableSelections = []
          if (!_.isEmpty(this.checkBoxOrder)) {
            this.batchButtonName = '批量选择'
            this.checkBoxOrder = []
            this.$refs.multipleTable.clearSelection()
          }
          this.orderList = res.data
          this.total = res.total
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
        this.$message({
          message: '网络异常！',
          type: 'error'
        })
      })
    },

    // 时间日期格式化 yyyy-MM-dd hh:mm:ss yyyy-MM-dd
    formatDate: function(date, fmt) {
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
      return fmt
    },

    // 改变每页条数
    handleSizeChange: function(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getEcosystems()
      }
    },

    // 改变当前页
    handleCurrentChange: function(page) {
      this.page = page
      this.getEcosystems()
    },

    resetForm(formName) {
      this.tableSelections = []
      this.$refs[formName].resetFields()
      this.getEcosystems()
    }
  }
}
</script>

<style scoped>
  .count {
    margin-bottom: 20px;
    color: #606266;
    font-weight: bold;
  }
</style>
