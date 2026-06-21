export function getRecommendation(menuData, answers, options = {}) {
  const { excludedIds = [], dislikedIds = [] } = options;

  const scoredMenus = menuData.map((menu) => {
    let score = 0;

    // 1. 식사 / 디저트 / 야식 일치
    if (answers.mealType !== 'any') {
      if (menu.mealTypes.includes(answers.mealType)) {
        score += 8;
      } else {
        score -= 18;
      }
    } else {
      // 아무거나일 때는 너무 호불호 강한 메뉴가 바로 튀어나오지 않게 살짝 조정
      if (menu.tasteTags.includes('comfort')) score += 2;
      if (menu.spiceLevel === 'spicy') score -= 2;
    }

    // 2. 먹는 방식 일치
    if (answers.eatingMethod !== 'any') {
      if (menu.eatingMethods.includes(answers.eatingMethod)) {
        score += 5;
      } else {
        score -= 5;
      }
    }

    // 3. 예산 일치
    if (answers.priceLevel !== 'any') {
      if (menu.priceLevels.includes(answers.priceLevel)) {
        score += 3;
      } else {
        score -= 3;
      }
    }

    // 4. 오늘 당기는 느낌
    if (answers.tasteTag === 'unsure') {
      if (menu.tasteTags.includes('comfort')) {
        score += 5;
      }

      if (menu.tasteTags.includes('filling')) {
        score += 1;
      }

      // 모르겠어일 때는 너무 강한 메뉴를 살짝 낮춤
      if (menu.spiceLevel === 'spicy') {
        score -= 3;
      }
    } else if (menu.tasteTags.includes(answers.tasteTag)) {
      score += 6;
    } else {
      score -= 1;
    }

    // 5. 현재 상태 일치
    if (menu.conditionTags.includes(answers.conditionTag)) {
      score += 5;
    }

    // 6. 혼자 / 둘 이상 조건
    if (answers.groupType !== 'any') {
      if (menu.groupTags.includes(answers.groupType)) {
        score += 3;
      } else {
        score -= 4;
      }
    }

    // 7. 유행하는 거 선택 시 트렌드 점수 강화
    if (answers.tasteTag === 'trendy') {
      score += (menu.trendScore || 0) * 2;
    }

    // 8. 몸이 안 좋은데 매운 메뉴면 강하게 감점
    if (answers.conditionTag === 'sick' && menu.spiceLevel === 'spicy') {
      score -= 14;
    }

    // 9. 가벼운 거 원하는데 너무 든든하면 감점
    if (answers.tasteTag === 'light' && menu.heaviness === 'heavy') {
      score -= 7;
    }

    // 10. 배고픔 MAX인데 너무 가벼우면 감점
    if (answers.conditionTag === 'very_hungry' && menu.heaviness === 'light') {
      score -= 7;
    }

    // 11. 자극적인 걸 원하지 않았는데 너무 매운 메뉴면 살짝 감점
    if (
      answers.tasteTag !== 'stimulating' &&
      answers.tasteTag !== 'trendy' &&
      answers.conditionTag !== 'stressed' &&
      menu.spiceLevel === 'spicy'
    ) {
      score -= 3;
    }

    // 12. 피해야 할 태그 감점
    if (menu.avoidTags.includes(answers.conditionTag)) {
      score -= 8;
    }

    if (menu.avoidTags.includes(answers.tasteTag)) {
      score -= 8;
    }

    if (menu.avoidTags.includes(answers.groupType)) {
      score -= 8;
    }

    // 13. 별로야 누른 메뉴는 강하게 감점
    if (dislikedIds.includes(menu.id)) {
      score -= 30;
    }

    // 14. 다시 골라줘에서 이미 나온 메뉴는 제외
    if (excludedIds.includes(menu.id)) {
      score -= 100;
    }

    return {
      ...menu,
      score,
    };
  });

  const sortedMenus = scoredMenus.sort((a, b) => b.score - a.score);

  // 점수가 너무 낮은 메뉴는 후보에서 빼기
  const positiveCandidates = sortedMenus.filter((menu) => menu.score > 0);

  // 후보가 있으면 상위 8개, 없으면 어쩔 수 없이 상위 5개 사용
  const topCandidates =
    positiveCandidates.length > 0
      ? positiveCandidates.slice(0, 8)
      : sortedMenus.slice(0, 5);

  const main = pickWeightedRandom(topCandidates);

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