import { Footballer, AnswerType } from '@/types/footballer';
import { FOOTBALLERS } from '@/data/footballers';

export interface QAResult {
  type: AnswerType;
  badge: string;
  response: string;
  isGuess: boolean;
  matchedPlayerName?: string;
  isCorrect?: boolean;
}

// Clean and normalize strings for matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (e.g. é -> e, ć -> c)
    .replace(/['’]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Simple Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function isSimilar(input: string, target: string, threshold = 2): boolean {
  if (input === target) return true;
  if (input.length <= 3) return input === target;
  const dist = levenshteinDistance(input, target);
  return dist <= threshold;
}

const QUESTION_INDICATOR_WORDS = new Set([
  'active', 'retired', 'play', 'played', 'playing', 'plays',
  'from', 'left', 'right', 'foot', 'footed', 'feet', 'both',
  'striker', 'forward', 'attacker', 'winger', 'midfield', 'midfielder', 'defender', 'defense', 'defence',
  'keeper', 'goalkeeper', 'goalie', 'gloves', 'gk',
  'tall', 'short', 'over', 'under', 'older', 'younger', 'age', 'years', 'old', 'height',
  'won', 'win', 'winner', 'trophy', 'trophies', 'ballon', 'ucl', 'euro', 'copa',
  'captain', 'armband', 'number', 'jersey', 'shirt',
  'dribble', 'dribbling', 'speed', 'fast', 'pace', 'celebration',
  'europe', 'european', 'african', 'asian',
  'argentine', 'brazilian', 'french', 'english', 'portuguese', 'spanish',
  'german', 'italian', 'dutch', 'norwegian', 'belgian', 'croatian', 'polish', 'egyptian', 'uruguayan', 'korean', 'swedish', 'welsh', 'ivorian',
  'have', 'has', 'did', 'does', 'still', 'currently', 'now', 'ever'
]);

// Check if a query is a direct guess for a footballer
export function checkPlayerGuess(
  query: string,
  secretPlayer: Footballer
): { isGuess: boolean; isCorrect: boolean; matchedFootballer?: Footballer; guessedName?: string } {
  const clean = normalizeText(query);

  // If query contains obvious question words and doesn't explicitly declare a guess
  const isExplicitGuess =
    clean.startsWith('i guess') ||
    clean.startsWith('my guess is') ||
    clean.startsWith('guess:') ||
    clean.startsWith('could it be');

  const guessPrefixes = [
    /^(is\s+(it|he)\s+)/,
    /^(are\s+you\s+)/,
    /^(could\s+it\s+be\s+)/,
    /^(i\s+(guess|think\s+its?)\s+)/,
    /^(my\s+guess\s+is\s+)/,
    /^(guess\s*:\s*)/,
  ];

  let potentialName = clean;
  let hasPrefix = false;

  for (const prefix of guessPrefixes) {
    if (prefix.test(potentialName)) {
      potentialName = potentialName.replace(prefix, '').trim();
      hasPrefix = true;
      break;
    }
  }

  const potentialWords = potentialName.split(' ').filter(Boolean);

  // If the query has question words (like "active", "retired", "left footed", "won the world cup")
  // and is NOT an explicit name guess, then it's a question, NOT a player guess.
  const hasQuestionIndicators = potentialWords.some((w) => QUESTION_INDICATOR_WORDS.has(w));
  if (hasQuestionIndicators && !isExplicitGuess) {
    return { isGuess: false, isCorrect: false };
  }

  // 1. Direct match with Secret Player name or aliases
  const secretAliases = [secretPlayer.name, ...secretPlayer.aliases].map(normalizeText);
  for (const alias of secretAliases) {
    if (potentialName === alias || isSimilar(potentialName, alias, 1)) {
      return { isGuess: true, isCorrect: true, matchedFootballer: secretPlayer, guessedName: secretPlayer.name };
    }
  }

  // Check each word of secret player name (e.g. "Messi", "Haaland", "Mbappe", "Zidane")
  const secretWords = normalizeText(secretPlayer.name).split(' ').filter((w) => w.length > 2);
  for (const sw of secretWords) {
    if (potentialWords.length <= 2 && potentialWords.some((pw) => pw === sw || isSimilar(pw, sw, 1))) {
      return { isGuess: true, isCorrect: true, matchedFootballer: secretPlayer, guessedName: secretPlayer.name };
    }
  }

  // 2. Check match with ANY other footballer in the database
  for (const player of FOOTBALLERS) {
    const aliases = [player.name, ...player.aliases].map(normalizeText);
    for (const alias of aliases) {
      if (potentialName === alias || isSimilar(potentialName, alias, 1)) {
        const isSecret = player.id === secretPlayer.id;
        return {
          isGuess: true,
          isCorrect: isSecret,
          matchedFootballer: player,
          guessedName: player.name,
        };
      }
    }

    // Match individual last name or key word of known footballer
    const pWords = normalizeText(player.name).split(' ').filter((w) => w.length > 3);
    for (const pw of pWords) {
      if (potentialWords.length <= 2 && potentialWords.some((word) => word === pw || isSimilar(word, pw, 1))) {
        const isSecret = player.id === secretPlayer.id;
        return {
          isGuess: true,
          isCorrect: isSecret,
          matchedFootballer: player,
          guessedName: player.name,
        };
      }
    }
  }

  // 3. If explicit guess (e.g. "my guess is Marcus Rashford"), but player is not in our 40-star DB
  if (isExplicitGuess || (hasPrefix && potentialWords.length >= 1 && potentialWords.length <= 3 && !hasQuestionIndicators)) {
    return { isGuess: true, isCorrect: false, guessedName: potentialName };
  }

  return { isGuess: false, isCorrect: false };
}

// Main QA evaluation function
export function answerQuestion(rawQuery: string, player: Footballer): QAResult {
  const query = normalizeText(rawQuery);

  // 1. Check if the question is a player name guess
  const guessCheck = checkPlayerGuess(rawQuery, player);
  if (guessCheck.isGuess) {
    if (guessCheck.isCorrect) {
      return {
        type: 'correct_guess',
        badge: 'GOAL! CORRECT! 🏆',
        response: `YES! You got it! It's ${player.name}! What a masterclass guess! 🎉`,
        isGuess: true,
        matchedPlayerName: player.name,
        isCorrect: true,
      };
    } else {
      const guessed = guessCheck.guessedName || 'that player';
      return {
        type: 'wrong_guess',
        badge: 'INCORRECT! ❌',
        response: `No, it's NOT ${guessed}! Keep digging, ask another yes/no question!`,
        isGuess: true,
        matchedPlayerName: guessCheck.guessedName,
        isCorrect: false,
      };
    }
  }

  // 2. Active / Retired status
  if (
    query.includes('retired') ||
    query.includes('hung up') ||
    query.includes('stop playing') ||
    query.includes('ended career')
  ) {
    const isRetired = !player.isActive;
    return {
      type: isRetired ? 'yes' : 'no',
      badge: isRetired ? 'YES ✅' : 'NO ❌',
      response: isRetired
        ? `Yes! He has officially hung up his boots and is retired from professional football.`
        : `No, he is still an active professional footballer!`,
      isGuess: false,
    };
  }

  if (
    query.includes('active') ||
    query.includes('still play') ||
    query.includes('current player') ||
    query.includes('currently play')
  ) {
    return {
      type: player.isActive ? 'yes' : 'no',
      badge: player.isActive ? 'YES ✅' : 'NO ❌',
      response: player.isActive
        ? `Yes! He is an active player currently playing for ${player.currentClub}.`
        : `No, he has retired from professional football.`,
      isGuess: false,
    };
  }

  // 3. Position Checks
  // Goalkeeper
  if (
    query.includes('goalkeeper') ||
    query.includes('keeper') ||
    query.includes('goalie') ||
    query.includes('gloves') ||
    query.includes('gk')
  ) {
    const isGk = player.position === 'Goalkeeper';
    return {
      type: isGk ? 'yes' : 'no',
      badge: isGk ? 'YES ✅' : 'NO ❌',
      response: isGk
        ? `Yes! He is a world-class Goalkeeper wearing the gloves.`
        : `No, he is an outfield player, not a goalkeeper.`,
      isGuess: false,
    };
  }

  // Defender
  if (
    query.includes('defender') ||
    query.includes('center back') ||
    query.includes('centre back') ||
    query.includes('full back') ||
    query.includes('left back') ||
    query.includes('right back') ||
    query.includes('defense') ||
    query.includes('defence')
  ) {
    const isDef = player.position === 'Defender';
    return {
      type: isDef ? 'yes' : 'no',
      badge: isDef ? 'YES ✅' : 'NO ❌',
      response: isDef
        ? `Yes! He plays as a defender.`
        : `No, he does not play in defence.`,
      isGuess: false,
    };
  }

  // Midfielder
  if (
    query.includes('midfield') ||
    query.includes('playmaker') ||
    query.includes('cam') ||
    query.includes('cdm') ||
    query.includes('central mid')
  ) {
    const isMid = player.position === 'Midfielder';
    return {
      type: isMid ? 'yes' : 'no',
      badge: isMid ? 'YES ✅' : 'NO ❌',
      response: isMid
        ? `Yes! He commands the midfield.`
        : `No, he is not a midfielder.`,
      isGuess: false,
    };
  }

  // Striker / Forward / Attacker / Winger
  if (
    query.includes('striker') ||
    query.includes('forward') ||
    query.includes('attacker') ||
    query.includes('winger') ||
    query.includes('number 9') ||
    query.includes('goalscorer')
  ) {
    const isFwd = player.position === 'Forward';
    const subMatch = player.subPositions.some((p) =>
      query.includes(p.toLowerCase())
    );
    if (isFwd || subMatch) {
      return {
        type: 'yes',
        badge: 'YES ✅',
        response: `Yes! He plays in attack as a ${player.subPositions.join(' / ')}.`,
        isGuess: false,
      };
    }
    return {
      type: 'no',
      badge: 'NO ❌',
      response: `No, he is not a forward/striker. He plays as a ${player.position}.`,
      isGuess: false,
    };
  }

  // 4. Continent / Origin
  if (query.includes('europe') || query.includes('european')) {
    const isEur = player.continent === 'Europe';
    return {
      type: isEur ? 'yes' : 'no',
      badge: isEur ? 'YES ✅' : 'NO ❌',
      response: isEur
        ? `Yes! He represents a European nation (${player.nationality}).`
        : `No, he is not from Europe.`,
      isGuess: false,
    };
  }

  if (
    query.includes('south america') ||
    query.includes('south american') ||
    query.includes('latin america') ||
    query.includes('conmebol')
  ) {
    const isSA = player.continent === 'South America';
    return {
      type: isSA ? 'yes' : 'no',
      badge: isSA ? 'YES ✅' : 'NO ❌',
      response: isSA
        ? `Yes! He is from South America (${player.nationality}).`
        : `No, he is not from South America.`,
      isGuess: false,
    };
  }

  if (query.includes('africa') || query.includes('african')) {
    const isAf = player.continent === 'Africa';
    return {
      type: isAf ? 'yes' : 'no',
      badge: isAf ? 'YES ✅' : 'NO ❌',
      response: isAf
        ? `Yes! He hails from Africa (${player.nationality}).`
        : `No, he is not from Africa.`,
      isGuess: false,
    };
  }

  if (query.includes('asia') || query.includes('asian')) {
    const isAs = player.continent === 'Asia';
    return {
      type: isAs ? 'yes' : 'no',
      badge: isAs ? 'YES ✅' : 'NO ❌',
      response: isAs
        ? `Yes! He represents an Asian nation (${player.nationality}).`
        : `No, he is not from Asia.`,
      isGuess: false,
    };
  }

  // 5. Specific Nationalities
  const countryMap: Record<string, { country: string; adj: string[] }> = {
    argentina: { country: 'Argentina', adj: ['argentina', 'argentine', 'argentinian'] },
    portugal: { country: 'Portugal', adj: ['portugal', 'portuguese'] },
    france: { country: 'France', adj: ['france', 'french'] },
    brazil: { country: 'Brazil', adj: ['brazil', 'brazilian', 'brasil'] },
    england: { country: 'England', adj: ['england', 'english', 'british', 'brit'] },
    norway: { country: 'Norway', adj: ['norway', 'norwegian'] },
    spain: { country: 'Spain', adj: ['spain', 'spanish', 'spaniard'] },
    germany: { country: 'Germany', adj: ['germany', 'german'] },
    italy: { country: 'Italy', adj: ['italy', 'italian'] },
    belgium: { country: 'Belgium', adj: ['belgium', 'belgian'] },
    netherlands: { country: 'Netherlands', adj: ['netherlands', 'dutch', 'holland'] },
    croatia: { country: 'Croatia', adj: ['croatia', 'croatian'] },
    poland: { country: 'Poland', adj: ['poland', 'polish'] },
    egypt: { country: 'Egypt', adj: ['egypt', 'egyptian'] },
    uruguay: { country: 'Uruguay', adj: ['uruguay', 'uruguayan'] },
    korea: { country: 'South Korea', adj: ['korea', 'korean', 'south korea', 'south korean'] },
    sweden: { country: 'Sweden', adj: ['sweden', 'swedish'] },
    wales: { country: 'Wales', adj: ['wales', 'welsh'] },
    ivory_coast: { country: 'Ivory Coast', adj: ['ivory coast', 'ivorian', 'cote divoire'] },
    morocco: { country: 'Morocco', adj: ['morocco', 'moroccan'] },
    nigeria: { country: 'Nigeria', adj: ['nigeria', 'nigerian'] },
    georgia: { country: 'Georgia', adj: ['georgia', 'georgian'] },
    canada: { country: 'Canada', adj: ['canada', 'canadian'] },
  };

  for (const info of Object.values(countryMap)) {
    const mentionsCountry = info.adj.some((word) => query.includes(word));
    if (mentionsCountry) {
      const match = player.nationality.toLowerCase() === info.country.toLowerCase();
      return {
        type: match ? 'yes' : 'no',
        badge: match ? 'YES ✅' : 'NO ❌',
        response: match
          ? `Yes! He is proud to represent ${player.nationality}!`
          : `No, he does not play for ${info.country}.`,
        isGuess: false,
      };
    }
  }

  // 6. Trophies & Honors
  // World Cup
  if (
    query.includes('world cup') ||
    query.includes('fifa world cup') ||
    query.includes('jules rimet')
  ) {
    const hasWc = player.trophies.worldCup;
    return {
      type: hasWc ? 'yes' : 'no',
      badge: hasWc ? 'YES ✅' : 'NO ❌',
      response: hasWc
        ? `Yes! He is a FIFA World Cup Champion${
            player.trophies.worldCupCount && player.trophies.worldCupCount > 1
              ? ` (won it ${player.trophies.worldCupCount} times!)`
              : '!'
          }`
        : `No, he has never won the FIFA World Cup.`,
      isGuess: false,
    };
  }

  // Champions League
  if (
    query.includes('champions league') ||
    query.includes('ucl') ||
    query.includes('european cup')
  ) {
    const hasUcl = player.trophies.championsLeague;
    return {
      type: hasUcl ? 'yes' : 'no',
      badge: hasUcl ? 'YES ✅' : 'NO ❌',
      response: hasUcl
        ? `Yes! He has lifted the Champions League trophy${
            player.trophies.championsLeagueCount && player.trophies.championsLeagueCount > 1
              ? ` ${player.trophies.championsLeagueCount} times!`
              : '!'
          }`
        : `No, he has not won the UEFA Champions League.`,
      isGuess: false,
    };
  }

  // Ballon d'Or
  if (
    query.includes('ballon dor') ||
    query.includes('ballon d or') ||
    query.includes('golden ball')
  ) {
    const hasBdor = player.trophies.ballonDor;
    return {
      type: hasBdor ? 'yes' : 'no',
      badge: hasBdor ? 'YES ✅' : 'NO ❌',
      response: hasBdor
        ? `Yes! He has won the prestigious Ballon d'Or${
            player.trophies.ballonDorCount && player.trophies.ballonDorCount > 1
              ? ` (${player.trophies.ballonDorCount} times!)`
              : '!'
          }`
        : `No, he has never won a Ballon d'Or.`,
      isGuess: false,
    };
  }

  // Continental championship (Euro / Copa America)
  if (
    query.includes('euro') ||
    query.includes('copa america') ||
    query.includes('continental cup')
  ) {
    const hasCont = player.trophies.euroOrCopaAmerica;
    return {
      type: hasCont ? 'yes' : 'no',
      badge: hasCont ? 'YES ✅' : 'NO ❌',
      response: hasCont
        ? `Yes! He won a major continental trophy (Euro or Copa América) with his national team.`
        : `No, he has not won the Euro or Copa América.`,
      isGuess: false,
    };
  }

  // 7. Leagues
  const leagueList = [
    { name: 'Premier League', aliases: ['premier league', 'epl', 'english league', 'england league'] },
    { name: 'La Liga', aliases: ['la liga', 'spanish league', 'spain league'] },
    { name: 'Serie A', aliases: ['serie a', 'italian league', 'italy league'] },
    { name: 'Bundesliga', aliases: ['bundesliga', 'german league', 'germany league'] },
    { name: 'Ligue 1', aliases: ['ligue 1', 'french league', 'france league'] },
    { name: 'MLS', aliases: ['mls', 'major league soccer', 'american league', 'usa league'] },
    { name: 'Saudi Pro League', aliases: ['saudi', 'saudi pro league', 'saudi league'] },
  ];

  for (const lg of leagueList) {
    if (lg.aliases.some((alias) => query.includes(alias))) {
      const currentlyIn = player.currentLeague.toLowerCase().includes(lg.name.toLowerCase());
      const everIn = player.leagues.some((l) => l.toLowerCase().includes(lg.name.toLowerCase()));

      if (query.includes('current') || query.includes('now') || query.includes('currently')) {
        return {
          type: currentlyIn ? 'yes' : 'no',
          badge: currentlyIn ? 'YES ✅' : 'NO ❌',
          response: currentlyIn
            ? `Yes! He currently plays in the ${lg.name}.`
            : `No, he does not currently play in the ${lg.name}.`,
          isGuess: false,
        };
      }

      return {
        type: everIn ? 'yes' : 'no',
        badge: everIn ? 'YES ✅' : 'NO ❌',
        response: everIn
          ? `Yes! He has played in the ${lg.name}.`
          : `No, he has never played in the ${lg.name}.`,
        isGuess: false,
      };
    }
  }

  // 8. Clubs
  const clubs = [
    { name: 'Real Madrid', aliases: ['real madrid', 'los blancos', 'madrid'] },
    { name: 'Barcelona', aliases: ['barcelona', 'barca', 'blaugrana', 'fc barcelona'] },
    { name: 'Manchester United', aliases: ['manchester united', 'man utd', 'man united', 'red devils'] },
    { name: 'Manchester City', aliases: ['manchester city', 'man city', 'citizens', 'city'] },
    { name: 'Liverpool', aliases: ['liverpool', 'anfield', 'the reds'] },
    { name: 'Chelsea', aliases: ['chelsea', 'the blues', 'stamford bridge'] },
    { name: 'Arsenal', aliases: ['arsenal', 'the gunners', 'gunners'] },
    { name: 'Tottenham', aliases: ['tottenham', 'spurs', 'tottenham hotspur'] },
    { name: 'Bayern Munich', aliases: ['bayern munich', 'bayern', 'bavarians'] },
    { name: 'Borussia Dortmund', aliases: ['borussia dortmund', 'dortmund', 'bvb'] },
    { name: 'Paris Saint-Germain', aliases: ['paris saint germain', 'psg', 'paris'] },
    { name: 'Juventus', aliases: ['juventus', 'juve', 'bianconeri', 'the old lady'] },
    { name: 'AC Milan', aliases: ['ac milan', 'milan', 'rossoneri'] },
    { name: 'Inter Milan', aliases: ['inter milan', 'inter', 'nerazzurri'] },
    { name: 'Atletico Madrid', aliases: ['atletico madrid', 'atletico', 'colchoneros'] },
    { name: 'Inter Miami', aliases: ['inter miami', 'miami'] },
    { name: 'Al Nassr', aliases: ['al nassr', 'nassr'] },
    { name: 'Al Hilal', aliases: ['al hilal', 'hilal'] },
    { name: 'Santos', aliases: ['santos'] },
    { name: 'Boca Juniors', aliases: ['boca juniors', 'boca'] },
    { name: 'Roma', aliases: ['roma', 'as roma'] },
    { name: 'Napoli', aliases: ['napoli', 'partenopei'] },
    { name: 'Bayer Leverkusen', aliases: ['bayer leverkusen', 'leverkusen'] },
    { name: 'Aston Villa', aliases: ['aston villa', 'villa'] },
    { name: 'Galatasaray', aliases: ['galatasaray', 'cimbom'] },
    { name: 'West Ham', aliases: ['west ham', 'west ham united', 'hammers'] },
    { name: 'Leicester City', aliases: ['leicester', 'leicester city', 'foxes'] },
    { name: 'Ajax', aliases: ['ajax', 'afc ajax'] },
    { name: 'Al-Ittihad', aliases: ['al-ittihad', 'al ittihad', 'ittihad'] },
  ];

  for (const cl of clubs) {
    if (cl.aliases.some((alias) => query.includes(alias))) {
      const isCurrent = player.currentClub.toLowerCase().includes(cl.name.toLowerCase());
      const isPast = player.pastClubs.some(
        (pc) =>
          pc.toLowerCase().includes(cl.name.toLowerCase()) ||
          cl.aliases.some((a) => pc.toLowerCase().includes(a))
      );
      const hasPlayed = isCurrent || isPast;

      if (query.includes('current') || query.includes('now') || query.includes('currently')) {
        return {
          type: isCurrent ? 'yes' : 'no',
          badge: isCurrent ? 'YES ✅' : 'NO ❌',
          response: isCurrent
            ? `Yes! He currently plays for ${cl.name}.`
            : `No, he does not currently play for ${cl.name}.`,
          isGuess: false,
        };
      }

      return {
        type: hasPlayed ? 'yes' : 'no',
        badge: hasPlayed ? 'YES ✅' : 'NO ❌',
        response: hasPlayed
          ? `Yes! He has played for ${cl.name}${isCurrent ? ' (in fact, he currently plays there!)' : ''}.`
          : `No, he has never played for ${cl.name}.`,
        isGuess: false,
      };
    }
  }

  // 9. Footedness
  if (query.includes('left foot') || query.includes('left-foot') || query.includes('lefty')) {
    const isLeft = player.dominantFoot === 'Left' || player.dominantFoot === 'Both';
    return {
      type: isLeft ? 'yes' : 'no',
      badge: isLeft ? 'YES ✅' : 'NO ❌',
      response: isLeft
        ? `Yes! His dominant foot is ${player.dominantFoot}.`
        : `No, he is right-footed.`,
      isGuess: false,
    };
  }

  if (query.includes('right foot') || query.includes('right-foot')) {
    const isRight = player.dominantFoot === 'Right' || player.dominantFoot === 'Both';
    return {
      type: isRight ? 'yes' : 'no',
      badge: isRight ? 'YES ✅' : 'NO ❌',
      response: isRight
        ? `Yes! His dominant foot is ${player.dominantFoot}.`
        : `No, he is left-footed.`,
      isGuess: false,
    };
  }

  if (
    query.includes('two footed') ||
    query.includes('both foot') ||
    query.includes('both feet') ||
    query.includes('ambidextrous')
  ) {
    const isBoth = player.dominantFoot === 'Both';
    return {
      type: isBoth ? 'yes' : 'no',
      badge: isBoth ? 'YES ✅' : 'NO ❌',
      response: isBoth
        ? `Yes! He is renowned for being deadly with both feet!`
        : `No, his primary foot is his ${player.dominantFoot} foot.`,
      isGuess: false,
    };
  }

  // 10. Shirt Numbers
  const numberMatch = query.match(/number\s+(\d+)|#\s*(\d+)|shirt\s+(\d+)|jersey\s+(\d+)/);
  if (numberMatch) {
    const requestedNum = parseInt(numberMatch[1] || numberMatch[2] || numberMatch[3] || numberMatch[4], 10);
    const hasNum = player.shirtNumbers.includes(requestedNum);
    return {
      type: hasNum ? 'yes' : 'no',
      badge: hasNum ? 'YES ✅' : 'NO ❌',
      response: hasNum
        ? `Yes! He has famously worn the number ${requestedNum} jersey!`
        : `No, he is not known for wearing the number ${requestedNum}.`,
      isGuess: false,
    };
  }

  // 11. Captaincy
  if (query.includes('captain') || query.includes('armband') || query.includes('skipper')) {
    return {
      type: player.captain ? 'yes' : 'no',
      badge: player.captain ? 'YES ✅' : 'NO ❌',
      response: player.captain
        ? `Yes! He has worn the captain's armband for his club or national team.`
        : `No, he is not primarily known as a team captain.`,
      isGuess: false,
    };
  }

  // 12. Age & Generation
  const ageMatch = query.match(/(over|older than|under|younger than|above|below)\s+(\d{2})/);
  const currentYear = 2026;
  const playerAge = currentYear - player.birthYear;

  if (ageMatch) {
    const comparison = ageMatch[1];
    const targetAge = parseInt(ageMatch[2], 10);
    const isOver = comparison.includes('over') || comparison.includes('older') || comparison.includes('above');

    const result = isOver ? playerAge > targetAge : playerAge < targetAge;
    return {
      type: result ? 'yes' : 'no',
      badge: result ? 'YES ✅' : 'NO ❌',
      response: result
        ? `Yes! (He is ${playerAge} years old).`
        : `No! (He is ${playerAge} years old).`,
      isGuess: false,
    };
  }

  if (query.includes('in his 20s') || query.includes('twenties')) {
    const is20s = playerAge >= 20 && playerAge < 30;
    return {
      type: is20s ? 'yes' : 'no',
      badge: is20s ? 'YES ✅' : 'NO ❌',
      response: is20s ? `Yes, he is currently in his 20s.` : `No, he is not in his 20s.`,
      isGuess: false,
    };
  }

  if (query.includes('in his 30s') || query.includes('thirties')) {
    const is30s = playerAge >= 30 && playerAge < 40;
    return {
      type: is30s ? 'yes' : 'no',
      badge: is30s ? 'YES ✅' : 'NO ❌',
      response: is30s ? `Yes, he is currently in his 30s.` : `No, he is not in his 30s.`,
      isGuess: false,
    };
  }

  // 13. Height
  if (
    query.includes('tall') ||
    query.includes('over 6 feet') ||
    query.includes('over 185') ||
    query.includes('over 190')
  ) {
    const isTall = player.heightCm >= 185;
    return {
      type: isTall ? 'yes' : 'no',
      badge: isTall ? 'YES ✅' : 'NO ❌',
      response: isTall
        ? `Yes, he is tall (${player.heightCm} cm)!`
        : `No, he is around ${player.heightCm} cm.`,
      isGuess: false,
    };
  }

  if (query.includes('short') || query.includes('under 175') || query.includes('small')) {
    const isShort = player.heightCm < 175;
    return {
      type: isShort ? 'yes' : 'no',
      badge: isShort ? 'YES ✅' : 'NO ❌',
      response: isShort
        ? `Yes, he is relatively compact (${player.heightCm} cm)!`
        : `No, he stands at ${player.heightCm} cm.`,
      isGuess: false,
    };
  }

  // 14. Special Traits / Fun Facts / Keywords
  const traitChecks = [
    { keywords: ['dribble', 'dribbling', 'skill', 'skills', 'trick'], trait: 'dribbler', yesMsg: 'Yes! He is known for exceptional dribbling and skill moves.' },
    { keywords: ['free kick', 'freekick', 'set piece'], trait: 'free-kick', yesMsg: 'Yes! He is a master of direct free kicks.' },
    { keywords: ['penalty', 'penalties'], trait: 'penalty', yesMsg: 'Yes! He is a designated penalty specialist.' },
    { keywords: ['fast', 'speed', 'pace', 'quick'], trait: 'fast', yesMsg: 'Yes! He is celebrated for blistering speed and acceleration.' },
    { keywords: ['headbutt', 'materazzi'], trait: 'headbutt', yesMsg: 'Yes! One of the most infamous moments in World Cup history!' },
    { keywords: ['bite', 'biting'], trait: 'bite', yesMsg: 'Yes! That controversial World Cup incident is etched in football folklore.' },
    { keywords: ['hand of god', 'gods hand'], trait: 'hand of god', yesMsg: 'Yes! The famous Hand of God goal!' },
    { keywords: ['siu', 'siuu', 'siuuu'], trait: 'siuuu', yesMsg: 'Yes! SIUUUUUU! The most famous celebration in the world!' },
    { keywords: ['la masia'], trait: 'la masia', yesMsg: 'Yes! He graduated from Barcelona\'s famous La Masia academy!' },
    { keywords: ['treble'], trait: 'treble', yesMsg: 'Yes! He was an integral part of a historic Treble-winning squad!' },
    { keywords: ['bicycle kick', 'overhead kick'], trait: 'bicycle kick', yesMsg: 'Yes! He scored one of the greatest bicycle kicks in football history!' },
  ];

  for (const tc of traitChecks) {
    if (tc.keywords.some((k) => query.includes(k))) {
      const matches =
        player.traits.some((t) => tc.keywords.some((k) => t.includes(k))) ||
        player.funFacts.some((f) => tc.keywords.some((k) => f.toLowerCase().includes(k)));
      return {
        type: matches ? 'yes' : 'no',
        badge: matches ? 'YES ✅' : 'NO ❌',
        response: matches ? tc.yesMsg : `No, that is not a defining characteristic of this footballer.`,
        isGuess: false,
      };
    }
  }

  // 15. Intelligent Fallback / Guidance
  return {
    type: 'unclear',
    badge: 'UNCLEAR 🤔',
    response:
      "I'm not quite sure how to answer that with a direct Yes or No! Try asking about his position (e.g. striker/midfielder), nationality, whether he is active or retired, his clubs, trophies (World Cup, UCL, Ballon d'Or), or make a guess with a name!",
    isGuess: false,
  };
}
