<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <router-link to="/article/create">
            <el-button type="info" icon="el-icon-plus">创建文章</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="#" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="站点">
        <template slot-scope="scope">
          <span>{{ scope.row.site.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" label="栏目">
        <template slot-scope="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusTagFilter">{{ scope.row.state | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="scope">
          <i v-if="scope.row.cover.length > 0" class="el-icon-picture" title="封面图片"/>
          <router-link :to="'/article/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.posted_at | parsePostedAt }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button v-show="scope.row.state !== 2" type="danger" size="small" icon="el-icon-delete" @click="deleteArticle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right;" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </el-col>
  </div>
</template>

<script>
import { getArticles } from '@/api/content'
import { deleteArticle } from '../../api/content'
import moment from 'moment'

export default {
  name: 'ArticleList',
  filters: {
    statusTagFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      const statusMap = {
        0: '草稿',
        1: '发布',
        2: '删除'
      }
      return statusMap[status]
    },
    typeTextFilter(type) {
      const typeMap = {
        0: '图文',
        1: '视频',
        2: '图片',
        3: '问答'
      }
      return typeMap[type]
    },
    parsePostedAt(val) {
      if (val === '' || val === undefined || val === null) {
        return '-'
      } else {
        return moment(val).format('YYYY-MM-DD')
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      pageSize: 10,
      page: 1,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getArticles({ page: this.page, per_page: this.pageSize }).then((res) => {
        this.listLoading = false
        if (res.code === 200) {
          this.list = res.data
          this.total = res.total
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    deleteArticle(data) {
      this.$confirm(`确认删除( ${data.title} )吗？`, '提示', {}).then(() => {
        deleteArticle({ id: data.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
