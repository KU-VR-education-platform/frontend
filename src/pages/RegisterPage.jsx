import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'parent' // 'parent' or 'teacher'
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
    
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    // 더미 회원가입 로직
    // 실제로는 API 호출
    console.log('회원가입:', formData)
    
    // 회원가입 성공 후 로그인 페이지로 이동
    alert('회원가입이 완료되었습니다!')
    navigate('/login')
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
              <label className="form-label">이름</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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

