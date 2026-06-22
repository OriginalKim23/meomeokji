const SCORE = {
  MEAL_TYPE_MATCH: 8,
  MEAL_TYPE_MISMATCH: -18,

  ANY_COMFORT_BONUS: 2,
  ANY_SPICY_PENALTY: -2,

  EATING_METHOD_MATCH: 5,
  EATING_METHOD_MISMATCH: -5,

  PRICE_MATCH: 3,
  PRICE_MISMATCH: -3,

  UNSURE_COMFORT_BONUS: 5,
  UNSURE_FILLING_BONUS: 1,
  UNSURE_SPICY_PENALTY: -3,

  TASTE_MATCH: 6,
  TASTE_MISMATCH: -1,

  CONDITION_MATCH: 5,

  GROUP_MATCH: 3,
  GROUP_MISMATCH: -4,

  TREND_MULTIPLIER: 2,

  SICK_SPICY_PENALTY: -14,
  LIGHT_HEAVY_PENALTY: -7,
  VERY_HUNGRY_LIGHT_PENALTY: -7,
  UNWANTED_SPICY_PENALTY: -3,

  AVOID_TAG_PENALTY: -8,

  DISLIKED_PENALTY: -30,
  EXCLUDED_PENALTY: -100,
};

function hasTag(tags, value) {
  return Array.isArray(tags) && tags.includes(value);
}

