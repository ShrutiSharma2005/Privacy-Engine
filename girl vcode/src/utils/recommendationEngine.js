export const getRecommendations = (allItems, userInterests, sensitivity, timeOfDay, clicks = {}) => {
  const scoredItems = allItems.map(item => {
    let score = 0;
    let reasons = [];

    // 1. Interest Match
    const matchedInterests = userInterests.filter(interest => 
      item.tags.includes(interest.toLowerCase()) || 
      item.category.toLowerCase() === interest.toLowerCase()
    );

    if (matchedInterests.length > 0) {
      score += matchedInterests.length * 10;
      reasons.push(`matches your interest in ${matchedInterests.join(', ')}`);
    }

    // 2. Time of Day Context Match
    const timeTag = timeOfDay.toLowerCase();
    if (item.tags.includes(timeTag)) {
      score += 5;
      reasons.push(`it is good for the ${timeOfDay}`);
    }

    // 3. Click Frequency Weight
    const categoryClicks = clicks[item.category] || 0;
    if (categoryClicks > 0) {
      score += categoryClicks * 2;
      reasons.push(`you often view ${item.category}`);
    }

    // Default Fallback
    if (reasons.length === 0) {
      reasons.push('it is currently trending');
    }

    // Compile Reason string
    let reasonString = 'Because ' + reasons.join(' and ');

    return { ...item, score, reasonString, matched: matchedInterests.length > 0 || item.tags.includes(timeTag) || categoryClicks > 0 };
  });

  // Filter based on Sensitivity Slider (0 to 100)
  // Low (0-33): Show everything, slightly ranked.
  // Medium (34-66): Prefer matched items, show some random.
  // High (67-100): Strictly show only matched items if available, or highly relevant ones.
  
  let filteredItems = scoredItems;
  
  if (sensitivity >= 67) {
    // High strictness: must match something, or if nothing matches, return empty (or very few)
    filteredItems = scoredItems.filter(item => item.matched);
    if (filteredItems.length === 0 && scoredItems.length > 0) {
       // if literally nothing matches, just return the top scored ones anyway but strict
       filteredItems = scoredItems.sort((a,b) => b.score - a.score).slice(0, 2);
    }
  }

  // Rank by score descending
  filteredItems.sort((a, b) => b.score - a.score);

  return filteredItems;
};
