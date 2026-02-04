import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReportById } from '../api/report'
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaClock, FaCalendarAlt, FaStar, FaLightbulb } from 'react-icons/fa'
import './ScenarioDetailPage.css'

function ScenarioDetailPage({ user }) {
  const { reportId } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getReportById(reportId)
        setReport(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [reportId])

  if (loading) return <div className="loading-screen">로딩 중...</div>
  if (!report) return <div className="error-screen">리포트를 찾을 수 없습니다.</div>

  // Parse JSON fields
  const steps = JSON.parse(report.stepsCompleted) || []
  const mistakes = JSON.parse(report.mistakes) || []
  let analysis = {}
  try {
    analysis = JSON.parse(report.aiAnalysis) || {}
  } catch (e) {
    analysis = { feedback: report.aiAnalysis }
  }

  return (
    <div className="scenario-detail-page">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">VR 교육 플랫폼</Link>
          <nav className="header-nav">
            <Link to="/">홈</Link>
            <Link to="/mypage">마이페이지</Link>
            <span className="user-name">{user.name}님</span>
          </nav>
        </div>
      </header>

      <div className="scenario-detail-container">
        <div className="page-header">
          <div className="back-button">
            <Link to="/mypage" className="btn btn-secondary">
              <FaArrowLeft /> 목록으로 돌아가기
            </Link>
          </div>
          <h1>{report.scenarioTitle} 결과 리포트</h1>
          <p>
            <FaCalendarAlt /> {new Date(report.completedAt).toLocaleString()}
          </p>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            {/* 점수 섹션 */}
            <div className="score-section card">
              <h2>종합 점수</h2>
              <div className="score-display">
                <span className="score">{report.score}</span>
                <span className="score-label">점</span>
              </div>
              <div className="score-info">
                <div className="info-item">
                  <span className="info-label">소요 시간</span>
                  <span className="info-value">{Math.floor(report.duration / 60)}분 {report.duration % 60}초</span>
                </div>
                <div className="info-item">
                  <span className="info-label">완료 단계</span>
                  <span className="info-value">{steps.filter(s => s.completed).length} / {steps.length}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">실수 횟수</span>
                  <span className="info-value">{mistakes.length}회</span>
                </div>
              </div>
            </div>

            {/* AI 분석 섹션 */}
            <div className="ai-analysis-section card">
              <h2><FaLightbulb className="icon-yellow" /> AI 분석 결과</h2>

              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="analysis-block">
                  <h3 className="analysis-title strengths">잘한 점</h3>
                  <ul className="analysis-list">
                    {analysis.strengths.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              )}

              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="analysis-block">
                  <h3 className="analysis-title improvements">아쉬운 점</h3>
                  <ul className="analysis-list">
                    {analysis.improvements.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              )}

              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="analysis-block">
                  <h3 className="analysis-title recommendations">추천 학습</h3>
                  <ul className="analysis-list">
                    {analysis.recommendations.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="detail-sidebar">
            {/* 단계별 로그 */}
            <div className="steps-section card">
              <h2>단계별 진행</h2>
              <div className="steps-list">
                {steps.map((step, idx) => (
                  <div key={idx} className={`step-item ${step.completed ? 'completed' : 'incomplete'}`}>
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-content">
                      <div className="step-name">{step.step}</div>
                      <div className="step-time">{step.time}초 소요</div>
                    </div>
                    <div className="step-status">
                      {step.completed ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 실수 로그 */}
            {mistakes.length > 0 && (
              <div className="mistakes-section card">
                <h2>실수 기록</h2>
                <div className="mistakes-list">
                  {mistakes.map((m, idx) => (
                    <div key={idx} className="mistake-item">
                      <div className="mistake-step">[{m.step}] 단계</div>
                      <div className="mistake-message">{m.message}</div>
                      <div className="mistake-time">({m.time}초 시점)</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScenarioDetailPage

