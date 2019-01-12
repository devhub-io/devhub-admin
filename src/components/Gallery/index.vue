<template>
  <el-dialog :visible="showWindow" title="图库">
    <el-row>
      <el-col :span="4">
        <el-tree
          :data="imageFolders"
          :props="treeProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          node-key="id"
          @node-click="handleNodeClick"/>
      </el-col>
      <el-col v-loading="tableLoading" :span="20">
        <el-row>
          <el-col :span="24" class="image-tools">
            <el-checkbox @change="checkAllImage">全选</el-checkbox>
          </el-col>
          <el-col v-for="item in images" :span="4" :key="item.id" :offset="1">
            <el-card :body-style="{ padding: '0px' }" class="image-item">
              <img :src="imageUrl(item.flag)" class="image" @click="checkImage(item.flag)">
              <img v-show="checkId.indexOf(item.flag) > -1" :src="checkImg" class="check-icon" alt="">
              <div style="padding: 14px;">
                <span>{{ item.title }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col v-if="images.length === 0" :span="24" class="no-images">
            暂无图片
          </el-col>
          <el-col :span="24">
            <!--分页-->
            <el-col :span="24" class="toolbar">
              <el-pagination :page-sizes="[12, 24, 36, 48]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="insertImages">插 入</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getImageFolders, getImageList } from '@/api/app'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showWindow: false,
      checkImg: require('../../assets/custom-theme/check.jpg'),
      total: 0,
      page: 1,
      pageSize: 12,
      folder_id: 0,
      tableLoading: false,
      images: [],
      imageFolders: [],
      checkId: [],
      baseUrl: process.env.BASE_URL,
      baseApi: process.env.BASE_API,
      uploadVisible: false,
      searchFrom: {
        keyword: '',
        source: ''
      },
      loading: false,
      treeProps: {
        children: 'children',
        label: 'name'
      },
      optionProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      }
    }
  },
  mounted() {
    this.getImages()
    this.getImageFolders()
  },
  methods: {
    show: function() {
      this.showWindow = true
    },
    close: function() {
      this.showWindow = false
    },
    insertImages: function() {
      this.$emit('gallery-insertImages', this.checkId)
      this.checkId = []
      this.close()
    },

    handleNodeClick(data, node) {
      this.folder_id = node.key
      this.getImages()
    },
    // 改变每页条数
    handleSizeChange: function(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getImages()
      }
    },

    // 改变当前页
    handleCurrentChange: function(page) {
      this.page = page
      this.getImages()
    },

    // 获取列表
    getImages: function() {
      const param = {}
      if (this.searchFrom.keyword) {
        param.keyword = this.searchFrom.keyword
      }
      if (this.searchFrom.source) {
        param.source = this.searchFrom.source
      }
      if (this.folder_id > 0) {
        param.folder_id = this.folder_id
      }
      param.page = this.page
      param.per_page = this.pageSize
      this.tableLoading = true
      getImageList(param).then(res => {
        if (res.code === 200) {
          this.images = res.data
          this.total = res.total
        }
        this.tableLoading = false
      })
    },
    getImageFolders: function() {
      getImageFolders().then(res => {
        if (res.code === 200) {
          this.imageFolders = res.data
        }
      })
    },
    checkImage: function(flag) {
      const index = this.checkId.indexOf(flag)
      if (index > -1) {
        this.checkId.splice(index, 1)
      } else {
        this.checkId.push(flag)
      }
    },
    checkAllImage: function() {
      if (this.checkId.length === this.images.length) {
        this.checkId = []
      } else {
        this.checkId = []
        this.images.forEach(i => {
          this.checkId.push(i.flag)
        })
      }
    },

    imageUrl: function(flag) {
      return `${this.baseUrl}/image/${flag}.jpg?h=100`
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .image-item {
    margin-bottom: 15px;
    height: 200px;
  }
  .image-item img {
    height: 150px;
  }
  .image-item .lead {
    position: relative;
    left: 130px;
    bottom: 150px;
    width: 48px !important;
    height: 48px !important;
    line-height: 75px;
    color: #fff;
    transform: rotate(45deg) translateY(-34px);
    text-align: center;
    /*cursor: pointer;*/
    background: rgba(0,0,0,0.5);
  }
  .check-icon {
    width: 20px !important;
    height: 20px !important;
    position: relative;
    left: 0px;
    bottom: 150px;
  }
  .no-images {
    height: 100px;
    text-align: center;
    color: #5a5e66;
  }
  .image-tools {
    margin-bottom: 15px;
  }
</style>
