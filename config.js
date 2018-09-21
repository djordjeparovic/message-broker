
module.exports = {
  mbroker: {
    db: {
      host: process.env.PGHOST || 'pg',
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || 'mbroker_user',
      database: process.env.PGDATABASE || 'mbroker',
      password: process.env.PGPASSWORD || 'bWJyb2tlcl91c2VyCg==',
    },
  },
  restify: {
    port: process.env.APP_PORT || 8080,
    name: process.env.APP_NAME || 'mbroker-rest',
    strictNext: true,
  },
};
