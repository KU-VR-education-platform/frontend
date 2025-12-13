import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaComment } from 'react-icons/fa'
import './LoginPage.css'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 더미 로그인 로직
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    // 특정 계정으로 로그인
    if (formData.email === 'parent@naver.com' && formData.password === 'P@ssw0rd') {
      const userData = {
        id: 'user_001',
        email: formData.email,
        name: '이부모',
        role: 'parent',
        created_at: '2024-01-01'
      }
      onLogin(userData)
      navigate('/')
    } else if (formData.email === 'teacher@naver.com' && formData.password === 'P@ssw0rd') {
      const userData = {
        id: 'user_002',
        email: formData.email,
        name: '김선생',
        role: 'teacher',
        created_at: '2024-01-01'
      }
      onLogin(userData)
      navigate('/')
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  const handleOAuthLogin = (provider) => {
    // OAuth 로그인 처리 (더미)
    // 실제로는 해당 OAuth 제공자의 인증 페이지로 리다이렉트
    console.log(`${provider} OAuth 로그인 시도`)
    
    // 더미 OAuth 로그인 - 실제로는 OAuth 인증 플로우를 거쳐야 함
    // 여기서는 간단히 로그인 처리
    const userData = {
      id: `oauth_${provider}_001`,
      email: `${provider}@example.com`,
      name: provider === 'google' ? '구글 사용자' : provider === 'naver' ? '네이버 사용자' : '카카오 사용자',
      role: 'parent', // 기본값, 실제로는 OAuth 응답에서 가져옴
      created_at: '2024-01-01',
      oauth_provider: provider
    }
    
    onLogin(userData)
    navigate('/')
  }

  return (
    <div className="login-page">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            VR 교육 플랫폼
          </Link>
          <nav className="header-nav">
            <Link to="/register">회원가입</Link>
          </nav>
        </div>
      </header>

      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">VR 교육 플랫폼에 오신 것을 환영합니다</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">이메일</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full">
              로그인
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="oauth-section">
            <h3 className="oauth-title">간편 로그인</h3>
            <div className="oauth-buttons">
              <button
                type="button"
                className="oauth-btn oauth-google"
                onClick={() => handleOAuthLogin('google')}
              >
                <FaGoogle size={20} />
                <span>구글 로그인</span>
              </button>
              <button
                type="button"
                className="oauth-btn oauth-naver"
                onClick={() => handleOAuthLogin('naver')}
              >
                <span className="naver-icon">N</span>
                <span>네이버 로그인</span>
              </button>
              <button
                type="button"
                className="oauth-btn oauth-kakao"
                onClick={() => handleOAuthLogin('kakao')}
              >
                <FaComment size={20} />
                <span>카카오 로그인</span>
              </button>
            </div>
          </div>

          <div className="login-footer">
            <p>
              계정이 없으신가요?{' '}
              <Link to="/register" className="link">
                회원가입
              </Link>
            </p>
            <div className="demo-accounts">
              <p className="demo-title">테스트 계정:</p>
              <p className="demo-account">부모님: parent@naver.com / P@ssw0rd</p>
              <p className="demo-account">교육자: teacher@naver.com / P@ssw0rd</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

