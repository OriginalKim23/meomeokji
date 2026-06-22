async function copyShareText(text) {
  if (!navigator.clipboard) {
    window.prompt('아래 내용을 복사해서 공유하면 돼.', text);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    alert('추천 결과를 복사했지! 친구에게 붙여넣어 보내면 돼.');
  } catch (error) {
    window.prompt('아래 내용을 복사해서 공유하면 돼.', text);
  }
}

export async function shareResult(currentResult) {
  if (!currentResult) return;

  const shareUrl = window.location.origin;

  const variationText =
    currentResult.variations?.length > 0
      ? `

이렇게 먹어도 좋지
${currentResult.variations.slice(0, 3).join(' · ')}`
      : '';

  const shareMessage = `🐿️ 머먹지가 오늘 메뉴를 골라줬지!

오늘의 추천은
🍽️ ${currentResult.name}

${currentResult.reason}${variationText}`;

  const fullShareText = `${shareMessage}

나도 메뉴 추천 받아보기
${shareUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: '머먹지? 추천 결과',
        text: shareMessage,
        url: shareUrl,
      });
    } catch (error) {
      // 사용자가 공유창을 닫은 경우에는 아무것도 하지 않음
    }

    return;
  }

  copyShareText(fullShareText);
}