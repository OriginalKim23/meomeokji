export const QUESTIONS = [
  {
    id: 'mealType',
    title: (
      <>
        오늘은<br />
        뭐가 필요하지?
      </>
    ),
    options: [
      { emoji: '🍚', label: '식사', value: 'meal' },
      { emoji: '🍰', label: '디저트', value: 'dessert' },
      { emoji: '🌙', label: '야식', value: 'night' },
      { emoji: '🎲', label: '아무거나', value: 'any' },
    ],
  },
  {
    id: 'groupType',
    title: (
      <>
        누구랑<br />
        먹지?
      </>
    ),
    options: [
      { emoji: '🧍', label: '혼자', value: 'solo' },
      { emoji: '👯', label: '둘 이상', value: 'group' },
      { emoji: '🤷', label: '상관없어', value: 'any' },
    ],
  },
  {
    id: 'eatingMethod',
    title: (
      <>
        어떻게<br />
        먹을까?
      </>
    ),
    options: [
      { emoji: '🛵', label: '배달', value: 'delivery' },
      { emoji: '🚶', label: '외식', value: 'dine_out' },
      { emoji: '🏠', label: '집밥', value: 'home' },
      { emoji: '🏪', label: '편의점·간단히', value: 'convenience' },
      { emoji: '🤷', label: '상관없어', value: 'any' },
    ],
  },
  {
    id: 'priceLevel',
    title: (
      <>
        얼마 정도로<br />
        생각 중이지?
      </>
    ),
    options: [
      { emoji: '💸', label: '1만원 이하', value: 'under_10000' },
      { emoji: '💰', label: '1~2만원', value: 'between_10000_20000' },
      { emoji: '🤑', label: '2만원 이상', value: 'over_20000' },
      { emoji: '🤷', label: '상관없어', value: 'any' },
    ],
  },
  {
    id: 'tasteTag',
    title: (
      <>
        오늘은<br />
        어떤 느낌이지?
      </>
    ),
    options: [
      { emoji: '🍲', label: '따뜻한 거', value: 'warm' },
      { emoji: '🔥', label: '자극적인 거', value: 'stimulating' },
      { emoji: '💪', label: '든든한 거', value: 'filling' },
      { emoji: '🥗', label: '가벼운 거', value: 'light' },
      { emoji: '🍰', label: '달달한 거', value: 'sweet' },
      { emoji: '🍟', label: '바삭한 거', value: 'crispy' },
      { emoji: '✨', label: '유행하는 거', value: 'trendy' },
      { emoji: '🎲', label: '모르겠어', value: 'unsure' },
    ],
  },
  {
    id: 'conditionTag',
    title: (
      <>
        지금 상태는<br />
        좀 어때?
      </>
    ),
    options: [
      { emoji: '🙂', label: '괜찮아', value: 'okay' },
      { emoji: '😵', label: '피곤해', value: 'tired' },
      { emoji: '🤒', label: '몸이 안 좋아', value: 'sick' },
      { emoji: '🤯', label: '스트레스 받아', value: 'stressed' },
      { emoji: '🤤', label: '배고픔 MAX', value: 'very_hungry' },
      { emoji: '😎', label: '기분전환 필요해', value: 'refresh' },
    ],
  },
];