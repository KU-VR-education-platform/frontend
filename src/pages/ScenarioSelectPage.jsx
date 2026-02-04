import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getScenarios } from '../api/scenario'
import ScenarioIcon from '../components/ScenarioIcon'
import { FaClock, FaArrowRight } from 'react-icons/fa'
import './ScenarioSelectPage.css'

function ScenarioSelectPage({ user }) {
  const location = useLocation()
  const selectedChildId = location.state?.selectedChildId
  const [scenarios, setScenarios] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getScenarios()
        setScenarios(data)
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  const getStepsArray = (steps) => {
    if (Array.isArray(steps)) return steps
    if (typeof steps === 'string') {
      try {
        return JSON.parse(steps)
      } catch (e) {
        return []
      }
    }
    return []
  }

  return (
    <div className="scenario-select-page">
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

      <div className="scenario-select-container">
        <div className="page-header">
          <h1>시나리오 선택</h1>
          <p>아이가 체험할 시나리오를 선택해주세요</p>
        </div>

        <div className="scenarios-list">
          {scenarios.map((scenario) => {
            const steps = getStepsArray(scenario.steps)
            return (
              <Link
                key={scenario.id}
                to={`/child-select/${scenario.id}`}
                state={{ selectedChildId }}
                className="scenario-item card"
              >
                <div className="scenario-item-icon">
                  <ScenarioIcon type={scenario.iconType} size={80} />
                </div>
                <div className="scenario-item-content">
                  <h2>{scenario.title || scenario.name}</h2>
                  <p>{scenario.description}</p>
                  <div className="scenario-item-meta">
                    <span className="badge badge-info">{scenario.difficulty}</span>
                    <span className="scenario-item-time">
                      <FaClock size={14} /> {scenario.estimatedTime}
                    </span>
                  </div>
                  <div className="scenario-item-steps">
                    <h4>주요 단계:</h4>
                    <ul>
                      {steps.slice(0, 3).map((step, index) => (
                        <li key={index}>
                          {typeof step === 'object' ? step.description : step}
                        </li>
                      ))}
                      {steps.length > 3 && (
                        <li>... 외 {steps.length - 3}단계</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="scenario-item-arrow">
                  <FaArrowRight size={32} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ScenarioSelectPage

