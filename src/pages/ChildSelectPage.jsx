import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { getScenarios, getVrCode, cancelVrCode } from '../api/scenario'
import { getMyChildren } from '../api/child'
import { FaVrCardboard, FaTimes } from 'react-icons/fa'
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
  const [isInitializing, setIsInitializing] = useState(!!initialSelectedChildId)

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
      // 교육 진행 중 메시지 확인 (ErrorCode.SCENARIO_ALREADY_IN_PROGRESS 대응)
      const errorMessage = error.response?.data?.message || '코드 생성에 실패했습니다.'
      alert(errorMessage)

      if (initialSelectedChildId) {
        navigate('/scenario-select') // 이전 선택이 있었는데 실패하면 돌아감
      } else {
        setSelectedChild(null) // 수동 선택 실패 시 리셋
      }
    } finally {
      setIsInitializing(false)
    }
  }

  const handleCancelVrCode = async () => {
    if (!vrCode) return

    if (!window.confirm('시나리오 준비를 취소하시겠습니까?\nVR 기기에서 코드를 입력하기 전까지만 취소가 가능합니다.')) {
      return
    }

    try {
      await cancelVrCode(vrCode)
      setVrCode(null)
      setSelectedChild(null)
      alert('취소되었습니다.')

      // 만약 메인에서 바로 왔던 거라면 메인으로, 아니면 아이 선택으로
      if (initialSelectedChildId) {
        navigate('/')
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error.response?.data?.message || '취소에 실패했습니다.'
      alert(errorMessage)
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

  if (isInitializing) {
    return (
      <div className="child-select-page">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">VR 교육 플랫폼</Link>
          </div>
        </header>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>시나리오를 준비하고 있습니다...</p>
        </div>
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
          <p>{vrCode ? 'VR 기기에 코드를 입력해주세요' : '시나리오를 체험할 아이를 선택해주세요'}</p>
        </div>

        {!vrCode ? (
          <>
            <div className="children-select-grid">
              {children.length === 0 ? (
                <div className="empty-message">등록된 아이가 없습니다. 마이페이지에서 아이를 등록해주세요.</div>
              ) : (children.map((child) => (
                <div
                  key={child.childId}
                  className={`child-select-card card ${child.isInProgress ? 'disabled' : ''}`}
                  onClick={() => !child.isInProgress && handleChildSelect(child.childId)}
                >
                  <div className="child-select-avatar">
                    {child.name.charAt(0)}
                  </div>
                  <h3>{child.name}</h3>
                  {child.isInProgress ? (
                    <p className="status-badge">교육 진행 중</p>
                  ) : (
                    <p>생일: {child.birthDate}</p>
                  )}
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
                  className="btn btn-danger"
                  onClick={handleCancelVrCode}
                >
                  <FaTimes /> 시나리오 취소하기
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setVrCode(null)
                    setSelectedChild(null)
                  }}
                >
                  다른 아이 선택
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChildSelectPage

