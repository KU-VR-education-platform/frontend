// 더미 데이터

// 아이콘 타입 정의 (React Icons 컴포넌트 이름)
export const scenarioIcons = {
  1: 'TrafficLight', // 횡단보도
  2: 'Bus', // 대중교통
  3: 'Restaurant', // 키오스크
  4: 'Store' // 편의점
}

export const scenarios = [
  {
    id: 1,
    name: '횡단보도 건너기',
    description: '신호등을 확인하고 안전하게 횡단보도를 건너는 시나리오입니다.',
    iconType: 'TrafficLight',
    difficulty: '쉬움',
    estimatedTime: '5분',
    steps: [
      '횡단보도 앞으로 이동',
      '신호등을 확인',
      '초록불일 때 건너기',
      '격려 메시지 확인'
    ]
  },
  {
    id: 2,
    name: '대중교통 이용하기',
    description: '버스를 타고 목적지까지 안전하게 이동하는 시나리오입니다.',
    iconType: 'Bus',
    difficulty: '보통',
    estimatedTime: '10분',
    steps: [
      '버스 정류장으로 이동',
      '버스 대기',
      '카드 찍기',
      '자리에 앉기',
      '하차 벨 누르기',
      '안전하게 내리기'
    ]
  },
  {
    id: 3,
    name: '키오스크로 주문하기',
    description: '키오스크를 사용하여 음식을 주문하고 결제하는 시나리오입니다.',
    iconType: 'Restaurant',
    difficulty: '보통',
    estimatedTime: '15분',
    steps: [
      '임무 확인',
      '메뉴 선택',
      '결제하기',
      '음식 받기',
      '분리수거하기'
    ]
  },
  {
    id: 4,
    name: '무인 편의점 이용하기',
    description: '편의점에서 물건을 구매하고 계산하는 시나리오입니다.',
    iconType: 'Store',
    difficulty: '어려움',
    estimatedTime: '15분',
    steps: [
      '임무 확인',
      '장바구니 잡기',
      '물건 찾기',
      '계산하기',
      '결제하기'
    ]
  }
]

export const dummyChildren = [
  {
    id: 'child_001',
    name: '김민수',
    age: 8,
    created_at: '2024-01-15',
    total_scenarios: 12,
    average_score: 85,
    last_activity: '2024-01-20'
  },
  {
    id: 'child_002',
    name: '이지은',
    age: 9,
    created_at: '2024-01-10',
    total_scenarios: 8,
    average_score: 92,
    last_activity: '2024-01-19'
  },
  {
    id: 'child_003',
    name: '박준호',
    age: 7,
    created_at: '2024-01-20',
    total_scenarios: 5,
    average_score: 78,
    last_activity: '2024-01-21'
  }
]

