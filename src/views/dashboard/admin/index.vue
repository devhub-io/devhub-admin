<template>
  <div class="dashboard-editor-container">

    <el-row>
      <div>
        {{ since | date }} - {{ until | date }}
      </div>
    </el-row>

    <panel-group :users="users" :visitors="visitors" :views="views" :ecosystems="ecosystems" @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData"/>
        </div>
      </el-col>
      <el-col v-if="false" :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart/>
        </div>
      </el-col>
      <el-col v-if="false" :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { analyticsWebsite, analyticsEcosystem, analyticsUser } from '@/api/app'
import moment from 'moment'

const lineChartData = {
  users: {
    actualData: [],
    xAxis: [],
    name: 'Users'
  },
  visitors: {
    actualData: [],
    xAxis: [],
    name: 'Visitors'
  },
  pageViews: {
    actualData: [],
    xAxis: [],
    name: 'PageViews'
  },
  empty: {
    actualData: [],
    xAxis: [],
    name: 'Actual'
  }
}
const pieChartData = {
  actualData: [],
  xAxis: [],
  name: 'Search Engine'
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TodoList,
    BoxCard
  },
  filters: {
    date(val) {
      return moment(val).format('YYYY-MM-DD')
    }
  },
  data() {
    return {
      lineChartData: lineChartData.users,
      pieChartData: pieChartData,
      websiteData: {},
      users: 0,
      views: 0,
      visitors: 0,
      ecosystems: 0,

      since: '',
      until: ''
    }
  },
  mounted() {
    this.analyticsWebsite()
    this.analyticsUser()
    this.analyticsEcosystem()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    analyticsWebsite() {
      analyticsWebsite({}).then(res => {
        this.websiteData = res
        // LineChart
        const xAxis = []
        const pageViewsData = []
        const uniquesData = []
        this.websiteData.timeseries.forEach(item => {
          xAxis.push(moment(item.since).format('MM-DD'))
          uniquesData.push(item.uniques.all)
          pageViewsData.push(item.pageviews.all)
        })
        lineChartData.visitors.actualData = uniquesData
        lineChartData.visitors.xAxis = xAxis
        lineChartData.pageViews.actualData = pageViewsData
        lineChartData.pageViews.xAxis = xAxis
        this.lineChartData = lineChartData.visitors
        // Total
        this.visitors = this.websiteData.totals.uniques.all
        this.views = this.websiteData.totals.pageviews.all
        // Date
        this.since = this.websiteData.totals.since
        this.until = this.websiteData.totals.until
        // PieChart
        this.pieChartData.xAxis = Object.keys(this.websiteData.totals.pageviews.search_engine)
        const pieData = []
        Object.keys(this.websiteData.totals.pageviews.search_engine).forEach(key => {
          pieData.push({
            name: key,
            value: this.websiteData.totals.pageviews.search_engine[key]
          })
        })
        this.pieChartData.actualData = pieData
      })
    },
    analyticsUser() {
      analyticsUser({}).then(res => {
        this.users = res.count
      })
    },
    analyticsEcosystem() {
      analyticsEcosystem({}).then(res => {
        this.ecosystems = res.count
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
