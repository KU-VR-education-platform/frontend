import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dummyChildren, getAllChildResults } from '../data/dummyData'
import { FaChartBar, FaFileAlt } from 'react-icons/fa'
import './MyPage.css'

function MyPage({ user }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('children') // 'children' or 'results'
  const [selectedChild, setSelectedChild] = useState(null)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddChild = (e) => {
    e.preventDefault()
    if (newChildName && newChildAge) {
      // 더미 데이터 추가 (실제로는 API 호출)
      alert(`${newChildName} 아이가 추가되었습니다!`)
      setNewChildName('')
      setNewChildAge('')
      setShowAddForm(false)
    }
  }

  const handleViewResults = (childId) => {
    setSelectedChild(childId)
    setActiveTab('results')
  }

  const allResults = selectedChild ? getAllChildResults(selectedChild) : []

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
                  <label className="form-label">나이</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="나이"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    min="1"
                    max="18"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  추가하기
                </button>
              </form>
            )}

            <div className="children-grid">
              {dummyChildren.map((child) => (
                <div key={child.id} className="child-card card">
                  <div className="child-header">
                    <div className="child-avatar">
                      {child.name.charAt(0)}
                    </div>
                    <div className="child-info">
                      <h3>{child.name}</h3>
                      <p>나이: {child.age}세</p>
                    </div>
                  </div>
                  <div className="child-stats">
                    <div className="stat">
                      <span className="stat-label">완료한 시나리오</span>
                      <span className="stat-value">{child.total_scenarios}개</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">평균 점수</span>
                      <span className="stat-value">{child.average_score}점</span>
                    </div>
                  </div>
                  <div className="child-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewResults(child.id)}
                    >
                      기록 보기
                    </button>
                    <Link
                      to="/scenario-select"
                      className="btn btn-secondary"
                    >
                      시나리오 시작
                    </Link>
                  </div>
                </div>
              ))}
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
                {allResults.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FaFileAlt size={64} />
                    </div>
                    <p>아직 완료한 시나리오가 없습니다.</p>
                  </div>
                ) : (
                  allResults.map((result) => (
                    <div key={result.id} className="result-card card">
                      <div className="result-header">
                        <h3>{result.scenario_name}</h3>
                        <div className="result-score">
                          <span className="score">{result.score}</span>
                          <span className="score-label">점</span>
                        </div>
                      </div>
                      <div className="result-meta">
                        <span>완료일: {new Date(result.completed_at).toLocaleString('ko-KR')}</span>
                        <span>소요시간: {Math.floor(result.duration / 60)}분 {result.duration % 60}초</span>
                      </div>
                      <Link
                        to={`/scenario-detail/${result.child_id}/${result.scenario_id}?resultId=${result.id}`}
                        className="btn btn-primary"
                      >
                        상세 보기
                      </Link>
                    </div>
                  ))
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

