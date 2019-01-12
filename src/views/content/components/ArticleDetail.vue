<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <CategoryDropdown v-model="postForm.category" :site-id="postForm.platforms"/>
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm(0)">草稿</el-button>
        <el-button type="info" @click="$router.back()">返回</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.author" required />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="date" format="yyyy-MM-dd" placeholder="选择日期时间"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="关键词:">
          <el-input :rows="1" v-model="postForm.keywords" type="textarea" class="article-textarea" autosize placeholder="请输入关键词"/>
          <span v-show="keywordsLength" class="word-counter">{{ keywordsLength }}字</span>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="摘要:">
          <el-input :rows="1" v-model="postForm.description" type="textarea" class="article-textarea" autosize placeholder="请输入摘要"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <div class="editor-container">
          <Editor v-model="postForm.content" />
        </div>

        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.cover" />
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Upload from '@/components/Upload/coverImage'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown, CategoryDropdown } from './Dropdown'
import { createArticle, getArticle } from '@/api/content'
import moment from 'moment'
import Editor from '@/components/Quill'
import { editArticle } from '../../../api/content'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  keywords: '', // 文章关键词
  description: '', // 文章摘要
  source_uri: '', // 文章外链
  cover: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: 0,
  category: [],
  comment_disabled: true,
  importance: 0,
  author: '管理员'
}

export default {
  name: 'ArticleDetail',
  components: { Editor, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown, CategoryDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      articleId: 0,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    },
    keywordsLength() {
      return this.postForm.keywords.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      this.articleId = this.$route.params && this.$route.params.id
      this.fetchData(this.articleId)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      getArticle(id).then(response => {
        const statusMap = {
          0: 'draft',
          1: 'published',
          2: 'deleted'
        }
        const data = response
        this.postForm = Object.assign({}, defaultForm)
        this.postForm.status = statusMap[data.state]
        this.postForm.title = data.title
        this.postForm.content = data.content
        this.postForm.description = data.description
        this.postForm.keywords = data.keywords
        this.postForm.url = data.url
        this.postForm.cover = data.cover
        this.postForm.author = data.author
        this.postForm.display_time = data.posted_at
        this.postForm.platforms = data.site_id
        this.postForm.category = [data.category_id]

        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(() => {
        // console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.$route, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm(state) {
      // console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          const para = Object.assign({}, this.postForm)
          para.category_id = this.postForm.category[this.postForm.category.length - 1]
          para.state = state
          if (typeof this.postForm.display_time === 'object') {
            para.posted_at = moment(this.postForm.display_time).format('YYYY-MM-DD')
          } else {
            para.posted_at = this.postForm.display_time
          }
          if (this.isEdit) {
            para.id = this.articleId
            editArticle(para).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: '文章修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm = Object.assign({}, defaultForm)
                this.loading = false
                this.$router.back()
              }
            })
          } else {
            createArticle(para).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: '文章创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm = Object.assign({}, defaultForm)
                this.loading = false
              }
            })
          }
        } else {
          return false
        }
      })
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
</style>
