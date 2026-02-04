import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { getScenarios, getVrCode } from '../api/scenario'
import { getMyChildren } from '../api/child'
import { FaVrCardboard } from 'react-icons/fa'
import './ChildSelectPage.css'

function ChildSelectPage({ user }) {
  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const initialSelectedChildId = location.state?.selectedChildId

  const [children, setChildren] = useState([])
  const [scenariosList, setScenariosList] = useState([])

  const [selectedChild, setSelectedChild] = useState(initialSelectedChildId || null)
  const [vrCode, setVrCode] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [scenariosData, childrenData] = await Promise.all([
          getScenarios(),
          getMyChildren()
        ])
        setScenariosList(scenariosData)
        setChildren(childrenData.content || [])
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  const scenario = scenariosList.find(s => s.id === parseInt(scenarioId))

  useEffect(() => {
    if (initialSelectedChildId && !vrCode) {
      handleChildSelect(initialSelectedChildId)
    }
  }, [initialSelectedChildId])

  const handleChildSelect = async (childId) => {
    setSelectedChild(childId)
    try {
      const code = await getVrCode(childId, parseInt(scenarioId))
      setVrCode(code)
    } catch (error) {
      console.error(error)
      // 교육 진행 중 메시지 확인 필요 (백엔드 에러 메시지 구조에 따라 수정)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert('코드 생성에 실패했습니다.')
      }
      setSelectedChild(null)
    }
  }

  if (scenariosList.length > 0 && !scenario) {
    return (
      <div className="child-select-page">
        <div className="error-message">시나리오를 찾을 수 없습니다.</div>
        <Link to="/scenario-select" className="btn btn-primary">
          시나리오 선택으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="child-select-page">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            VR 교육 플랫폼
          </Link>
          <nav className="header-nav">
            <Link to="/">홈</Link>
            <Link to="/mypage">마이페이지</Link>
            <span className="user-name">{user.name}님</span>
          </nav>
        </div>
      </header>

      <div className="child-select-container">
        <div className="page-header">
          <div className="back-button">
            <Link to="/scenario-select" className="btn btn-secondary">
              ← 시나리오 선택으로
            </Link>
          </div>
          <h1>{scenario ? (scenario.title || scenario.name) : '로딩 중...'}</h1>
          <p>시나리오를 체험할 아이를 선택해주세요</p>
        </div>

        {!vrCode ? (
          <>
            <div className="children-select-grid">
              {children.length === 0 ? (
                <div className="empty-message">등록된 아이가 없습니다. 마이페이지에서 아이를 등록해주세요.</div>
              ) : (children.map((child) => (
                <div
                  key={child.childId}
                  className="child-select-card card"
                  onClick={() => handleChildSelect(child.childId)}
                >
                  <div className="child-select-avatar">
                    {child.name.charAt(0)}
                  </div>
                  <h3>{child.name}</h3>
                  <p>생일: {child.birthDate}</p>
                  <div className="child-card-stats">
                    <div className="stat-item">
                      <span className="stat-label">평균 점수</span>
                      <span className="stat-value">{child.averageScore ? `${child.averageScore}점` : '-'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">완료</span>
                      <span className="stat-value">{child.totalScenarios}회</span>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </>
        ) : (
          <div className="vr-code-section">
            <div className="vr-code-card card">
              <div className="vr-code-icon">
                <FaVrCardboard size={80} />
              </div>
              <h2>VR 기기에서 입력할 코드</h2>
              <div className="vr-code-display">
                {vrCode}
              </div>
              <p className="vr-code-instruction">
                VR 기기에서 위 코드를 입력하면 시나리오가 시작됩니다.<br />
                (유효시간 5분)
              </p>
              <div className="vr-code-info">
                <p><strong>선택된 아이:</strong> {children.find(c => c.childId === selectedChild)?.name}</p>
                <p><strong>시나리오:</strong> {scenario?.title || scenario?.name}</p>
              </div>
              <div className="vr-code-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setVrCode(null)
                    setSelectedChild(null)
                  }}
                >
                  다른 아이 선택
                </button>
                {/* 
                <Link
                  to={`/scenario-detail/${selectedChild}/${scenarioId}`}
                  className="btn btn-primary"
                >
                  기록 보기
                </Link>
                */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChildSelectPage

