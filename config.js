module.exports = {
  postgres: {
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432
  }
}
