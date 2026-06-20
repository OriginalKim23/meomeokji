export function getRecommendation(menuData, answers, options = {}) {
  const { excludedIds = [], dislikedIds = [] } = options;

  const scoredMenus = menuData.map((menu) => {
    let score = 0;

    if (answers.mealType !== 'any') {
      if (menu.mealTypes.includes(answers.mealType)) {
        score += 5;
      } else {
        score -= 8;
      }
    }

    if (answers.eatingMethod !== 'any') {
      if (menu.eatingMethods.includes(answers.eatingMethod)) {
        score += 4;
      } else {
        score -= 4;
      }
    }

    if (answers.priceLevel !== 'any') {
      if (menu.priceLevels.includes(answers.priceLevel)) {
        score += 3;
      } else {
        score -= 2;
      }
    }

    if (answers.tasteTag === 'unsure') {
      if (menu.tasteTags.includes('comfort')) {
        score += 4;
      }
    } else if (menu.tasteTags.includes(answers.tasteTag)) {
      score += 5;
    }

    if (menu.conditionTags.includes(answers.conditionTag)) {
      score += 4;
    }

    if (answers.groupType !== 'any') {
      if (menu.groupTags.includes(answers.groupType)) {
        score += 2;
      } else {
        score -= 3;
      }
    }

    if (answers.tasteTag === 'trendy') {
      score += menu.trendScore || 0;
    }

    if (answers.conditionTag === 'sick' && menu.spiceLevel === 'spicy') {
      score -= 7;
    }

    if (answers.tasteTag === 'light' && menu.heaviness === 'heavy') {
      score -= 4;
    }

    if (answers.conditionTag === 'very_hungry' && menu.heaviness === 'light') {
      score -= 4;
    }

    if (menu.avoidTags.includes(answers.conditionTag)) {
      score -= 6;
    }

    if (menu.avoidTags.includes(answers.tasteTag)) {
      score -= 6;
    }

    if (dislikedIds.includes(menu.id)) {
      score -= 8;
    }

    if (excludedIds.includes(menu.id)) {
      score -= 100;
    }

    return {
      ...menu,
      score,
    };
  });

  const sortedMenus = scoredMenus.sort((a, b) => b.score - a.score);

  const main = sortedMenus[0];

  const alternatives = sortedMenus
    .filter((menu) => menu.id !== main.id)
    .slice(0, 3);

  return {
    main,
    alternatives,
    candidates: sortedMenus.slice(0, 10),
  };
}