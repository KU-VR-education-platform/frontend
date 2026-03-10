import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyChildren, createChild, updateChild, unlinkChild } from '../api/child'
import { getReportsByChildId } from '../api/report'
import { getVrCode, cancelVrCode } from '../api/scenario'
import { FaChartBar, FaFileAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaTrash, FaEdit } from 'react-icons/fa'
import { useCustomAlert } from '../components/CustomAlertContext'
import './MyPage.css'

function MyPage({ user }) {
  const navigate = useNavigate()
  const { showAlert, showConfirm } = useCustomAlert()
  const [activeTab, setActiveTab] = useState('children') // 'children' or 'results'
  const [selectedChild, setSelectedChild] = useState(null)

  // Child Form State
  const [children, setChildren] = useState([])
  const [newChildName, setNewChildName] = useState('')
  const [newChildBirthDate, setNewChildBirthDate] = useState('')
  const [newChildMemo, setNewChildMemo] = useState('')
  const [newChildGroupName, setNewChildGroupName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [isEditingList, setIsEditingList] = useState(false) // Edit mode state

  // Edit Child State
  const [childToEdit, setChildToEdit] = useState(null)

  // Filter State
  const [selectedTags, setSelectedTags] = useState([])

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [childToDelete, setChildToDelete] = useState(null)

  // Reports State
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(false)

  // Fetch children on mount
  useEffect(() => {
    fetchChildren()
  }, [])

  // Fetch reports when child is selected
  useEffect(() => {
    if (selectedChild) {
      fetchReports(selectedChild)
    } else if (children.length > 0) {
      // Default to first child if none selected
      setSelectedChild(children[0].id)
    }
  }, [selectedChild, children])

  const fetchChildren = async () => {
    try {
      const response = await getMyChildren()
      setChildren(response.content || [])
    } catch (error) {
      console.error('Failed to fetch children', error)
    }
  }

  const fetchReports = async (childId) => {
    setLoadingReports(true)
    try {
      const data = await getReportsByChildId(childId)
      setReports(data)
    } catch (error) {
      console.error('Failed to fetch reports', error)
      setReports([])
    } finally {
      setLoadingReports(false)
    }
  }

  const resetFormValues = () => {
    setNewChildName('')
    setNewChildBirthDate('')
    setNewChildMemo('')
    setNewChildGroupName('')
    setChildToEdit(null)
    setShowAddForm(false)
  }

  const handleAddChild = async (e) => {
    e.preventDefault()
    if (newChildName && newChildBirthDate) {
      try {
        if (childToEdit) {
          // Update mode
          await updateChild({
            childId: childToEdit.childId,
            name: newChildName,
            birthDate: newChildBirthDate,
            memo: newChildMemo,
            groupName: newChildGroupName
          })
          await showAlert(`${newChildName} 아이 정보가 수정되었습니다!`, '수정 완료')
        } else {
          // Create mode
          await createChild({
            name: newChildName,
            birthDate: newChildBirthDate,
            memo: newChildMemo,
            groupName: newChildGroupName
          })
          await showAlert(`${newChildName} 아이가 추가되었습니다!`, '추가 완료')
        }
        resetFormValues()
        fetchChildren()
      } catch (error) {
        console.error(childToEdit ? 'Failed to update child' : 'Failed to create child', error)
        await showAlert(childToEdit ? '아이 수정에 실패했습니다.' : '아이 추가에 실패했습니다.', '오류')
      }
    }
  }

  const openEditForm = (child) => {
    setChildToEdit(child)
    setNewChildName(child.name)
    setNewChildBirthDate(child.birthDate)
    setNewChildMemo(child.memo || '')
    setNewChildGroupName(child.groupName || '')
    setShowAddForm(true)
    setIsEditingList(false) // editing list close to show form
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }

  const handleViewResults = (childId) => {
    setSelectedChild(childId)
    setActiveTab('results')
  }

  const handleCancelSession = async (childId, scenarioId) => {
    const isConfirmed = await showConfirm('교육 준비를 취소하시겠습니까?', '취소 확인', '네, 취소할게요', '아니오')
    if (!isConfirmed) return

    try {
      // 1. VR 코드 조회
      const code = await getVrCode(childId, scenarioId)
      // 2. 취소 API 호출
      await cancelVrCode(code)
      await showAlert('취소되었습니다.', '안내')
      fetchChildren() // 목록 새로고침
    } catch (error) {
      console.error(error)
      await showAlert(error.response?.data?.message || '취소에 실패했습니다.', '오류')
    }
  }

  const openDeleteModal = (childId, childName) => {
    setChildToDelete({ id: childId, name: childName });
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = async () => {
    if (!childToDelete) return;

    try {
      await unlinkChild(childToDelete.id)
      // 삭제 후 목록 새로고침 및 선택 해제
      if (selectedChild === childToDelete.id) {
        setSelectedChild(null)
      }
      fetchChildren()
      await showAlert(`${childToDelete.name} 아이가 삭제되었습니다.`, '삭제 완료')
    } catch (error) {
      console.error('Failed to delete child', error)
      await showAlert('아이 삭제에 실패했습니다.', '오류')
    } finally {
      setShowDeleteModal(false)
      setChildToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setChildToDelete(null)
  }

  // Extract unique tags and filter children
  const tags = [...new Set(children.map(c => c.groupName).filter(tag => tag && tag.trim() !== ''))]
  const filteredChildren = selectedTags.length > 0
    ? children.filter(c => selectedTags.includes(c.groupName))
    : children;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="mypage">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            VR 교육 플랫폼
          </Link>
          <nav className="header-nav">
            <Link to="/">홈</Link>
            <Link to="/scenario-select">시나리오 시작</Link>
            <span className="user-name">{user.name}님 ({user.role === 'teacher' ? '교육자' : '부모님'})</span>
          </nav>
        </div>
      </header>

      <div className="mypage-container">
        <div className="mypage-header">
          <h1>마이페이지</h1>
          <p>{user.role === 'teacher' ? '교육자' : '부모님'} 계정으로 로그인하셨습니다.</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'children' ? 'active' : ''}`}
            onClick={() => setActiveTab('children')}
          >
            아이 관리
          </button>
          <button
            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            학습 기록
          </button>
        </div>

        {activeTab === 'children' && (
          <div className="children-section">
            <div className="section-header">
              <h2>등록된 아이들</h2>
              <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn ${isEditingList ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setIsEditingList(!isEditingList)}
                >
                  {isEditingList ? '완료' : <><FaEdit style={{ marginRight: '4px' }} />편집</>}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (showAddForm) {
                      resetFormValues()
                    } else {
                      setShowAddForm(true)
                      setIsEditingList(false) // 추가 폼 열 때 편집 모드는 종료
                    }
                  }}
                >
                  {showAddForm ? '취소' : '+ 추가'}
                </button>
              </div>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddChild} className="add-child-form card">
                <h3>{childToEdit ? '아이 정보 수정' : '새 아이 추가'}</h3>
                <div className="form-group">
                  <label className="form-label">이름</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="아이 이름"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">생년월일</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newChildBirthDate}
                    onChange={(e) => setNewChildBirthDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">메모 (선택)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 특이사항 등"
                    value={newChildMemo}
                    onChange={(e) => setNewChildMemo(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">소속/태그 (선택)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 2026년, 무지개반, 태윤부모님"
                    value={newChildGroupName}
                    onChange={(e) => setNewChildGroupName(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {childToEdit ? '수정 내용 저장' : '추가하기'}
                </button>
              </form>
            )}

            {/* 태그 필터 영역 */}
            {tags.length > 0 && (
              <div className="tags-filter-container">
                <span className="tags-label">소속 필터:</span>
                <div className="tags-list">
                  <button
                    className={`tag-chip ${selectedTags.length === 0 ? 'active' : ''}`}
                    onClick={() => setSelectedTags([])}
                  >
                    전체보기
                  </button>
                  {tags.map((tag, idx) => (
                    <button
                      key={idx}
                      className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="children-grid">
              {filteredChildren.length === 0 ? (
                <div className="empty-message">해당하는 아이가 없습니다.</div>
              ) : (
                filteredChildren.map((child) => (
                  <div key={child.childId} className={`child-card card ${child.isInProgress ? 'in-progress' : ''}`}>
                    <div className="child-header">
                      <div className="child-avatar">
                        {child.name.charAt(0)}
                        {child.isInProgress && <div className="progress-badge">진행중</div>}
                      </div>
                      <div className="child-info">
                        <h3>
                          {child.name}
                          {child.groupName && <span className="child-tag-badge">{child.groupName}</span>}
                        </h3>
                        <p>생일: {child.birthDate}</p>
                        {child.isInProgress && <p className="status-text">교육이 진행 중입니다</p>}
                      </div>
                    </div>
                    <div className="child-stats">
                      <div className="stat">
                        <span className="stat-label">평균 점수</span>
                        <span className="stat-value">{child.averageScore ? `${child.averageScore}점` : '-'}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">완료한 시나리오</span>
                        <span className="stat-value">{child.totalScenarios}개</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">초대 코드</span>
                        <span className="stat-value">{child.inviteCode || '-'}</span>
                      </div>
                    </div>
                    <div className="child-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
                      {isEditingList ? (
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={() => openEditForm(child)}
                          >
                            <FaEdit style={{ marginRight: '6px' }} /> 정보 수정
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ flex: 1 }}
                            onClick={() => openDeleteModal(child.childId, child.name)}
                          >
                            <FaTrash style={{ marginRight: '6px' }} /> 삭제
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleViewResults(child.childId)}
                          >
                            기록 보기
                          </button>
                          {child.isInProgress ? (
                            <>
                              <button className="btn btn-secondary disabled" disabled>
                                {child.vrCodeStatus === 'ISSUED' ? '인증 대기 중' : '교육 진행 중'}
                              </button>
                              <Link
                                to={`/child-select/${child.activeScenarioId}`}
                                state={{ selectedChildId: child.childId }}
                                className="btn btn-primary"
                              >
                                VR 코드 보기
                              </Link>
                              {child.vrCodeStatus === 'ISSUED' && (
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleCancelSession(child.childId, child.activeScenarioId)}
                                >
                                  취소
                                </button>
                              )}
                            </>
                          ) : (
                            <Link
                              to="/scenario-select"
                              state={{ selectedChildId: child.childId }}
                              className="btn btn-secondary"
                            >
                              시나리오 시작
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-section">
            <div className="section-header">
              <h2>학습 기록</h2>
              {selectedChild && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedChild(null)
                    setActiveTab('children')
                  }}
                >
                  아이 목록으로
                </button>
              )}
            </div>

            {!selectedChild ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaChartBar size={64} />
                </div>
                <p>아이를 선택하여 학습 기록을 확인하세요.</p>
              </div>
            ) : (
              <div className="results-list">
                {loadingReports ? (
                  <div className="loading-state">기록을 불러오는 중...</div>
                ) : reports.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FaFileAlt size={64} />
                    </div>
                    <p>아직 완료한 시나리오가 없습니다.</p>
                    <Link to="/scenario-select" className="btn btn-primary top-margin">
                      시나리오 체험하러 가기
                    </Link>
                  </div>
                ) : (
                  reports.map((report) => {
                    return (
                      <div key={report.id} className="report-card card simple">
                        <div className="report-header">
                          <div className="report-title">
                            <h3>{report.scenarioTitle}</h3>
                            <span className="report-date">
                              {new Date(report.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="report-score">
                            <span className="score-value">{report.totalScore}</span>
                            <span className="score-label">점</span>
                          </div>
                        </div>

                        <div className="report-summary">
                          <div className="summary-item">
                            <FaClock className="icon" />
                            <span>소요 시간: {Math.floor(report.duration / 60)}분 {report.duration % 60}초</span>
                          </div>
                        </div>

                        <div className="report-actions">
                          <Link to={`/scenario-detail/${report.id}`} className="btn-detail-view">
                            상세 분석 리포트 보기 &gt;
                          </Link>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>아이 삭제 확인</h3>
              </div>
              <div className="modal-body">
                <p className="modal-message">
                  정말 <strong>{childToDelete?.name}</strong> 아이를 목록에서 삭제하시겠습니까?
                </p>
                <p className="modal-submessage">
                  (아이의 데이터는 완전히 지워지지 않으며 계정에서만 연결이 해제됩니다.)
                </p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handleCancelDelete}>
                  취소
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPage

