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
          v-loading="collectionsLoading"
          :data="collections"
          :expand-on-click-node="false"
          show-checkbox
          node-key="id"
          default-expand-all>
          <span slot-scope="{ node, data }" class="tree-node">
            <span>{{ data.title }}</span>
            <span>
              [{{ data.status | status }}](S: {{ data.sort }}, V: {{ data.view_number }})
              <el-button
                type="text"
                size="mini"
                @click="append(data)">
                Append
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="edit(data)">
                Edit
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="move(data)">
                Move
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="items(data)">
                Items
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="confirmDelete(data)">
                Delete
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!--Create/Append-->
    <el-dialog :visible.sync="createVisible" :title="dialogTitle">
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
    <el-dialog :visible.sync="editVisible" :title="`Edit [${selectNode.title}]`">
      <el-form ref="paymentOrderForm" :model="createForm" label-width="120px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="editForm.title" type="text"/>
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="editForm.slug" type="text"/>
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

    <!--Move-->
    <el-dialog :visible.sync="moveVisible" :title="`Move [${selectNode.title}]`">
      <el-form ref="paymentOrderForm" :model="moveForm" label-width="120px">
        <el-form-item label="Parent" prop="parent_id">
          <el-cascader
            v-model="moveForm.parent_id"
            :options="cascaderData"
            :props="cascaderProps"
            :show-all-levels="false"
            :change-on-select="true"
            placeholder="search..."
            filterable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveVisible = false">Cancel</el-button>
        <el-button :loading="moveLoading" type="primary" @click="moveSubmit">Submit</el-button>
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
import _ from 'lodash'
import { createEcosystemCollection, getEcosystemCollections, editEcosystemCollection, deleteEcosystemCollection } from '@/api/ecosystem'

export default {
  filters: {
    status(val) {
      if (val === 1) {
        return 'En'
      } else if (val === 0) {
        return 'Dis'
      } else if (val === 2) {
        return 'Del'
      } else {
        return '--'
      }
    }
  },
  data() {
    return {
      topic_id: 0,
      title: '',
      collections: [],
      collectionsLoading: false,
      selectNode: {},
      cascaderData: [],
      cascaderProps: {
        value: 'id',
        label: 'title'
      },

      // Edit
      editForm: {
        status: ''
      },
      editVisible: false,
      editLoading: false,

      // Move
      moveForm: {
        status: ''
      },
      moveVisible: false,
      moveLoading: false,

      // Create
      createForm: {
        title: ''
      },
      createVisible: false,
      createLoading: false,
      dialogTitle: 'Create',

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
      ]
    }
  },
  mounted() {
    this.title = this.$route.query.title || '--'
    this.topic_id = this.$route.params.id || 0
    this.getEcosystemCollections()
  },
  methods: {
    enable() {

    },

    create() {
      this.createVisible = true
      this.dialogTitle = 'Create'
      this.selectNode = {}
      this.createForm.title = ''
    },
    append(data) {
      this.createVisible = true
      this.dialogTitle = `[${data.title}] : Append node`
      this.selectNode = _.clone(data)
      this.createForm.title = ''
    },
    createSubmit() {
      if (this.createForm.title !== '') {
        const params = {
          topic_id: this.topic_id,
          title: this.createForm.title,
          parent_id: this.selectNode === {} ? 0 : this.selectNode.id
        }
        this.createLoading = true
        createEcosystemCollection(params).then(() => {
          this.createVisible = false
          this.createLoading = false
          this.getEcosystemCollections()
        })
      }
    },

    edit(data) {
      this.editVisible = true
      this.editForm = data
      this.selectNode = _.clone(data)
    },
    editSubmit() {
      const params = {
        id: this.selectNode.id,
        title: this.editForm.title,
        slug: this.editForm.slug,
        status: this.editForm.status,
        sort: this.editForm.sort
      }
      this.editLoading = true
      editEcosystemCollection(params).then(() => {
        this.editVisible = false
        this.editLoading = false
        this.getEcosystemCollections()
      })
    },
    move(data) {
      this.moveVisible = true
      this.selectNode = _.clone(data)
      this.moveForm.parent_id = []
    },
    moveSubmit() {
      const parent_id = this.moveForm.parent_id[this.moveForm.parent_id.length - 1]
      const params = {
        id: this.selectNode.id,
        parent_id: parent_id
      }
      this.moveLoading = true
      editEcosystemCollection(params).then(() => {
        this.moveVisible = false
        this.moveLoading = false
        this.getEcosystemCollections()
      })
    },

    items() {
      this.itemsVisible = true
    },
    confirmDelete(data) {
      this.$confirm(`Confirm delete this node [${data.title}] ?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteEcosystemCollection({ id: data.id }).then(() => {
          this.getEcosystemCollections()
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
    },

    getEcosystemCollections() {
      this.collectionsLoading = true
      getEcosystemCollections({ id: this.topic_id }).then(res => {
        this.collections = res
        this.collectionsLoading = false
        this.cascaderData = _.clone(this.collections)
        this.cascaderData.push({ id: 0, title: 'Root Path' })
      })
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
