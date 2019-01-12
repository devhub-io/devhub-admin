<template>
  <div class="amap-page-container">
    <el-amap-search-box
      :default="address"
      :search-option="searchOption"
      :on-search-result="onSearchResult"
      class="search-box"/>
    <el-amap
      ref="map"
      :amap-manager="amapManager"
      :center="center"
      :zoom="zoom"
      :plugin="plugin"
      :events="events"
      vid="amapComponent"
      class="amap-wrapper">
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :visible="marker.visible"
        :draggable="marker.draggable"
        :vid="index"/>
    </el-amap>
    <div class="toolbar">
      <el-row>
        <el-col :span="24">
          <button @click="location">定位</button>
          <button @click="moveCenter">居中</button>
          <button @click="getPoi">信息</button>
          <span class="lnglat-info">经度：{{ lnglat.lng }} 纬度：{{ lnglat.lat }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">地址：</el-col>
        <el-col :span="20">
          <el-input v-model="cAddress" type="text" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AMapManager } from 'vue-amap'
const amapManager = new AMapManager()
export default {
  props: {
    address: {
      type: String,
      required: true
    },
    lng: {
      type: Number,
      default: 0
    },
    lat: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      amapManager,
      zoom: 14,
      center: [113.264385, 23.129112],
      events: {
        'click': (e) => {
          this.lnglat.lng = e.lnglat.lng
          this.lnglat.lat = e.lnglat.lat
          this.$emit('getlnglat', { lng: e.lnglat.lng, lat: e.lnglat.lat })
          this.markers = [{
            position: [this.lnglat.lng, this.lnglat.lat]
          }]
        }
      },
      plugin: [{
        pName: 'ToolBar',
        position: 'RT'
      }],
      markers: [],
      searchOption: {
        city: '广东',
        citylimit: false
      },
      poi: {},
      lnglat: {
        lng: this.lng,
        lat: this.lat
      },
      cAddress: this.address
    }
  },
  watch: {
    address: function() {
      this.cAddress = this.address
    },
    lng: function() {
      this.lnglat.lng = this.lng
      this.location()
    },
    lat: function() {
      this.lnglat.lat = this.lat
      this.location()
    }
  },
  methods: {
    location() {
      this.markers = [{
        position: [this.lnglat.lng, this.lnglat.lat]
      }]
      this.moveCenter()
    },
    moveCenter() {
      if (this.lnglat.lng > 0 && this.lnglat.lat > 0) {
        this.center = [this.lnglat.lng, this.lnglat.lat]
      }
    },
    getPoi() {
      this.$alert(`<p style="overflow-y: scroll;">${JSON.stringify(this.poi)}</p>`, '定位信息', {
        dangerouslyUseHTMLString: true
      })
    },
    onSearchResult(pois) {
      if (pois.length > 0) {
        this.markers = []
        // pois.forEach(poi => {
        //   this.markers.push({ position: [poi.lng, poi.lat], template: `<span>${poi.address}</span>` })
        // })

        this.lnglat.lng = pois[0].lng
        this.lnglat.lat = pois[0].lat
        this.cAddress = pois[0].address
        this.center = [this.lnglat.lng, this.lnglat.lat]
        this.poi = pois[0]

        this.$emit('getaddress', this.cAddress)
        this.$emit('getlnglat', { lng: this.lnglat.lng, lat: this.lnglat.lat })
      }
    }
  }
}
</script>

<style scoped>
  .amap-page-container {
    width: 100%;
    height: 400px;
  }
  .amap-wrapper {
    height: 300px !important;
  }
  .lnglat-info {
    float: right;
  }
  .search-box {
    width: 100%;
  }
</style>
