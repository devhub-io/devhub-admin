import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 's base_url
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // Auth Header
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  response => {
    // Refresh a token
    if (response.headers.hasOwnProperty('authorization')) {
      const authorization = response.headers['authorization']
      const auth = authorization.split(' ')
      if (auth.length === 2) {
        const token = auth[1]
        store.commit('SET_TOKEN', token)
        setToken(token)
      }
    }

    return response.data
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: `[Error] ${error.message}, ${error.response.data.message}`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
