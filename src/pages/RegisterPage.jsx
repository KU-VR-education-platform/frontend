import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/user'
import './RegisterPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'parent' // 백엔드 DTO에 role이 없으므로 일단 API 전송시에는 제외될 수 있음
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

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    try {
      // API 호출
      // 백엔드 UserCreateRequest: userId, password, confirmPassword, nickname
      await signup({
        userId: formData.email,
        password: formData.password,
        confirmPassword: formData.passwordConfirm,
        nickname: formData.name
      })

      // 회원가입 성공 후 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다!')
      navigate('/login')
    } catch (err) {
      console.error(err)
      // 에러 메시지 처리 (백엔드 에러 응답 구조에 따라 다를 수 있음)
      setError(err.response?.data?.message || '회원가입에 실패했습니다.')
    }
  }

  return (
    <div className="register-page">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            VR 교육 플랫폼
          </Link>
          <nav className="header-nav">
            <Link to="/login">로그인</Link>
          </nav>
        </div>
      </header>

      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">회원가입</h1>
          <p className="register-subtitle">VR 교육 플랫폼에 가입하세요</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">이름(닉네임)</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="이름(닉네임)을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">아이디(이메일)</label>
              <input
                type="email" // text로 변경 가능하지만 email 유효성 검사 위해 둠
                name="email"
                className="form-input"
                placeholder="아이디(이메일)를 입력하세요"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* 역할 선택 - 백엔드 미지원으로 보이지만 UI 유지 */}
            <div className="form-group">
              <label className="form-label">역할</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="parent">부모님</option>
                <option value="teacher">교육자(선생님)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="비밀번호를 입력하세요 (7자 이상)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={7}
              />
            </div>

            <div className="form-group">
              <label className="form-label">비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                className="form-input"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full">
              회원가입
            </button>
          </form>

          <div className="register-footer">
            <p>
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="link">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

