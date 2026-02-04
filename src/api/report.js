import axios from './axios'

// 특정 자녀의 학습 기록 조회
export const getReportsByChildId = async (childId) => {
    const response = await axios.get(`/reports/child/${childId}`)
    return response.data
}
// 특정 리포트 상세 조회
export const getReportById = async (reportId) => {
    const response = await axios.get(`/reports/${reportId}`)
    return response.data
}