export const dummyScenarioResults = {
  'child_001': {
    '1': [
      {
        id: 'result_001',
        scenario_id: 1,
        scenario_name: '횡단보도 건너기',
        child_id: 'child_001',
        child_name: '김민수',
        score: 90,
        completed_at: '2024-01-20T10:30:00',
        duration: 320, // 초
        steps_completed: [
          { step: '횡단보도 앞으로 이동', completed: true, time: 45 },
          { step: '신호등을 확인', completed: true, time: 30 },
          { step: '초록불일 때 건너기', completed: true, time: 120 },
          { step: '격려 메시지 확인', completed: true, time: 15 }
        ],
        mistakes: [
          { step: '신호등 확인', message: '빨간불에서 건너려고 시도함', time: 60 }
        ],
        ai_analysis: {
          strengths: [
            '신호등을 주의깊게 관찰하는 능력이 뛰어납니다.',
            '안전 규칙을 잘 준수합니다.'
          ],
          improvements: [
            '신호등 확인 시간을 조금 더 길게 가져가면 좋겠습니다.',
            '차량이 없는지 좌우를 더 자세히 살펴보는 연습이 필요합니다.'
          ],
          recommendations: [
            '다음 시나리오에서는 좌우 확인 단계를 추가하여 더 안전하게 건너는 연습을 해보세요.'
          ]
        }
      },
      {
        id: 'result_002',
        scenario_id: 1,
        scenario_name: '횡단보도 건너기',
        child_id: 'child_001',
        child_name: '김민수',
        score: 85,
        completed_at: '2024-01-18T14:20:00',
        duration: 380,
        steps_completed: [
          { step: '횡단보도 앞으로 이동', completed: true, time: 50 },
          { step: '신호등을 확인', completed: true, time: 35 },
          { step: '초록불일 때 건너기', completed: true, time: 150 },
          { step: '격려 메시지 확인', completed: true, time: 20 }
        ],
        mistakes: [
          { step: '신호등 확인', message: '빨간불에서 건너려고 시도함', time: 70 }
        ],
        ai_analysis: {
          strengths: [
            '차근차근 단계를 따라가는 모습이 좋습니다.'
          ],
          improvements: [
            '신호등 확인을 더 신중하게 해야 합니다.'
          ],
          recommendations: [
            '신호등 색깔을 구분하는 연습을 더 해보세요.'
          ]
        }
      }
    ],
    '2': [
      {
        id: 'result_003',
        scenario_id: 2,
        scenario_name: '대중교통 이용하기',
        child_id: 'child_001',
        child_name: '김민수',
        score: 88,
        completed_at: '2024-01-19T11:15:00',
        duration: 580,
        steps_completed: [
          { step: '버스 정류장으로 이동', completed: true, time: 60 },
          { step: '버스 대기', completed: true, time: 120 },
          { step: '카드 찍기', completed: true, time: 30 },
          { step: '자리에 앉기', completed: true, time: 45 },
          { step: '하차 벨 누르기', completed: true, time: 25 },
          { step: '안전하게 내리기', completed: true, time: 40 }
        ],
        mistakes: [
          { step: '카드 찍기', message: '카드를 찍지 않고 탑승하려고 함', time: 150 }
        ],
        ai_analysis: {
          strengths: [
            '버스 이용 절차를 잘 이해하고 있습니다.',
            '안전하게 앉아서 이동하는 모습이 좋습니다.'
          ],
          improvements: [
            '카드 찍는 것을 잊지 않도록 주의가 필요합니다.'
          ],
          recommendations: [
            '카드 찍기 단계를 더 강조하여 연습해보세요.'
          ]
        }
      }
    ]
  },
  'child_002': {
    '1': [
      {
        id: 'result_004',
        scenario_id: 1,
        scenario_name: '횡단보도 건너기',
        child_id: 'child_002',
        child_name: '이지은',
        score: 95,
        completed_at: '2024-01-19T09:45:00',
        duration: 280,
        steps_completed: [
          { step: '횡단보도 앞으로 이동', completed: true, time: 40 },
          { step: '신호등을 확인', completed: true, time: 25 },
          { step: '초록불일 때 건너기', completed: true, time: 110 },
          { step: '격려 메시지 확인', completed: true, time: 15 }
        ],
        mistakes: [],
        ai_analysis: {
          strengths: [
            '매우 신중하고 안전하게 횡단보도를 건넙니다.',
            '신호등을 정확하게 확인합니다.'
          ],
          improvements: [],
          recommendations: [
            '완벽한 수행입니다! 다음 단계 시나리오를 도전해보세요.'
          ]
        }
      }
    ]
  }
}

export const getChildScenarioResults = (childId, scenarioId) => {
  return dummyScenarioResults[childId]?.[scenarioId] || []
}

export const getAllChildResults = (childId) => {
  const results = []
  const childResults = dummyScenarioResults[childId] || {}
  
  Object.keys(childResults).forEach(scenarioId => {
    results.push(...childResults[scenarioId])
  })
  
  return results.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
}

