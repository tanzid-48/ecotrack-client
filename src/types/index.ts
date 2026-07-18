export interface Challenge {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "energy" | "transport" | "food" | "waste" | "water";
  difficulty: "easy" | "medium" | "hard";
  impactScore: number;
  imageUrl?: string;
  createdBy: string;
  participantsCount: number;
  rating: number;
  createdAt: string;
}

export interface Activity {
  _id: string;
  userId: string;
  date: string;
  commuteType: "car" | "bus" | "bike" | "walk" | "train" | "motorbike";
  commuteDistanceKm: number;
  electricityUsageKwh: number;
  dietType: "vegan" | "vegetarian" | "mixed" | "heavy-meat";
  wasteKg: number;
  carbonFootprintKg: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  challengeId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaginatedChallenges {
  items: Challenge[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FootprintAnalysis {
  totalFootprintKg: number;
  averageDailyKg: number;
  trend: "increasing" | "decreasing" | "stable";
  biggestContributor: "commute" | "electricity" | "diet" | "waste";
  summary: string;
  insights: string[];
}

export interface Recommendations {
  personalizedTips: string[];
  recommendedChallengeIds: string[];
  reasoning: string;
}
