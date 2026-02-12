import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMyInfo } from '../api/user'

const OAuthCallback = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const processed = useRef(false) // StrictMode 중복 실행 방지

    useEffect(() => {
        if (processed.current) return
        processed.current = true

        const ProcessLogin = async () => {
            const params = new URLSearchParams(location.search)
            const accessToken = params.get('accessToken')
            const refreshToken = params.get('refreshToken')

            if (accessToken && refreshToken) {
                // 1. axios 인터셉터가 인식할 수 있도록 user 키에 토큰 저장
                const tempUser = { accessToken, refreshToken }
                localStorage.setItem('user', JSON.stringify(tempUser))

                try {
                    // 2. 내 정보 조회 (axios 인터셉터가 위에서 저장한 토큰을 사용)
                    const userInfo = await getMyInfo()

                    // 3. 전체 유저 정보 통합 및 저장
                    const fullUserData = {
                        ...tempUser,
                        ...userInfo,
                        name: userInfo.nickname // MainPage 호환성
                    }
                    localStorage.setItem('user', JSON.stringify(fullUserData))

                    // 4. 메인으로 이동 (새로고침 효과를 위해 window.location 사용 권장 - App 상태 초기화)
                    window.location.href = '/'

                } catch (error) {
                    console.error('User info fetch error:', error)
                    alert('사용자 정보 로딩 실패. 다시 로그인해주세요.')
                    localStorage.removeItem('user')
                    navigate('/login')
                }
            } else {
                alert('로그인 실패: 토큰이 없습니다.')
                navigate('/login')
            }
        }

        ProcessLogin()
    }, [location, navigate])

    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
    }}>
        로그인 처리 중입니다...
    </div>
}

export default OAuthCallback
