export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    url: process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
});
