import { Link } from 'react-router-dom'
import { scenarios } from '../data/dummyData'
import ScenarioIcon from '../components/ScenarioIcon'
import { FaClock, FaArrowRight } from 'react-icons/fa'
import './ScenarioSelectPage.css'

function ScenarioSelectPage({ user }) {
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
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              to={`/child-select/${scenario.id}`}
              className="scenario-item card"
            >
              <div className="scenario-item-icon">
                <ScenarioIcon type={scenario.iconType} size={80} />
              </div>
              <div className="scenario-item-content">
                <h2>{scenario.name}</h2>
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
                    {scenario.steps.slice(0, 3).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                    {scenario.steps.length > 3 && (
                      <li>... 외 {scenario.steps.length - 3}단계</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="scenario-item-arrow">
                <FaArrowRight size={32} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScenarioSelectPage

