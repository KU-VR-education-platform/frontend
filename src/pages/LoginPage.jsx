import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaComment } from 'react-icons/fa'
import { login } from '../api/auth'
import { getMyInfo } from '../api/user'
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      // 1. 로그인 요청
      const tokenResponse = await login(formData.email, formData.password)

      // 2. 토큰 임시 저장 (axios interceptor용)
      localStorage.setItem('user', JSON.stringify(tokenResponse))

      // 3. 내 정보 조회
      const userInfo = await getMyInfo()

      // 4. 유저 정보 통합 및 저장
      // MainPage에서 user.name을 사용하므로 nickname을 name으로 매핑
      const fullUserData = {
        ...tokenResponse,
        ...userInfo,
        name: userInfo.nickname // 매핑 추가
      }

      onLogin(fullUserData)
      navigate('/')
    } catch (err) {
      console.error(err)
      localStorage.removeItem('user') // 실패 시 임시 토큰 삭제
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  const handleOAuthLogin = (provider) => {
    // 백엔드 OAuth2 로그인 URL로 리다이렉트
    // http://localhost:8080/oauth2/authorization/{provider}
    const BACKEND_URL = 'http://localhost:8080'
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`
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
                type="text" // 이메일 형식이 아닐 수도 있으므로 text로 변경 (userId)
                name="email"
                className="form-input"
                placeholder="아이디(이메일)를 입력하세요"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

