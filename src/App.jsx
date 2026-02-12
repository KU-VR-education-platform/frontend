import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyPage from './pages/MyPage'
import ScenarioSelectPage from './pages/ScenarioSelectPage'
import ChildSelectPage from './pages/ChildSelectPage'
import ScenarioDetailPage from './pages/ScenarioDetailPage'
import OAuthCallback from './pages/OAuthCallback'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 불러오기
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage user={user} onLogout={handleLogout} />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route
          path="/mypage"
          element={user ? <MyPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route
          path="/mypage"
          element={user ? <MyPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/scenario-select"
          element={user ? <ScenarioSelectPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/child-select/:scenarioId"
          element={user ? <ChildSelectPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/scenario-detail/:reportId"
          element={user ? <ScenarioDetailPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/scenario-detail/:childId/:scenarioId"
          element={user ? <ScenarioDetailPage user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </div>
  )
}

export default App

