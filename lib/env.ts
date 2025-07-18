import dotenv from 'dotenv';
dotenv.config();

const env = {
  databaseUrl: process.env.DATABASE_URL!,
  betterAuth: {
    url: process.env.BETTER_AUTH_URL!,
    secret: process.env.BETTER_AUTH_SECRET!
  },
  resendApiKey: process.env.RESEND_API_KEY!,
  hfApiKey: process.env.HF_API_KEY!,
  groqApiKey: process.env.GROQ_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,

  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
};

export default env;