export function getRecommendation(menuData, answers, options = {}) {
  const { excludedIds = [], dislikedIds = [] } = options;

  const scoredMenus = menuData.map((menu) => {
    let score = 0;

    // 1. 식사 / 디저트 / 야식 종류가 맞는지 확인
    if (answers.mealType !== 'any') {
      if (hasTag(menu.mealTypes, answers.mealType)) {
        score += SCORE.MEAL_TYPE_MATCH;
      } else {
        score += SCORE.MEAL_TYPE_MISMATCH;
      }
    } else {
      // 아무거나 선택 시에는 너무 강한 메뉴가 바로 튀어나오지 않게 조정
      if (hasTag(menu.tasteTags, 'comfort')) {
        score += SCORE.ANY_COMFORT_BONUS;
      }

      if (menu.spiceLevel === 'spicy') {
        score += SCORE.ANY_SPICY_PENALTY;
      }
    }

    // 2. 배달 / 외식 / 집밥 / 편의점 등 먹는 방식 확인
    if (answers.eatingMethod !== 'any') {
      if (hasTag(menu.eatingMethods, answers.eatingMethod)) {
        score += SCORE.EATING_METHOD_MATCH;
      } else {
        score += SCORE.EATING_METHOD_MISMATCH;
      }
    }

    // 3. 예산 확인
    if (answers.priceLevel !== 'any') {
      if (hasTag(menu.priceLevels, answers.priceLevel)) {
        score += SCORE.PRICE_MATCH;
      } else {
        score += SCORE.PRICE_MISMATCH;
      }
    }

    // 4. 오늘 먹고 싶은 느낌 확인
    if (answers.tasteTag === 'unsure') {
      if (hasTag(menu.tasteTags, 'comfort')) {
        score += SCORE.UNSURE_COMFORT_BONUS;
      }

      if (hasTag(menu.tasteTags, 'filling')) {
        score += SCORE.UNSURE_FILLING_BONUS;
      }

      // 모르겠어 선택 시에는 너무 매운 메뉴를 살짝 줄임
      if (menu.spiceLevel === 'spicy') {
        score += SCORE.UNSURE_SPICY_PENALTY;
      }
    } else if (hasTag(menu.tasteTags, answers.tasteTag)) {
      score += SCORE.TASTE_MATCH;
    } else {
      score += SCORE.TASTE_MISMATCH;
    }

    // 5. 현재 컨디션과 맞는 메뉴인지 확인
    if (hasTag(menu.conditionTags, answers.conditionTag)) {
      score += SCORE.CONDITION_MATCH;
    }

    // 6. 혼자 / 둘 이상 먹기 좋은 메뉴인지 확인
    if (answers.groupType !== 'any') {
      if (hasTag(menu.groupTags, answers.groupType)) {
        score += SCORE.GROUP_MATCH;
      } else {
        score += SCORE.GROUP_MISMATCH;
      }
    }

    // 7. 유행하는 메뉴를 원하면 trendScore 반영
    if (answers.tasteTag === 'trendy') {
      score += (menu.trendScore || 0) * SCORE.TREND_MULTIPLIER;
    }

    // 8. 몸이 안 좋을 때는 매운 메뉴를 강하게 줄임
    if (answers.conditionTag === 'sick' && menu.spiceLevel === 'spicy') {
      score += SCORE.SICK_SPICY_PENALTY;
    }

    // 9. 가벼운 걸 원할 때는 너무 무거운 메뉴를 줄임
    if (answers.tasteTag === 'light' && menu.heaviness === 'heavy') {
      score += SCORE.LIGHT_HEAVY_PENALTY;
    }

    // 10. 배고픔 MAX일 때는 너무 가벼운 메뉴를 줄임
    if (answers.conditionTag === 'very_hungry' && menu.heaviness === 'light') {
      score += SCORE.VERY_HUNGRY_LIGHT_PENALTY;
    }

    // 11. 자극적인 걸 원하지 않을 때는 매운 메뉴를 살짝 줄임
    if (
      answers.tasteTag !== 'stimulating' &&
      answers.tasteTag !== 'trendy' &&
      answers.conditionTag !== 'stressed' &&
      menu.spiceLevel === 'spicy'
    ) {
      score += SCORE.UNWANTED_SPICY_PENALTY;
    }

    // 12. 피해야 하는 태그가 있으면 감점
    if (hasTag(menu.avoidTags, answers.conditionTag)) {
      score += SCORE.AVOID_TAG_PENALTY;
    }

    if (hasTag(menu.avoidTags, answers.tasteTag)) {
      score += SCORE.AVOID_TAG_PENALTY;
    }

    if (hasTag(menu.avoidTags, answers.groupType)) {
      score += SCORE.AVOID_TAG_PENALTY;
    }

    // 13. 별로야를 누른 메뉴는 다시 덜 나오게 함
    if (dislikedIds.includes(menu.id)) {
      score += SCORE.DISLIKED_PENALTY;
    }

    // 14. 다시 골라줘에서 이미 나온 메뉴는 이번 추천에서 제외
    if (excludedIds.includes(menu.id)) {
      score += SCORE.EXCLUDED_PENALTY;
    }

    return {
      ...menu,
      score,
    };
  });

  const sortedMenus = scoredMenus.sort((a, b) => b.score - a.score);

  // 점수가 0보다 큰 메뉴 안에서 우선 추천
  const positiveCandidates = sortedMenus.filter((menu) => menu.score > 0);

  // 후보가 있으면 상위 8개, 없으면 점수와 상관없이 상위 5개 사용
  const topCandidates =
    positiveCandidates.length > 0
      ? positiveCandidates.slice(0, 8)
      : sortedMenus.slice(0, 5);

  const main = pickWeightedRandom(topCandidates);

  if (!main) {
    return {
      main: null,
      alternatives: [],
      candidates: [],
    };
  }

  const alternatives = sortedMenus
    .filter((menu) => menu.id !== main.id)
    .filter((menu) => menu.score > 0)
    .slice(0, 3);

  return {
    main,
    alternatives,
    candidates: topCandidates,
  };
}

function pickWeightedRandom(candidates) {
  if (candidates.length === 0) {
    return null;
  }

  const totalWeight = candidates.reduce((sum, menu) => {
    return sum + Math.max(menu.score, 1);
  }, 0);

  let random = Math.random() * totalWeight;

  for (const menu of candidates) {
    random -= Math.max(menu.score, 1);

    if (random <= 0) {
      return menu;
    }
  }

  return candidates[0];
}