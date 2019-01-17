<template>
  <div class="app-container tree">
    <el-button
      size="mini"
      @click="back">
      Back
    </el-button>
    <div class="tree-container">
      <div class="block">
        <p>{{ title }}</p>
        <div>
          <el-button
            type="text"
            size="mini"
            @click="create">
            Create Node
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="enable">
            Select enable
          </el-button>
        </div>
        <el-tree
          :data="data5"
          :expand-on-click-node="false"
          show-checkbox
          node-key="id"
          default-expand-all>
          <span slot-scope="{ node, data }" class="tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="create">
                Append
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="edit">
                Edit
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="items">
                Items
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="confirmDelete">
                Delete
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!--Create-->
    <el-dialog :visible.sync="createVisible" title="Create">
      <el-form ref="paymentOrderForm" :model="createForm" label-width="120px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="createForm.title" type="text"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">Cancel</el-button>
        <el-button :loading="createLoading" type="primary" @click="createSubmit">Submit</el-button>
      </span>
    </el-dialog>

    <!--Edit-->
    <el-dialog :visible.sync="editVisible" title="Edit">
      <el-form ref="paymentOrderForm" :model="createForm" label-width="120px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="editForm.title" type="text"/>
        </el-form-item>
        <el-form-item label="Parent" prop="parent_id">
          <el-cascader
            v-model="editForm.parent_id"
            :options="options"
            placeholder="search..."
            filterable
          />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="editForm.status" clearable placeholder="Select...">
            <el-option
              v-for="item in status_lists"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input v-model="editForm.sort" type="number"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">Cancel</el-button>
        <el-button :loading="editLoading" type="primary" @click="editSubmit">Submit</el-button>
      </span>
    </el-dialog>

    <!--Items-->
    <el-dialog :visible.sync="itemsVisible" title="Items">
      <el-form ref="paymentOrderForm" :model="itemsForm" label-width="120px">
        <el-button @click="createItemVisible = true">Create Item</el-button>
        <el-row :gutter="1">
          <el-col :span="24" class="item-col">
            <el-card shadow="always">
              Item 1
            </el-card>
          </el-col>
          <el-col :span="24" class="item-col">
            <el-card shadow="always">
              Item 1
            </el-card>
          </el-col>
          <el-col :span="24" class="item-col">
            <el-card shadow="always">
              Item 1
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="itemsVisible = false">Cancel</el-button>
        <el-button :loading="itemsLoading" type="primary">Submit</el-button>
      </span>
    </el-dialog>

    <!--Add Item-->
    <el-dialog :visible.sync="createItemVisible" title="Create Item" width="40%">
      <el-form ref="paymentOrderForm" :model="itemsForm" label-width="120px">
        <el-tabs type="border-card">
          <el-tab-pane label="Repos">
            <el-form-item label="Search" prop="search">
              <el-input v-model="createItemForm.search" type="text"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Developer">Developer</el-tab-pane>
          <el-tab-pane label="Site">Site</el-tab-pane>
          <el-tab-pane label="Link">
            <el-tab-pane label="Repos">
              <el-form-item label="Url" prop="url">
                <el-input v-model="createItemForm.url" type="url"/>
              </el-form-item>
            </el-tab-pane>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createItemVisible = false">Cancel</el-button>
        <el-button :loading="createItemLoading" type="primary">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getEcosystems, switchEcosystem, editEcosystem, createEcosystem } from '@/api/ecosystem'
let id = 1000
export default {
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      id: 0,
      title: '',
      data4: JSON.parse(JSON.stringify(data)),
      data5: JSON.parse(JSON.stringify(data)),

      // Edit
      editForm: {
        status: ''
      },
      editVisible: false,
      editLoading: false,
      editRow: {},

      // Create
      createForm: {
        title: ''
      },
      createVisible: false,
      createLoading: false,

      // Items
      itemsForm: {
        status: ''
      },
      itemsVisible: false,
      itemsLoading: false,

      // Items
      createItemForm: {
        status: ''
      },
      createItemVisible: false,
      createItemLoading: false,

      // Status
      status_lists: [
        { value: 0, name: 'Disable' },
        { value: 1, name: 'Enable' },
        { value: 2, name: 'Delete' }
      ],

      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  mounted() {
    // this.getEcosystems()
    this.title = this.$route.query.title || '--'
    this.id = this.$route.params.id || 0
  },
  methods: {
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    enable() {

    },

    create() {
      this.createVisible = true
    },
    createSubmit() {

    },

    edit() {
      this.editVisible = true
    },
    editSubmit() {

    },

    items() {
      this.itemsVisible = true
    },
    confirmDelete() {
      this.$confirm('Confirm delete this node ?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
      })
    },

    back() {
      this.$router.go(-1)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .tree .leaf {
    width: 20px;
    background: #ddd
  }

  .tree .folder {
    width: 20px;
    background: #888
  }

  .tree .buttons, .tree .filter-tree {
    margin-top: 20px
  }

  .tree .tree-container {
    display: -ms-flexbox;
    display: flex;
    margin: -24px
  }

  .tree .block {
    -ms-flex: 1;
    flex: 1;
    padding: 8px 24px 24px
  }

  .tree .block > p {
    text-align: center;
    margin: 0;
    line-height: 4
  }

  .tree .block:first-child {
    border-right: 1px solid #eff2f6
  }

  .tree .tree-node {
    -ms-flex: 1;
    flex: 1;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px
  }

  .item-col {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
