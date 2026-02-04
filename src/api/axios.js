import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://3.38.239.153/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 토큰 추가
instance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const { accessToken } = JSON.parse(user)
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
      } catch (e) {
        console.error('Failed to parse user from local storage', e)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default instance
