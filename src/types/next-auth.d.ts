import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      subscription: {
        plan: 'Free' | 'Starter' | 'Pro' | 'Power' | 'Ultra';
        startDate?: Date;
        endDate?: Date;
      };
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    subscription: {
      plan: 'Free' | 'Starter' | 'Pro' | 'Power' | 'Ultra';
      startDate?: Date;
      endDate?: Date;
    };
  }
}
