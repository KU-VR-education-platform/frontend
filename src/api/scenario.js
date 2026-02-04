import axios from './axios'

export const getScenarios = async () => {
    const response = await axios.get('/scenarios')
    return response.data
}

export const getVrCode = async (childId, scenarioId) => {
    const response = await axios.get(`/children/${childId}/scenarios/${scenarioId}/vr-code`)
    return response.data
}

export const verifyVrCode = async (code) => {
    await axios.post('/vr-codes/verify', { code })
}
