export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 8080,
  enable: {
    swagger: process.env.SHOW_SWAGGER === 'true',
    runFakeTask: process.env.RUN_FAKE_TASK === 'true'
  },
  database: {
    uri: process.env.MONGO_DB_CONNECTION,
    database: process.env.MONGO_DATABASE
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  openAI: {
    apiKey: process.env.OPENAI_API_KEY,
    organizationId: process.env.OPENAI_ORGANISATION_ID
  }
});
