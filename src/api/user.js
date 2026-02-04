import axios from './axios'

export const signup = async (userData) => {
    const response = await axios.post('/users/signup', userData)
    return response.data
}

export const getMyInfo = async () => {
    const response = await axios.get('/users/me')
    return response.data
}

export const updateMyInfo = async (userData) => {
    const response = await axios.patch('/users/me', userData)
    return response.data
}

export const updatePassword = async (passwordData) => {
    await axios.patch('/users/me/password', passwordData)
}

export const withdraw = async (currentPassword) => {
    await axios.delete('/users/me', { data: { currentPassword } }) // DELETE usually takes body in config.data or second arg depending on client, axios delete second arg is config
}
