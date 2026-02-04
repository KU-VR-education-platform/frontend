import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getScenarios } from '../api/scenario'
import ScenarioIcon from '../components/ScenarioIcon'
import { FaGraduationCap, FaChartLine, FaUsers, FaVrCardboard, FaClock } from 'react-icons/fa'
import './MainPage.css'

function MainPage({ user, onLogout }) {
  const [scenarios, setScenarios] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getScenarios()
        setScenarios(data)
      } catch (error) {
        console.error('Failed to fetch scenarios', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="main-page">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            VR 교육 플랫폼
          </Link>
          <nav className="header-nav">
            {user ? (
              <>
                <Link to="/mypage">마이페이지</Link>
                <Link to="/scenario-select">시나리오 시작</Link>
                <span className="user-name">{user.name}님</span>
                <button onClick={onLogout} className="btn btn-secondary">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/register" className="btn btn-primary">
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            인지가 느린 아이들을 위한<br />
            <span className="gradient-text">VR 시뮬레이션 교육</span>
          </h1>
          <p className="hero-description">
            안전하고 체계적인 VR 교육을 통해 일상생활 기술을 배워보세요
          </p>
          {user ? (
            <Link to="/scenario-select" className="btn btn-primary btn-large">
              시나리오 시작하기
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-large">
              지금 시작하기
            </Link>
          )}
        </div>
        <div className="hero-image">
          <FaVrCardboard className="vr-icon" />
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Why is it special</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaGraduationCap />
              </div>
              <h3>안전한 학습 환경</h3>
              <p>
                실제 상황을 VR로 체험하여 안전하게 일상생활 기술을 배울 수 있습니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>AI 기반 분석</h3>
              <p>
                아이의 학습 과정을 AI가 분석하여 맞춤형 피드백을 제공합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>부모/교육자 관리</h3>
              <p>
                부모님과 선생님이 아이의 학습 진행 상황을 실시간으로 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section scenarios-section">
        <div className="container">
          <h2 className="section-title">교육 시나리오</h2>
          <div className="scenarios-grid">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="scenario-card">
                <div className="scenario-icon">
                  <ScenarioIcon type={scenario.iconType} size={64} />
                </div>
                {/* 백엔드는 title 사용, 프론트 기존 name 사용. title로 변경 */}
                <h3 className="scenario-name">{scenario.title || scenario.name}</h3>
                <p className="scenario-description">{scenario.description}</p>
                <div className="scenario-meta">
                  <span className="badge badge-info">{scenario.difficulty}</span>
                  <span className="scenario-time">
                    <FaClock size={14} /> {scenario.estimatedTime}
                  </span>
                </div>
                {user && (
                  <Link
                    to={`/child-select/${scenario.id}`}
                    className="btn btn-primary"
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    시작하기
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section contents-section">
        <div className="container">
          <h2 className="section-title">Contents</h2>
          <div className="contents-grid">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="content-card">
                <div className="content-icon">
                  <ScenarioIcon type={scenario.iconType} size={48} />
                </div>
                <h4>{scenario.title || scenario.name}</h4>
                <p>VR 시뮬레이션</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 VR 교육 플랫폼. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainPage

