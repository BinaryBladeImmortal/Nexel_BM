export interface User {
  id: string;
  email: string;
  username?: string;
  profileImage?: string;
  xp: number;
  rank: number;
  subscription?: {
    plan: string;
    status: string;
    endDate?: string;
  };
  createdAt: string;
  nextAhead?: {
    name: string;
    xp: number;
  };
}