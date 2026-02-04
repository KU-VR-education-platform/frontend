import axios from 'axios'

const instance = axios.create({
  baseURL: '/api/v1',
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

// 응답 인터셉터: 401 처리
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) throw new Error('No user data')

        const user = JSON.parse(userStr)
        const { refreshToken } = user

        if (!refreshToken) throw new Error('No refresh token')

        // 토큰 갱신 요청
        const { data } = await instance.post('/auth/refresh', { refreshToken })

        // 새 토큰 저장
        const newUser = { ...user, ...data }
        localStorage.setItem('user', JSON.stringify(newUser))

        // 헤더 업데이트 및 재요청
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return instance(originalRequest)

      } catch (refreshError) {
        console.error('Token refresh failed', refreshError)
        // 로그아웃 처리
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
