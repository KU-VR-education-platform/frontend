import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { dummyChildren, scenarios } from '../data/dummyData'
import { FaVrCardboard } from 'react-icons/fa'
import './ChildSelectPage.css'

function ChildSelectPage({ user }) {
  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const [selectedChild, setSelectedChild] = useState(null)
  const [vrCode, setVrCode] = useState(null)

  const scenario = scenarios.find(s => s.id === parseInt(scenarioId))

  const generateVrCode = () => {
    // 5자리 랜덤 코드 생성
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleChildSelect = (childId) => {
    setSelectedChild(childId)
    const code = generateVrCode()
    setVrCode(code)
    
    // 실제로는 API 호출하여 VR 코드를 서버에 등록
    console.log(`아이 ${childId}가 시나리오 ${scenarioId}를 시작합니다. VR 코드: ${code}`)
  }

  if (!scenario) {
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
          <h1>{scenario.name}</h1>
          <p>시나리오를 체험할 아이를 선택해주세요</p>
        </div>

        {!vrCode ? (
          <>
            <div className="children-select-grid">
              {dummyChildren.map((child) => (
                <div
                  key={child.id}
                  className="child-select-card card"
                  onClick={() => handleChildSelect(child.id)}
                >
                  <div className="child-select-avatar">
                    {child.name.charAt(0)}
                  </div>
                  <h3>{child.name}</h3>
                  <p>나이: {child.age}세</p>
                  <div className="child-select-stats">
                    <span>완료: {child.total_scenarios}개</span>
                    <span>평균: {child.average_score}점</span>
                  </div>
                </div>
              ))}
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
                VR 기기에서 위 코드를 입력하면 시나리오가 시작됩니다.
              </p>
              <div className="vr-code-info">
                <p><strong>선택된 아이:</strong> {dummyChildren.find(c => c.id === selectedChild)?.name}</p>
                <p><strong>시나리오:</strong> {scenario.name}</p>
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
                <Link
                  to={`/scenario-detail/${selectedChild}/${scenarioId}`}
                  className="btn btn-primary"
                >
                  기록 보기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChildSelectPage

