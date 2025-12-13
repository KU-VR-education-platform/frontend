import { useParams, Link, useSearchParams } from 'react-router-dom'
import { getChildScenarioResults, scenarios, dummyChildren } from '../data/dummyData'
import { FaFileAlt, FaCheckCircle, FaTimesCircle, FaThumbsUp, FaChartLine, FaLightbulb } from 'react-icons/fa'
import './ScenarioDetailPage.css'

function ScenarioDetailPage({ user }) {
  const { childId, scenarioId } = useParams()
  const [searchParams] = useSearchParams()
  const resultId = searchParams.get('resultId')

  const scenario = scenarios.find(s => s.id === parseInt(scenarioId))
  const child = dummyChildren.find(c => c.id === childId)
  const results = getChildScenarioResults(childId, scenarioId)
  const result = resultId 
    ? results.find(r => r.id === resultId) 
    : results[0] // 가장 최근 결과

  if (!scenario || !child) {
    return (
      <div className="scenario-detail-page">
        <div className="error-message">정보를 찾을 수 없습니다.</div>
        <Link to="/mypage" className="btn btn-primary">
          마이페이지로 돌아가기
        </Link>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="scenario-detail-page">
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaFileAlt size={64} />
          </div>
          <p>아직 이 시나리오를 완료하지 않았습니다.</p>
          <Link to="/scenario-select" className="btn btn-primary">
            시나리오 시작하기
          </Link>
        </div>
      </div>
    )
  }

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
        <div className="page-header">
          <div className="back-button">
            <Link to="/mypage" className="btn btn-secondary">
              ← 마이페이지로
            </Link>
          </div>
          <h1>{scenario.name} - 상세 기록</h1>
          <p>{child.name} ({child.age}세)의 학습 기록</p>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            <div className="score-section card">
              <h2>점수</h2>
              <div className="score-display">
                <span className="score">{result.score}</span>
                <span className="score-label">점</span>
              </div>
              <div className="score-info">
                <div className="info-item">
                  <span className="info-label">완료일시</span>
                  <span className="info-value">
                    {new Date(result.completed_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">소요시간</span>
                  <span className="info-value">
                    {Math.floor(result.duration / 60)}분 {result.duration % 60}초
                  </span>
                </div>
              </div>
            </div>

            <div className="steps-section card">
              <h2>단계별 완료 현황</h2>
              <div className="steps-list">
                {result.steps_completed.map((step, index) => (
                  <div
                    key={index}
                    className={`step-item ${step.completed ? 'completed' : 'incomplete'}`}
                  >
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <div className="step-name">{step.step}</div>
                      {step.completed && (
                        <div className="step-time">소요시간: {step.time}초</div>
                      )}
                    </div>
                    <div className="step-status">
                      {step.completed ? (
                        <FaCheckCircle size={24} />
                      ) : (
                        <FaTimesCircle size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {result.mistakes && result.mistakes.length > 0 && (
              <div className="mistakes-section card">
                <h2>개선이 필요한 부분</h2>
                <div className="mistakes-list">
                  {result.mistakes.map((mistake, index) => (
                    <div key={index} className="mistake-item">
                      <div className="mistake-step">{mistake.step}</div>
                      <div className="mistake-message">{mistake.message}</div>
                      <div className="mistake-time">발생 시점: {mistake.time}초</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="detail-sidebar">
            <div className="ai-analysis-section card">
              <h2>AI 분석 결과</h2>
              
              {result.ai_analysis.strengths.length > 0 && (
                <div className="analysis-block">
                  <h3 className="analysis-title strengths">
                    <FaThumbsUp size={18} /> 잘한 점
                  </h3>
                  <ul className="analysis-list">
                    {result.ai_analysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.ai_analysis.improvements.length > 0 && (
                <div className="analysis-block">
                  <h3 className="analysis-title improvements">
                    <FaChartLine size={18} /> 개선할 점
                  </h3>
                  <ul className="analysis-list">
                    {result.ai_analysis.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.ai_analysis.recommendations.length > 0 && (
                <div className="analysis-block">
                  <h3 className="analysis-title recommendations">
                    <FaLightbulb size={18} /> 추천사항
                  </h3>
                  <ul className="analysis-list">
                    {result.ai_analysis.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {results.length > 1 && (
              <div className="history-section card">
                <h2>이전 기록</h2>
                <div className="history-list">
                  {results.slice(1).map((prevResult) => (
                    <Link
                      key={prevResult.id}
                      to={`/scenario-detail/${childId}/${scenarioId}?resultId=${prevResult.id}`}
                      className="history-item"
                    >
                      <div className="history-date">
                        {new Date(prevResult.completed_at).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="history-score">{prevResult.score}점</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScenarioDetailPage

