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
    // http://3.38.239.153/api/v1/oauth2/authorization/{provider} (Nginx proxy)
    // Spring Security OAuth2 기본 경로는 /oauth2/authorization/{provider}
    // Nginx가 /api/ -> backend:8080/ 으로 포워딩한다면:
    // http://3.38.239.153/api/oauth2/authorization/{provider} -> backend:8080/oauth2/authorization/{provider}
    // 근데 context-path가 없으므로 backend:8080/oauth2/... 가 정답.

    // 만약 Nginx가 /api/를 backend:8080/api/ 로 보낸다면 (rewrite 없으면)
    // 백엔드는 /api/v1/... 을 받음.
    // OAuth 엔드포인트는 /oauth2/... 임.
    // 즉, /api/ 경로로는 OAuth 엔드포인트에 접근 불가할 수 있음 (Nginx 설정에 따라).

    // Nginx 설정을 보면:
    // location /api/ { proxy_pass http://backend:8080; }
    // 이는 http://host/api/foo -> http://backend:8080/api/foo 로 감.
    // 하지만 OAuth2 디폴트 엔드포인트는 /oauth2/... 임. /api/ 밑에 있지 않음.
    // 따라서 Nginx에서 /oauth2/ 경로도 프록시해줘야 함.

    // 일단 프론트엔드는 IP/oauth2/... 로 요청을 보낼 것임.
    // Nginx 설정을 추가해야 함.

    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://3.38.239.153'
    // VITE_API_URL이 http://3.38.239.153/api/v1 이라면 origin은 http://3.38.239.153

    let targetOrigin = 'http://3.38.239.153';
    if (import.meta.env.VITE_API_URL) {
      try {
        const url = new URL(import.meta.env.VITE_API_URL);
        targetOrigin = url.origin;
      } catch (e) {
        console.error('Invalid VITE_API_URL', e);
      }
    }

    // 만약 Nginx가 80포트에서 /oauth2를 처리 안하면 8080으로 직접 보내야 하나?
    // "ip 3.38.239.153이야" -> 보통 80포트.
    // Nginx 설정을 고쳐서 /oauth2/ 도 프록시하게 해야 함.

    window.location.href = `${targetOrigin}/oauth2/authorization/${provider}`
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

