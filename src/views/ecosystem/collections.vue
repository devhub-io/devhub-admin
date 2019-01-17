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
            <span>[{{ data.id }}] {{ data.title }}</span>
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
                @click="showItems(data)">
                Items
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="confirmDelete(data)">
                Delete
              </el-button>
              <el-button
                type="text"
                size="mini">
                Preview
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
    <el-dialog :visible.sync="itemsVisible" :title="`${selectNode.title} Items`">
      <el-form ref="paymentOrderForm" :model="itemsForm" label-width="120px">
        <el-button @click="createItemVisible = true">Create Item</el-button>
        <el-row v-loading="itemsListLoading" :gutter="1">
          <el-col v-for="item in items" :key="item.id" :span="24" class="item-col">
            <el-card shadow="always">
              {{ item.title }} [type: {{ item.type }} foreign_id: {{ item.foreign_id }}]
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
      <el-form ref="paymentOrderForm" :model="createItemForm" label-width="120px">
        <el-tabs v-model="createItemForm.type" type="border-card">
          <el-tab-pane label="Text" name="text">
            <el-form-item label="Text" prop="text">
              <el-input v-model="createItemForm.text" type="text"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Repos" name="repos">
            <el-form-item label="Search" prop="search">
              <el-autocomplete
                :fetch-suggestions="queryReposSearchAsync"
                placeholder="Search..."
                @select="handleSelectRepos"
              >
                <i slot="suffix" class="el-icon-search el-input__icon"/>
                <template slot-scope="{ item }">
                  <div class="title">{{ item.owner }}/{{ item.repo }}</div>
                  <span class="star"><i class="el-icon-star-on" /> {{ item.stargazers_count }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-row v-if="createItemForm.repos" justify="space-around">
              <el-col :span="24">
                <el-button
                  type="text"
                  size="mini"
                  @click="createItemForm.repos = {}">
                  Clear
                </el-button>
              </el-col>
              <el-col :span="24">
                <div class="title">{{ createItemForm.repos.owner }}/{{ createItemForm.repos.repo }}</div>
                <span class="star"><i class="el-icon-star-on" /> {{ createItemForm.repos.stargazers_count }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Developer" name="developers">
            <el-form-item label="Search" prop="search">
              <el-autocomplete
                :fetch-suggestions="queryDeveloperSearchAsync"
                placeholder="Search..."
                @select="handleSelectDeveloper"
              >
                <i slot="suffix" class="el-icon-search el-input__icon"/>
                <template slot-scope="{ item }">
                  <div class="title">{{ item.login }}({{ item.name }})</div>
                  <span class="user"><i class="el-icon-info" /> {{ item.followers }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-row v-if="createItemForm.developer" justify="space-around">
              <el-col :span="24">
                <el-button
                  type="text"
                  size="mini"
                  @click="createItemForm.developer = {}">
                  Clear
                </el-button>
              </el-col>
              <el-col :span="24">
                <div class="title">{{ createItemForm.developer.login }}({{ createItemForm.developer.name }})</div>
                <span class="star"><i class="el-icon-info" /> {{ createItemForm.developer.followers }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Site" name="sites">
            <el-form-item label="Search" prop="search">
              <el-autocomplete
                :fetch-suggestions="querySiteSearchAsync"
                placeholder="Search..."
                @select="handleSelectSite"
              >
                <i slot="suffix" class="el-icon-search el-input__icon"/>
                <template slot-scope="{ item }">
                  <div class="title">{{ item.title }}</div>
                  <span class="url">{{ item.url }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-row v-if="createItemForm.site" justify="space-around">
              <el-col :span="24">
                <el-button
                  type="text"
                  size="mini"
                  @click="createItemForm.site = {}">
                  Clear
                </el-button>
              </el-col>
              <el-col :span="24">
                <div class="title">{{ createItemForm.site.title }}</div>
                <span class="url">{{ createItemForm.site.url }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Link" name="links">
            <el-form-item label="Title" prop="title">
              <el-input v-model="createItemForm.title" type="text"/>
            </el-form-item>
            <el-form-item label="Url" prop="url">
              <el-input v-model="createItemForm.url" type="url"/>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createItemVisible = false">Cancel</el-button>
        <el-button :loading="createItemLoading" type="primary" @click="createItemSubmit">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  createEcosystemCollection,
  getEcosystemCollections,
  editEcosystemCollection,
  deleteEcosystemCollection,
  getEcosystemCollectionItems,
  createEcosystemCollectionItem
} from '@/api/ecosystem'
import {
  getSites,
  getRepos,
  getDevelopers
} from '@/api/app'

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
      itemsListLoading: false,
      items: [],

      // Items
      createItemForm: {
        type: 'text',
        text: '',
        repos: {},
        developer: {},
        site: {},
        url: ''
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

    showItems(data) {
      this.itemsVisible = true
      this.items = []
      this.selectNode = _.clone(data)
      this.getEcosystemCollectionItems()
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

    createItemSubmit() {
      console.log(this.createItemForm)
      this.createItemLoading = true
      const params = {
        collection_id: this.selectNode.id,
        title: this.createItemForm.text,
        type: this.createItemForm.type,
        url: this.createItemForm.url
      }
      if (this.createItemForm.type === 'links') {
        params.title = this.createItemForm.title
      }
      if (this.createItemForm.type === 'repos') {
        params.foreign_id = this.createItemForm.repos.id
      }
      if (this.createItemForm.type === 'developers') {
        params.foreign_id = this.createItemForm.developer.id
      }
      if (this.createItemForm.type === 'sites') {
        params.foreign_id = this.createItemForm.site.id
      }
      createEcosystemCollectionItem(params).then(() => {
        this.createItemLoading = false
        this.createItemVisible = false
        this.getEcosystemCollectionItems()
      })
    },

    back() {
      this.$router.go(-1)
    },

    async queryReposSearchAsync(queryString, cb) {
      const res = await getRepos({ slug: queryString, sort_type: 'stargazers_count' })
      cb(res.rows)
    },
    handleSelectRepos(item) {
      this.createItemForm.repos = item
    },

    async queryDeveloperSearchAsync(queryString, cb) {
      const res = await getDevelopers({ login: queryString, sort_type: 'followers' })
      cb(res.rows)
    },
    handleSelectDeveloper(item) {
      this.createItemForm.developer = item
    },

    async querySiteSearchAsync(queryString, cb) {
      const res = await getSites({ title: queryString, sort_type: 'sort' })
      cb(res.rows)
    },
    handleSelectSite(item) {
      this.createItemForm.site = item
    },

    getEcosystemCollections() {
      this.collectionsLoading = true
      getEcosystemCollections({ id: this.topic_id }).then(res => {
        this.collections = res
        this.collectionsLoading = false
        this.cascaderData = _.clone(this.collections)
        this.cascaderData.push({ id: 0, title: 'Root Path' })
      })
    },

    getEcosystemCollectionItems() {
      this.itemsListLoading = true
      getEcosystemCollectionItems({ id: this.selectNode.id }).then(res => {
        this.items = res
        this.itemsListLoading = false
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
