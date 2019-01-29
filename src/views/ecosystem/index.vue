<template>
  <div class="app-container">

    <!--Tools-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" >
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="searchForm.slug" placeholder="Input..."/>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="Select...">
            <el-option
              v-for="item in status_lists"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getEcosystems">Query</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('searchForm')">Clear</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="showCreate">Create</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="checkCollectionItemsLoading" type="info" @click="checkCollectionItems">#CollectionItemsCheck</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--Sort-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="sortForm" :model="sortForm" :inline="true" >
        <el-form-item label="Sort" prop="sort_type">
          <el-select v-model="sortForm.sort_type" clearable placeholder="Select..." @change="sort">
            <el-option
              v-for="item in sort_type"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>

    <!--List-->
    <el-table v-loading="tableLoading" ref="multipleTable" :data="list" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="id" label="#" width="100" />
      <el-table-column prop="title" label="Title" width="100" />
      <el-table-column prop="slug" label="Slug" width="130" />
      <el-table-column prop="description" label="Description" width="200" />
      <el-table-column prop="statistics" label="Statistics" width="200">
        <template slot-scope="scope">
          <div>view_number: {{ scope.row.view_number }}</div>
          <div>sort: {{ scope.row.sort }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="Time" width="200">
        <template slot-scope="scope">
          <div>updated_at</div>
          <div>{{ scope.row.updated_at }}</div>
          <div>created_at</div>
          <div>{{ scope.row.created_at || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatStatus" prop="status" label="Status" align="center" width="100"/>
      <el-table-column prop="homepage" label="Homepage" width="150"/>
      <el-table-column prop="github" label="Github" width="150" />
      <el-table-column prop="wiki" label="Wiki" width="150" />
      <el-table-column label="Operating" fixed="right" width="350">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="preview(scope.row.slug)">Preview</el-button>
            <el-button size="small" @click="showEdit(scope.row)">Edit</el-button>
            <el-button size="small" @click="showCollections(scope.row)">Collections</el-button>
            <el-button size="small" @click="showAttributes(scope.row)">Attributes</el-button>
            <el-button size="small" @click="showSource(scope.row)">Source</el-button>
            <el-button size="small" @click="showImport(scope.row)">Import</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--Pagination-->
    <el-col :span="24" class="toolbar">
      <el-button size="mini" type="primary" style="float: left;" @click="batchCheck()">Enable</el-button>
      <el-pagination :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </el-col>

    <!--Edit-->
    <el-dialog :visible.sync="editVisible" :title="`Edit ${editRow.title}`">
      <el-form ref="paymentOrderForm" :model="editForm" label-width="120px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="editForm.title" type="text"/>
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="editForm.slug" type="text"/>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="editForm.description" type="textarea"/>
        </el-form-item>
        <el-form-item label="Homepage" prop="homepage">
          <el-input v-model="editForm.homepage" type="url"/>
        </el-form-item>
        <el-form-item label="Github" prop="github">
          <el-input v-model="editForm.github" type="url"/>
        </el-form-item>
        <el-form-item label="Wiki" prop="wiki">
          <el-input v-model="editForm.wiki" type="url"/>
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input v-model="editForm.sort" type="number"/>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">Cancel</el-button>
        <el-button :loading="editLoading" type="primary" @click="editSubmit">Submit</el-button>
      </span>
    </el-dialog>

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

    <!--Attributes-->
    <el-dialog :visible.sync="attributesVisible" :title="`[${row.title}] Attributes`" width="70%">
      <el-form ref="paymentOrderForm" label-width="120px">
        <el-button @click="createAttributeVisible = true">Create Attribute</el-button>
        <el-row v-loading="attributesListLoading" :gutter="1">
          <el-col v-for="item in attributes" :key="item.id" :span="24" class="item-col">
            <el-card shadow="always" class="item-card">
              <el-col :span="4">
                <el-input-number v-model="item.sort" size="mini" @change="changeAttributeSort(item)"/>
              </el-col>
              <el-col :span="16">
                <el-form-item label="Key">
                  <el-input v-model="item.key"/>
                </el-form-item>
                <el-form-item label="Value">
                  <el-input v-model="item.value" type="textarea"/>
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-button
                  type="text"
                  size="mini"
                  class="color-blue"
                  @click="saveAttributeEdit(item)">
                  Save
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="color-red"
                  @click="confirmAttributeDelete(item)">
                  Delete
                </el-button>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attributesVisible = false">Cancel</el-button>
      </span>
    </el-dialog>

    <!--Add Attribute-->
    <el-dialog :visible.sync="createAttributeVisible" title="Create Attribute" width="40%">
      <el-form ref="createAttributeForm" :model="createAttributeForm" label-width="120px">
        <el-form-item label="Key" prop="key">
          <el-input v-model="createAttributeForm.key" type="text"/>
        </el-form-item>
        <el-form-item label="Value" prop="value">
          <el-input v-model="createAttributeForm.value" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createAttributeVisible = false">Cancel</el-button>
        <el-button :loading="createAttributeLoading" type="primary" @click="createAttributeSubmit">Submit</el-button>
      </span>
    </el-dialog>

    <!--Source-->
    <el-dialog :visible.sync="sourceVisible" :title="`[${row.title}] Source`" width="70%">
      <el-form ref="paymentOrderForm" label-width="120px">
        <el-button @click="createSourceVisible = true">Create Source</el-button>
        <el-row v-loading="sourceListLoading" :gutter="1">
          <el-col v-for="item in source" :key="item.id" :span="24" class="item-col">
            <el-card shadow="always" class="item-card">
              <el-col :span="16">
                <el-form-item label="Source">
                  <el-input v-model="item.source" readonly/>
                </el-form-item>
                <el-form-item label="Url">
                  <el-input v-model="item.url" type="url" readonly/>
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-button
                  type="text"
                  size="mini"
                  class="color-blue"
                  @click="sourceFetch(item)">
                  Fetch
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="color-red"
                  @click="confirmSourceDelete(item)">
                  Delete
                </el-button>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sourceVisible = false">Cancel</el-button>
      </span>
    </el-dialog>

    <!--Add Source-->
    <el-dialog :visible.sync="createSourceVisible" title="Create Attribute" width="40%">
      <el-form ref="createAttributeForm" :model="createSourceForm" label-width="120px">
        <el-form-item label="Source" prop="source">
          <el-input v-model="createSourceForm.source" type="text"/>
        </el-form-item>
        <el-form-item label="Url" prop="url">
          <el-input v-model="createSourceForm.url" type="url"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createSourceVisible = false">Cancel</el-button>
        <el-button :loading="createSourceLoading" type="primary" @click="createSourceSubmit">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEcosystems,
  switchEcosystem,
  editEcosystem,
  createEcosystem,
  getEcosystemAttributes,
  createEcosystemAttribute,
  editEcosystemAttribute,
  deleteEcosystemAttribute,
  getEcosystemSource,
  createEcosystemSource,
  deleteEcosystemSource,
  fetchEcosystemSource,
  checkEcosystemCollectionItem
} from '@/api/ecosystem'

export default {
  data() {
    return {
      // Status
      status_lists: [
        { value: 0, name: 'Disable' },
        { value: 1, name: 'Enable' },
        { value: 2, name: 'Delete' }
      ],
      sort_type: [
        { value: 'view_number', name: 'view_number' },
        { value: 'updated_at', name: 'updated_at' },
        { value: 'sort', name: 'sort' }
      ],

      // search
      searchForm: {
        slug: '',
        status: ''
      },

      // sort
      sortForm: {
        sort_type: ''
      },

      // batch
      tableSelections: [],

      // data
      list: [],
      pageSize: 10,
      total: 0,
      page: 1,
      tableLoading: false,

      // edit
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

      row: {},

      // attributes
      createAttributeVisible: false,
      attributesVisible: false,
      attributesListLoading: false,
      createAttributeLoading: false,
      attributes: [],
      createAttributeForm: {
        key: '',
        value: ''
      },

      // attributes
      createSourceVisible: false,
      sourceVisible: false,
      sourceListLoading: false,
      createSourceLoading: false,
      source: [],
      createSourceForm: {
        source: '',
        url: ''
      },

      checkCollectionItemsLoading: false
    }
  },
  mounted() {
    this.getEcosystems()
  },
  methods: {

    preview(slug) {
      window.open(`${process.env.WEB_URL}/ecosystem/${slug}`)
    },

    sort() {
      this.getEcosystems()
    },

    formatStatus(row) {
      for (let i = 0; i < this.status_lists.length; i++) {
        if (this.status_lists[i].value === row.status) {
          return this.status_lists[i].name
        }
      }
      return '--'
    },

    handleSelect: function(selection, row) {
      this.tableSelections = selection
    },

    handleSelectAll: function(selection) {
      this.tableSelections = selection
    },

    // batch
    batchCheck: function() {
      const id = []
      this.tableSelections.forEach(i => {
        id.push(i.id)
      })
      if (id.length > 0) {
        const params = {
          id,
          status: 1
        }
        switchEcosystem(params).then(() => {
          this.getEcosystems()
        })
      }
    },

    // List
    getEcosystems: function() {
      const param = {
        page: this.page,
        limit: this.pageSize
      }
      if (this.searchForm.slug !== '') {
        param.slug = this.searchForm.slug
      }
      if (this.searchForm.type !== '') {
        param.type = this.searchForm.type
      }
      if (this.searchForm.status !== '') {
        param.status = this.searchForm.status
      }
      if (this.sortForm.sort_type !== '') {
        param.sort_type = this.sortForm.sort_type
      }

      this.tableLoading = true
      getEcosystems(param).then(res => {
        this.list = res.rows
        this.total = res.count
        this.tableLoading = false
      })
    },

    handleSizeChange: function(size) {
      this.pageSize = size
      if ((this.page - 1) * size <= this.total) {
        this.getEcosystems()
      }
    },

    handleCurrentChange: function(page) {
      this.page = page
      this.getEcosystems()
    },

    resetForm(formName) {
      this.pageSize = 10
      this.page = 1
      this.tableSelections = []
      this.$refs[formName].resetFields()
      this.getEcosystems()
    },

    editSubmit() {
      if (this.editForm.status !== '') {
        const params = Object.assign({}, this.editForm)
        this.editLoading = true
        editEcosystem(params).then(() => {
          this.editVisible = false
          this.editLoading = false
          this.getEcosystems()
        })
      }
    },
    showEdit(row) {
      this.editForm = row
      this.editVisible = true
    },
    showCreate() {
      this.createVisible = true
    },
    createSubmit() {
      if (this.createForm.title !== '') {
        const params = {
          title: this.createForm.title
        }
        this.createLoading = true
        createEcosystem(params).then(() => {
          this.createVisible = false
          this.createLoading = false
          this.getEcosystems()
        })
      }
    },
    showCollections(row) {
      this.$router.push(`/ecosystem/${row.id}/collections?title=${row.title}&slug=${row.slug}`)
    },
    showImport(row) {
      this.$router.push(`/ecosystem/${row.id}/import?title=${row.title}`)
    },
    showAttributes(row) {
      this.row = row
      this.getEcosystemAttributes()
      this.attributesVisible = true
    },
    getEcosystemAttributes() {
      this.attributesListLoading = true
      getEcosystemAttributes({ id: this.row.id }).then(res => {
        this.attributes = res
        this.attributesListLoading = false
      })
    },
    changeAttributeSort(item) {
      editEcosystemAttribute({ id: item.id, sort: item.sort }).then(() => {
        this.getEcosystemAttributes()
      })
    },
    confirmAttributeDelete(item) {
      this.$confirm(`Confirm delete this attribute [${item.key}] ?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteEcosystemAttribute({ id: item.id }).then(() => {
          this.getEcosystemAttributes()
        })
      })
    },
    createAttributeSubmit() {
      const params = {
        topic_id: this.row.id,
        key: this.createAttributeForm.key,
        value: this.createAttributeForm.value
      }
      this.createAttributeLoading = true
      createEcosystemAttribute(params).then(() => {
        this.createAttributeLoading = false
        this.createAttributeVisible = false
        this.getEcosystemAttributes()
      })
    },
    saveAttributeEdit(item) {
      editEcosystemAttribute({ id: item.id, key: item.key, value: item.value }).then(() => {
        this.getEcosystemAttributes()
      })
    },
    showSource(row) {
      this.row = row
      this.getEcosystemSource()
      this.sourceVisible = true
    },
    getEcosystemSource() {
      this.attributesListLoading = true
      getEcosystemSource({ id: this.row.id }).then(res => {
        this.source = res
        this.sourceListLoading = false
      })
    },
    confirmSourceDelete(item) {
      this.$confirm(`Confirm delete this source [${item.source}] ?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteEcosystemSource({ id: item.id }).then(() => {
          this.getEcosystemSource()
        })
      })
    },
    createSourceSubmit() {
      const params = {
        topic_id: this.row.id,
        source: this.createSourceForm.source,
        url: this.createSourceForm.url
      }
      this.createSourceLoading = true
      createEcosystemSource(params).then(() => {
        this.createSourceLoading = false
        this.createSourceVisible = false
        this.getEcosystemSource()
      })
    },
    sourceFetch(item) {
      fetchEcosystemSource({ id: item.id }).then(() => {
        this.$message({ type: 'success', message: 'Add #AwesomeListFetch job' })
      })
    },
    checkCollectionItems() {
      this.checkCollectionItemsLoading = true
      checkEcosystemCollectionItem().then(() => {
        this.checkCollectionItemsLoading = false
        this.$message({ type: 'success', message: 'Check' })
      })
    }
  }
}
</script>

<style scoped>
  .item-card {
    margin-top: 8px;
    margin-bottom: 8px;
  }
</style>
