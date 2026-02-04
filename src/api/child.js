import axios from './axios'

export const createChild = async (childData) => {
    const response = await axios.post('/children', childData)
    return response.data
}

export const getMyChildren = async (params) => {
    const response = await axios.get('/children', { params })
    return response.data
}

export const getChild = async (childId) => {
    const response = await axios.get(`/children/${childId}`)
    return response.data
}

export const updateChild = async (childData) => {
    const response = await axios.patch('/children', childData)
    return response.data
}

export const linkChild = async (inviteCode) => {
    await axios.post('/children/link', { inviteCode })
}

export const unlinkChild = async (childId) => {
    await axios.delete(`/children/${childId}`)
}
