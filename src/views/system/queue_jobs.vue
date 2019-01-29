<template>
  <div class="app-container">

    <!--Tools-->
    <el-row :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" >
        <el-form-item label="Queue" prop="queue">
          <el-input v-model="searchForm.queue" placeholder="Input..."/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getQueueJobs">Query</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('searchForm')">Clear</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cleanBull('failed')">Clean Bull #FailedJob</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cleanBull('completed')">Clean Bull #CompletedJob</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="cleanBull('all')">Clean Bull #AllJob</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="cleanLoading" @click="cleanSystemQueue('failed')">Clean System #FailedJob</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="cleanLoading" @click="cleanSystemQueue('repeat')">Clean System #RepeatJob</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="replayAllLoading" @click="replayAllJob()">Replay All</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--Sort-->
    <el-row :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="sortForm" :model="sortForm" :inline="true" >
        <el-form-item label="Sort" prop="sort_type">
          <el-select v-model="sortForm.sort_type" clearable placeholder="Select..." @change="sort">
            <el-option
              v-for="item in sort_type"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>

    <!--Counts-->
    <el-row v-if="Object.keys(counts).length > 0" :span="24" class="counts">
      <el-col v-for="(v, k) in counts" :key="`c_${k}`" :span="4" align="center">{{ k }}: {{ v }}</el-col>
    </el-row>

    <!--List-->
    <el-table v-loading="tableLoading" ref="multipleTable" :data="list" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="id" label="#" width="100" />
      <el-table-column prop="queue" label="Queue" width="150" />
      <el-table-column prop="payload" label="Payload" width="200" />
      <el-table-column prop="statistics" label="Statistics" width="100">
        <template slot-scope="scope">
          <div>attempts: {{ scope.row.attempts }}</div>
          <div>reserved: {{ scope.row.reserved }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="Time" width="200">
        <template slot-scope="scope">
          <div>reserved_at</div>
          <div>{{ scope.row.reserved_at }}</div>
          <div>available_at</div>
          <div>{{ scope.row.available_at }}</div>
          <div>updated_at</div>
          <div>{{ scope.row.updated_at }}</div>
          <div>created_at</div>
          <div>{{ scope.row.created_at || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Operating" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="replayJob(scope.row.id)">Replay</el-button>
            <el-button size="small" @click="deleteJob(scope.row.id)">Delete</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--Pagination-->
    <el-col :span="24" class="toolbar">
      <el-button size="mini" type="primary" style="float: left;" @click="batchCheck()">Replay</el-button>
      <el-pagination :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </el-col>
  </div>
</template>

<script>
import {
  getQueueJobs,
  replayQueueJob,
  deleteQueueJob,
  getQueueBullCounts,
  cleanQueueBullJob,
  cleanSystemQueue,
  replayAllQueueJob
} from '@/api/app'

export default {
  data() {
    return {
      sort_type: [
        { value: 'reserved_at', name: 'reserved_at' },
        { value: 'available_at', name: 'available_at' },
        { value: 'created_at', name: 'created_at' },
        { value: 'updated_at', name: 'updated_at' }
      ],

      // search
      searchForm: {
        queue: ''
      },

      // sort
      sortForm: {
        sort_type: ''
      },

      // batch
      tableSelections: [],

      // data
      list: [],
      pageSize: 10,
      total: 0,
      page: 1,
      tableLoading: false,

      // edit
      editForm: {
        status: ''
      },
      editVisible: false,
      editLoading: false,
      editRow: {},

      counts: {},
      cleanLoading: false,
      replayAllLoading: false,
      intervalHandle: null
    }
  },
  mounted() {
    this.getQueueJobs()
    this.intervalHandle = setInterval(() => {
      this.getQueueBullCounts()
    }, 2000)
  },
  beforeDestroy() {
    clearInterval(this.intervalHandle)
  },
  methods: {

    preview(url) {
      window.open(url)
    },

    sort() {
      this.getQueueJobs()
    },

    handleSelect(selection, row) {
      this.tableSelections = selection
    },

    handleSelectAll(selection) {
      this.tableSelections = selection
    },

    // batch
    batchCheck() {
      const id = []
      this.tableSelections.forEach(i => {
        id.push(i.id)
      })
      if (id.length > 0) {
        replayQueueJob({ id: id }).then(() => {
          this.getQueueJobs()
        })
      }
    },

    // List
    getQueueJobs() {
      const param = {
        page: this.page,
        limit: this.pageSize
      }
      if (this.searchForm.queue !== '') {
        param.queue = this.searchForm.queue
      }
      if (this.sortForm.sort_type !== '') {
        param.sort_type = this.sortForm.sort_type
      }

      this.tableLoading = true
      getQueueJobs(param).then(res => {
        this.list = res.rows
        this.total = res.count
        this.tableLoading = false
      })
    },
    getQueueBullCounts() {
      getQueueBullCounts().then(res => {
        this.counts = res
      })
    },

    handleSizeChange(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getQueueJobs()
      }
    },

    handleCurrentChange(page) {
      this.page = page
      this.getQueueJobs()
    },

    resetForm(formName) {
      this.pageSize = 10
      this.page = 1
      this.tableSelections = []
      this.$refs[formName].resetFields()
      this.getQueueJobs()
    },
    replayJob(id) {
      replayQueueJob({ id: [id] }).then(() => {
        this.getQueueJobs()
      })
    },
    deleteJob(id) {
      this.$confirm(`Confirm delete this Job [${id}] ?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteQueueJob({ id: id }).then(() => {
          this.getQueueJobs()
        })
      })
    },
    cleanBull(type) {
      this.$confirm(`Confirm clean Bull ${type} Job?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        cleanQueueBullJob({ type }).then(() => {
          this.$message({ type: 'success', message: 'Clean' })
          this.getQueueBullCounts()
        })
      })
    },
    cleanSystemQueue(type) {
      this.$confirm(`Confirm clean System ${type} Job?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.cleanLoading = true
        cleanSystemQueue({ type }).then(() => {
          this.$message({ type: 'success', message: 'Clean' })
          this.cleanLoading = false
          this.getQueueJobs()
        })
      })
    },
    replayAllJob() {
      this.replayAllLoading = true
      replayAllQueueJob().then(() => {
        this.$message({ type: 'success', message: 'Replay All' })
        this.replayAllLoading = false
        this.getQueueBullCounts()
        this.getQueueJobs()
      })
    }
  }
}
</script>

<style scoped>
  .counts {
    margin-top: 10px;
    margin-bottom: 30px;
    color: #606266;
  }
</style>
