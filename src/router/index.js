import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/auth',
    component: () => import('@/views/login/auth'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/base',
    component: Layout,
    name: 'Dataset',
    redirect: '/dataset/repos',
    meta: { title: 'Dataset', icon: 'documentation' },
    children: [
      { path: '/dataset/repos', component: () => import('@/views/dataset/repos'), name: 'repos', meta: { title: 'Repos' }},
      { path: '/dataset/developers', component: () => import('@/views/dataset/developers'), name: 'developers', meta: { title: 'Developers' }},
      { path: '/dataset/sites', component: () => import('@/views/dataset/sites'), name: 'sites', meta: { title: 'Sites' }},
      { path: '/dataset/wiki', component: () => import('@/views/dataset/wiki'), name: 'wiki', meta: { title: 'Wiki' }},
      { path: '/dataset/links', component: () => import('@/views/dataset/links'), name: 'links', meta: { title: 'Links' }},
      { path: '/dataset/news', component: () => import('@/views/dataset/news'), name: 'news', meta: { title: 'News' }},
      { path: '/dataset/articles', component: () => import('@/views/dataset/articles'), name: 'articles', meta: { title: 'Articles' }}
    ]
  },
  {
    path: '/ecosystems',
    component: Layout,
    name: 'Ecosystems',
    redirect: '/ecosystem/index',
    meta: { title: 'Ecosystems', icon: 'tree' },
    children: [
      { path: '/ecosystem/index', component: () => import('@/views/ecosystem/index'), name: 'ecosystems_index', meta: { title: 'List' }},
      { path: '/ecosystem/:id/collections', component: () => import('@/views/ecosystem/collections'), name: 'ecosystems_collections', meta: { title: 'Collections' }, hidden: true, noCache: true },
      { path: '/ecosystem/:id/import', component: () => import('@/views/ecosystem/import'), name: 'ecosystems_import', meta: { title: 'Import' }, hidden: true, noCache: true },
      { path: '/dataset/articles', component: () => import('@/views/dataset/links'), name: 'linkss', meta: { title: 'Links' }}
    ]
  },
  {
    path: '/workflow',
    component: Layout,
    name: 'workflow',
    redirect: '/workflow/index',
    meta: { title: 'Workflow', icon: 'guide' },
    children: [
      { path: '/workflow/index', component: () => import('@/views/workflow/index'), name: 'workflow_index', meta: { title: 'List' }},
      { path: '/workflow/feedback', component: () => import('@/views/workflow/index'), name: 'feedback', meta: { title: 'Feedback' }}
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    redirect: '/partners',
    meta: { title: 'System', icon: 'component' },
    children: [
      { path: '/users', component: () => import('@/views/user/Users'), name: 'system', meta: { title: 'System' }},
      { path: '/users', component: () => import('@/views/user/Users'), name: 'system1', meta: { title: 'System' }}
    ]
  }
]

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,

  { path: '*', redirect: '/404', hidden: true }
]
