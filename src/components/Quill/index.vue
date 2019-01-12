<template>
  <div class="the_my_editor_container">
    <quill-editor
      ref="myQuillEditor"
      :content="value"
      :options="editorOption"
      @change="onEditorChange"/>
    <el-upload
      ref="upload"
      :action="upload_path"
      :before-upload="beforeUpload"
      :data="uploadData"
      :on-success="upSuccess"
      :headers="uploadHeaders"
      class="upload-demo"
      style="display:none">
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        id="imgInput"
        size="small"
        type="primary"
        element-loading-text="插入中,请稍候"/>
    </el-upload>
  </div>
</template>

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getToken } from '@/utils/auth'

export default {
  components: { quillEditor },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      upload_path: `${process.env.BASE_API}/file/upload`,
      content: '', // 文章内容
      addRange: [],
      uploadData: {},
      uploadHeaders: {},
      photoUrl: '', // 上传图片地址
      uploadType: '', // 上传的文件类型（图片、视频）
      fullscreenLoading: false,
      editorOption: {
        placeholder: '请输入内容'
      }
    }
  },

  // 页面加载后执行 为编辑器的图片图标和视频图标绑定点击事件
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler) // 为视频ICON绑定事件
  },

  methods: {
    // 图片上传之前调取的函数
    // 这个钩子还支持 promise
    beforeUpload(file) {
      return this.qnUpload(file)
    },

    // 图片上传前获得数据token数据
    qnUpload(file) {
      this.uploadHeaders = {
        'Authorization': 'Bearer ' + getToken()
      }
    },

    // 图片上传成功回调   插入到编辑器中
    upSuccess: function(e, file, fileList) {
      this.fullscreenLoading = false
      const vm = this
      let url = ''
      if (e.code === 200) {
        url = e.url
      }
      if (url != null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
        let value = url
        // API: https://segmentfault.com/q/1010000008951906
        // this.$refs.myTextEditor.quillEditor.getSelection();
        // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
        vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
        value = value.indexOf('http') !== -1 ? value : 'http:' + value
        vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
      } else {
        this.$message.error(`${vm.uploadType}插入失败`)
      }
      this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
    },

    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        const fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'image'
    },

    // 点击视频ICON触发事件
    videoHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection()
      if (state) {
        const fileInput = document.getElementById('imgInput')
        fileInput.click() // 加一个触发事件
      }
      this.uploadType = 'video'
    },

    onEditorChange({ quill, html, text }) {
      this.$emit('input', html)
    }
  }
}
</script>

<style lang="sass">
  .quill-editor
    min-height: 500px

    .ql-container
      min-height: 500px

    .ql-snow .ql-editor img
      max-width: 480px

    .ql-editor .ql-video
      max-width: 480px
</style>
