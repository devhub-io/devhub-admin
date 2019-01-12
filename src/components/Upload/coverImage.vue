<template>
  <div class="upload-container">
    <el-upload
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :headers="uploadHeaders"
      :action="upload_path"
      class="image-uploader"
      drag>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">封面图片，将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="image-preview image-app-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage"/>
        </div>
      </div>
    </div>
    <div class="image-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'CoverImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      upload_path: `${process.env.BASE_API}/file/upload`,
      tempUrl: ''
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    uploadHeaders() {
      return { 'Authorization': 'Bearer ' + getToken() }
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(r) {
      if (r.code === 200) {
        this.emitInput(r.url)
      } else {
        this.$message.error(r.message)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 370px;
    height: 220px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
