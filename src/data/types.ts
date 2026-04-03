export type RecommendationStatus = 'approved' | 'pinned' | 'suppressed' | 'pending' | 'auto-published';

export type RecommendationSignal = 'collaborative' | 'content' | 'popularity' | 'series';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  genre: string;
  gradeBand: string;
  series?: string;
  description: string;
  available: boolean;
  copiesAvailable: number;
  totalCopies: number;
}

export interface Recommendation {
  id: string;
  book: Book;
  explanation: string;
  signals: RecommendationSignal[];
  confidence: number;
  status: RecommendationStatus;
  becauseYouLiked?: string[];
  position: number;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  homeroom: string;
  school: string;
  checkoutCount: number;
  recommendations: Recommendation[];
}

export interface LibrarianAction {
  id: string;
  librarianName: string;
  studentId: string;
  recommendationId: string;
  action: 'approved' | 'replaced' | 'pinned' | 'suppressed';
  timestamp: string;
  note?: string;
}

export interface SchoolMetric {
  school: string;
  preBaselineCheckouts: number;
  currentCheckouts: number;
  liftPercent: number;
  studentsReached: number;
  totalStudents: number;
  approvalRate: number;
  overrideRate: number;
}

export interface WeeklyTrend {
  week: string;
  checkoutsPerStudent: number;
  baseline: number;
  recommendationsGenerated: number;
  recommendationsExposed: number;
}
