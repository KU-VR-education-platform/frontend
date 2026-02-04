import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyChildren, createChild } from '../api/child'
import { getReportsByChildId } from '../api/report'
import { FaChartBar, FaFileAlt, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import './MyPage.css'

function MyPage({ user }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('children') // 'children' or 'results'
  const [selectedChild, setSelectedChild] = useState(null)

  // Child Form State
  const [children, setChildren] = useState([])
  const [newChildName, setNewChildName] = useState('')
  const [newChildBirthDate, setNewChildBirthDate] = useState('')
  const [newChildMemo, setNewChildMemo] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Reports State
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(false)

  // Fetch children on mount
  useEffect(() => {
    fetchChildren()
  }, [])

  // Fetch reports when child is selected
  useEffect(() => {
    if (selectedChild) {
      fetchReports(selectedChild)
    } else if (children.length > 0) {
      // Default to first child if none selected
      setSelectedChild(children[0].id)
    }
  }, [selectedChild, children])

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren()
      setChildren(response.content || [])
    } catch (error) {
      console.error('Failed to fetch children', error)
    }
  }

  const fetchReports = async (childId) => {
    setLoadingReports(true)
    try {
      const data = await getReportsByChildId(childId)
      setReports(data)
    } catch (error) {
      console.error('Failed to fetch reports', error)
      setReports([])
    } finally {
      setLoadingReports(false)
    }
  }

  const handleAddChild = async (e) => {
    e.preventDefault()
    if (newChildName && newChildBirthDate) {
      try {
        await createChild({
          name: newChildName,
          birthDate: newChildBirthDate,
          memo: newChildMemo
        })
        alert(`${newChildName} 아이가 추가되었습니다!`)
        setNewChildName('')
        setNewChildBirthDate('')
        setNewChildMemo('')
        setShowAddForm(false)
        fetchChildren()
      } catch (error) {
        console.error('Failed to create child', error)
        alert('아이 추가에 실패했습니다.')
      }
    }
  }

  const handleViewResults = (childId) => {
    setSelectedChild(childId)
    setActiveTab('results')
  }

  return (
    <div className="mypage">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            VR 교육 플랫폼
          </Link>
          <nav className="header-nav">
            <Link to="/">홈</Link>
            <Link to="/scenario-select">시나리오 시작</Link>
            <span className="user-name">{user.name}님 ({user.role === 'teacher' ? '교육자' : '부모님'})</span>
          </nav>
        </div>
      </header>

      <div className="mypage-container">
        <div className="mypage-header">
          <h1>마이페이지</h1>
          <p>{user.role === 'teacher' ? '교육자' : '부모님'} 계정으로 로그인하셨습니다.</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'children' ? 'active' : ''}`}
            onClick={() => setActiveTab('children')}
          >
            아이 관리
          </button>
          <button
            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            학습 기록
          </button>
        </div>

        {activeTab === 'children' && (
          <div className="children-section">
            <div className="section-header">
              <h2>등록된 아이들</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '취소' : '+ 아이 추가'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddChild} className="add-child-form card">
                <h3>새 아이 추가</h3>
                <div className="form-group">
                  <label className="form-label">이름</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="아이 이름"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">생년월일</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newChildBirthDate}
                    onChange={(e) => setNewChildBirthDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">메모 (선택)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 특이사항 등"
                    value={newChildMemo}
                    onChange={(e) => setNewChildMemo(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  추가하기
                </button>
              </form>
            )}

            <div className="children-grid">
              {children.length === 0 ? (
                <div className="empty-message">등록된 아이가 없습니다.</div>
              ) : (
                children.map((child) => (
                  <div key={child.childId} className="child-card card">
                    <div className="child-header">
                      <div className="child-avatar">
                        {child.name.charAt(0)}
                      </div>
                      <div className="child-info">
                        <h3>{child.name}</h3>
                        <p>생일: {child.birthDate}</p>
                      </div>
                    </div>
                    {/* 통계 데이터는 현재 API에 없으므로 숨기거나 고정값 */}
                    <div className="child-stats">
                      <div className="stat">
                        <span className="stat-label">초대 코드</span>
                        <span className="stat-value">{child.inviteCode || '-'}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">메모</span>
                        <span className="stat-value">{child.memo || '-'}</span>
                      </div>
                    </div>
                    <div className="child-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewResults(child.childId)}
                      >
                        기록 보기
                      </button>
                      <Link
                        to="/scenario-select"
                        state={{ selectedChildId: selectedChild }}
                        className="btn btn-secondary"
                      >
                        시나리오 시작
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-section">
            <div className="section-header">
              <h2>학습 기록</h2>
              {selectedChild && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedChild(null)
                    setActiveTab('children')
                  }}
                >
                  아이 목록으로
                </button>
              )}
            </div>

            {!selectedChild ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaChartBar size={64} />
                </div>
                <p>아이를 선택하여 학습 기록을 확인하세요.</p>
              </div>
            ) : (
              <div className="results-list">
                {loadingReports ? (
                  <div className="loading-state">기록을 불러오는 중...</div>
                ) : reports.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FaFileAlt size={64} />
                    </div>
                    <p>아직 완료한 시나리오가 없습니다.</p>
                    <Link to="/scenario-select" className="btn btn-primary top-margin">
                      시나리오 체험하러 가기
                    </Link>
                  </div>
                ) : (
                  reports.map((report) => {
                    let analysis = {}
                    try {
                      analysis = JSON.parse(report.aiAnalysis) || {}
                    } catch (e) {
                      analysis = { feedback: report.aiAnalysis } // fallback for simple string
                    }

                    return (
                      <div key={report.id} className="report-card card">
                        <div className="report-header">
                          <div className="report-title">
                            <h3>{report.scenarioTitle}</h3>
                            <span className="report-date">
                              {new Date(report.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="report-score">
                            <span className="score-value">{report.score}</span>
                            <span className="score-label">점</span>
                          </div>
                        </div>

                        <div className="report-summary">
                          <div className="summary-item">
                            <FaClock className="icon" />
                            <span>소요 시간: {Math.floor(report.duration / 60)}분 {report.duration % 60}초</span>
                          </div>
                        </div>

                        <div className="report-feedback">
                          <h4>AI 분석 결과</h4>

                          {/* 강점 */}
                          {analysis.strengths && analysis.strengths.length > 0 && (
                            <div className="feedback-section good">
                              <h5><FaCheckCircle /> 잘한 점</h5>
                              <ul>
                                {analysis.strengths.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            </div>
                          )}

                          {/* 개선점 */}
                          {analysis.improvements && analysis.improvements.length > 0 && (
                            <div className="feedback-section bad">
                              <h5><FaExclamationTriangle /> 아쉬운 점</h5>
                              <ul>
                                {analysis.improvements.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            </div>
                          )}

                          {/* 단순 피드백 (fallback) */}
                          {analysis.feedback && (
                            <div className="feedback-section info">
                              <p>{analysis.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPage

