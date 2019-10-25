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
    dialect: "sqlite",
    storage: "./database.sqlite3"
  }
}
