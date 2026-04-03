import type { Book, Recommendation, Student, SchoolMetric, WeeklyTrend, LibrarianAction } from './types';

import coverScythe from '@/assets/covers/scythe.jpg';
import coverGiver from '@/assets/covers/the-giver.jpg';
import coverBloodBone from '@/assets/covers/children-blood-bone.jpg';
import coverPercy from '@/assets/covers/percy-jackson.jpg';
import coverAmal from '@/assets/covers/amal-unbound.jpg';
import coverWrinkle from '@/assets/covers/wrinkle-in-time.jpg';

export const books: Book[] = [
  {
    id: 'b1',
    title: 'Scythe',
    author: 'Neal Shusterman',
    coverImage: coverScythe,
    genre: 'Dystopian',
    gradeBand: '6-8',
    series: 'Arc of a Scythe',
    description: 'In a world where death has been conquered, scythes are the only ones who can end life.',
    available: true,
    copiesAvailable: 3,
    totalCopies: 5,
  },
  {
    id: 'b2',
    title: 'The Giver',
    author: 'Lois Lowry',
    coverImage: coverGiver,
    genre: 'Dystopian',
    gradeBand: '6-8',
    description: 'Jonas lives in a seemingly perfect community without pain, suffering, or choice.',
    available: true,
    copiesAvailable: 1,
    totalCopies: 4,
  },
  {
    id: 'b3',
    title: 'Children of Blood and Bone',
    author: 'Tomi Adeyemi',
    coverImage: coverBloodBone,
    genre: 'Fantasy',
    gradeBand: '6-8',
    series: 'Legacy of Orïsha',
    description: 'Zélie must fight to bring magic back to the land of Orïsha.',
    available: true,
    copiesAvailable: 2,
    totalCopies: 3,
  },
  {
    id: 'b4',
    title: 'The Lightning Thief',
    author: 'Rick Riordan',
    coverImage: coverPercy,
    genre: 'Mythology / Adventure',
    gradeBand: '6-8',
    series: 'Percy Jackson',
    description: 'Percy Jackson discovers he is a demigod and must prevent a war among the gods.',
    available: true,
    copiesAvailable: 4,
    totalCopies: 6,
  },
  {
    id: 'b5',
    title: 'Amal Unbound',
    author: 'Aisha Saeed',
    coverImage: coverAmal,
    genre: 'Realistic Fiction',
    gradeBand: '6-8',
    description: 'Amal dreams of being a teacher, but her life takes a sharp turn when she stands up to a powerful landlord.',
    available: false,
    copiesAvailable: 0,
    totalCopies: 2,
  },
  {
    id: 'b6',
    title: 'A Wrinkle in Time',
    author: "Madeleine L'Engle",
    coverImage: coverWrinkle,
    genre: 'Science Fiction',
    gradeBand: '6-8',
    description: 'Meg Murry and friends travel through space and time to rescue her father from evil forces.',
    available: true,
    copiesAvailable: 2,
    totalCopies: 3,
  },
];

const makeRec = (
  id: string,
  book: Book,
  explanation: string,
  signals: Recommendation['signals'],
  confidence: number,
  status: Recommendation['status'],
  position: number,
  becauseYouLiked?: string[],
): Recommendation => ({
  id, book, explanation, signals, confidence, status, position, becauseYouLiked,
});

export const students: Student[] = [
  {
    id: 's1',
    name: 'Jaylen Carter',
    grade: 7,
    homeroom: '7-A',
    school: 'Haynes Bridge MS',
    checkoutCount: 14,
    recommendations: [
      makeRec('r1', books[0], 'Because you checked out The Giver and other students who liked thoughtful dystopian stories also borrowed Scythe, you may enjoy this next.', ['collaborative', 'content'], 0.92, 'approved', 1, ['The Giver', 'Fahrenheit 451']),
      makeRec('r2', books[2], 'Students who read adventure and dystopian fiction at your school frequently also enjoy this West African–inspired fantasy.', ['collaborative', 'popularity'], 0.85, 'auto-published', 2),
      makeRec('r3', books[5], 'This science-fiction classic shares themes of courage and self-discovery with books you have enjoyed.', ['content'], 0.78, 'auto-published', 3, ['The Giver']),
      makeRec('r4', books[3], 'The next book in a mythology series that students with similar tastes have loved.', ['collaborative', 'series'], 0.74, 'pending', 4),
      makeRec('r5', books[4], 'A realistic fiction title about standing up for what you believe — a new direction based on themes you gravitate toward.', ['content'], 0.61, 'pending', 5),
    ],
  },
  {
    id: 's2',
    name: 'Mia Thompson',
    grade: 6,
    homeroom: '6-B',
    school: 'Haynes Bridge MS',
    checkoutCount: 4,
    recommendations: [
      makeRec('r6', books[3], 'This is one of the most popular adventure series among 6th graders at your school.', ['popularity'], 0.88, 'approved', 1),
      makeRec('r7', books[2], 'A fantasy adventure with a strong heroine — a great next step from mythology.', ['content', 'popularity'], 0.72, 'auto-published', 2),
      makeRec('r8', books[5], 'Students who start with adventure often enjoy this classic blend of science fiction and heart.', ['collaborative'], 0.65, 'pending', 3),
    ],
  },
  {
    id: 's3',
    name: 'David Okonkwo',
    grade: 8,
    homeroom: '8-C',
    school: 'River Trail MS',
    checkoutCount: 22,
    recommendations: [
      makeRec('r9', books[0], 'Your borrowing history shows a strong pattern of dystopian and speculative fiction. Scythe is the top match.', ['collaborative', 'content'], 0.95, 'pinned', 1, ['The Giver', 'Hunger Games', 'Divergent']),
      makeRec('r10', books[4], 'A departure from your usual genres — realistic fiction that explores determination and justice.', ['content'], 0.58, 'pending', 2),
      makeRec('r11', books[2], 'Fantasy with deep world-building, recommended by students with overlapping taste profiles.', ['collaborative'], 0.82, 'approved', 3),
      makeRec('r12', books[5], 'A classic that connects science fiction themes with the emotional core of the dystopian books you love.', ['content', 'series'], 0.76, 'auto-published', 4),
    ],
  },
  {
    id: 's4',
    name: 'Sofia Ramirez',
    grade: 7,
    homeroom: '7-A',
    school: 'Haynes Bridge MS',
    checkoutCount: 8,
    recommendations: [
      makeRec('r13', books[4], 'Based on your interest in realistic fiction with strong female leads.', ['content'], 0.84, 'approved', 1, ['Brown Girl Dreaming']),
      makeRec('r14', books[2], 'Students who read realistic fiction and fantasy equally often enjoy this title.', ['collaborative'], 0.79, 'auto-published', 2),
      makeRec('r15', books[1], 'A thought-provoking classic that connects to themes of choice and freedom in your reading history.', ['content', 'popularity'], 0.73, 'pending', 3),
    ],
  },
];

