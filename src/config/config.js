module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./database-dev.sqlite3"
  },
  test: {
    dialect: "sqlite",
    storage: ":memory"
  },
  production: {
    use_env_variable: "DB_URL",
    dialect: "postgres"
  }
};
