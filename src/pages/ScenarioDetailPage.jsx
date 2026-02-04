import { Link } from 'react-router-dom'
import { FaTools } from 'react-icons/fa'
import './ScenarioDetailPage.css'

function ScenarioDetailPage({ user }) {
  return (
    <div className="scenario-detail-page">
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

      <div className="scenario-detail-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaTools size={64} />
          </div>
          <h2>서비스 준비 중입니다</h2>
          <p>학습 기록 상세 보기 기능은 현재 개발 중입니다.</p>
          <Link to="/mypage" className="btn btn-primary">
            마이페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ScenarioDetailPage

