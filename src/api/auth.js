import axios from './axios'

export const login = async (email, password) => {
    const response = await axios.post('/auth/login', { userId: email, password })
    return response.data
}

export const logout = async () => {
    await axios.post('/auth/logout')
}

export const refresh = async (refreshToken) => {
    const response = await axios.post('/auth/refresh', { refreshToken })
    return response.data
}