export const schoolMetrics: SchoolMetric[] = [
  { school: 'Haynes Bridge MS', preBaselineCheckouts: 2.1, currentCheckouts: 2.6, liftPercent: 23.8, studentsReached: 312, totalStudents: 420, approvalRate: 78, overrideRate: 12 },
  { school: 'River Trail MS', preBaselineCheckouts: 1.8, currentCheckouts: 2.3, liftPercent: 27.8, studentsReached: 289, totalStudents: 395, approvalRate: 82, overrideRate: 8 },
  { school: 'Elkins Pointe MS', preBaselineCheckouts: 2.4, currentCheckouts: 2.7, liftPercent: 12.5, studentsReached: 198, totalStudents: 380, approvalRate: 71, overrideRate: 15 },
  { school: 'Hopewell MS', preBaselineCheckouts: 1.5, currentCheckouts: 1.9, liftPercent: 26.7, studentsReached: 245, totalStudents: 410, approvalRate: 85, overrideRate: 6 },
  { school: 'Northwestern MS', preBaselineCheckouts: 2.0, currentCheckouts: 2.2, liftPercent: 10.0, studentsReached: 156, totalStudents: 365, approvalRate: 68, overrideRate: 18 },
];

export const weeklyTrends: WeeklyTrend[] = [
  { week: 'Wk 1', checkoutsPerStudent: 1.9, baseline: 2.0, recommendationsGenerated: 1200, recommendationsExposed: 420 },
  { week: 'Wk 2', checkoutsPerStudent: 2.0, baseline: 2.0, recommendationsGenerated: 1350, recommendationsExposed: 680 },
  { week: 'Wk 3', checkoutsPerStudent: 2.2, baseline: 1.9, recommendationsGenerated: 1400, recommendationsExposed: 890 },
  { week: 'Wk 4', checkoutsPerStudent: 2.1, baseline: 1.9, recommendationsGenerated: 1420, recommendationsExposed: 940 },
  { week: 'Wk 5', checkoutsPerStudent: 2.4, baseline: 2.0, recommendationsGenerated: 1450, recommendationsExposed: 1020 },
  { week: 'Wk 6', checkoutsPerStudent: 2.3, baseline: 1.9, recommendationsGenerated: 1480, recommendationsExposed: 1100 },
  { week: 'Wk 7', checkoutsPerStudent: 2.5, baseline: 2.0, recommendationsGenerated: 1500, recommendationsExposed: 1180 },
  { week: 'Wk 8', checkoutsPerStudent: 2.6, baseline: 2.0, recommendationsGenerated: 1520, recommendationsExposed: 1250 },
];

export const recentActions: LibrarianAction[] = [
  { id: 'a1', librarianName: 'Ms. Patterson', studentId: 's1', recommendationId: 'r1', action: 'approved', timestamp: '2026-04-02 08:15' },
  { id: 'a2', librarianName: 'Ms. Patterson', studentId: 's3', recommendationId: 'r9', action: 'pinned', timestamp: '2026-04-02 08:22', note: 'Student expressed strong interest in dystopian series' },
  { id: 'a3', librarianName: 'Mr. Chen', studentId: 's2', recommendationId: 'r6', action: 'approved', timestamp: '2026-04-01 14:30' },
  { id: 'a4', librarianName: 'Ms. Patterson', studentId: 's4', recommendationId: 'r13', action: 'approved', timestamp: '2026-04-01 09:45' },
  { id: 'a5', librarianName: 'Mr. Chen', studentId: 's1', recommendationId: 'r4', action: 'replaced', timestamp: '2026-03-31 15:10', note: 'Replaced with Maze Runner — better series fit' },
];
