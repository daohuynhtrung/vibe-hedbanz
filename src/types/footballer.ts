export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export type SubPosition =
  | 'Striker'
  | 'Winger'
  | 'Attacking Midfielder'
  | 'Central Midfielder'
  | 'Defensive Midfielder'
  | 'Center Back'
  | 'Full Back'
  | 'Goalkeeper';

export type Continent =
  | 'Europe'
  | 'South America'
  | 'Africa'
  | 'Asia'
  | 'North America';

export interface Footballer {
  id: string;
  name: string;
  aliases: string[];
  nationality: string;
  countryCode: string; // ISO 2 code (e.g. "AR", "PT", "FR")
  continent: Continent;
  position: Position;
  subPositions: SubPosition[];
  dominantFoot: 'Left' | 'Right' | 'Both';
  isActive: boolean;
  birthYear: number;
  currentClub: string; // e.g. "Inter Miami", "Al Nassr", "Real Madrid", "Retired"
  currentLeague: string; // e.g. "MLS", "Saudi Pro League", "La Liga", "Premier League", "Retired"
  pastClubs: string[];
  leagues: string[];
  trophies: {
    worldCup: boolean;
    worldCupCount?: number;
    championsLeague: boolean;
    championsLeagueCount?: number;
    ballonDor: boolean;
    ballonDorCount?: number;
    euroOrCopaAmerica: boolean;
    premierLeague: boolean;
    laLiga: boolean;
    serieA: boolean;
    bundesliga: boolean;
    ligue1: boolean;
  };
  shirtNumbers: number[];
  heightCm: number;
  captain: boolean; // captained club or national team
  traits: string[];
  funFacts: string[];
  rating?: number; // FIFA style rating (e.g. 91)
  cardColor?: string; // Hex or gradient
  avatarUrl?: string; // Optional image url
}

export type AnswerType = 'yes' | 'no' | 'partially' | 'correct_guess' | 'wrong_guess' | 'unclear';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  answerType?: AnswerType;
  timestamp: number;
  highlightedPlayer?: string;
  isGuess?: boolean;
}

export type GameStatus = 'playing' | 'won' | 'given_up';

export type Difficulty = 'easy' | 'medium' | 'hard';
