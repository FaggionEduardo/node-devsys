require("dotenv").config({ path: ".env" });
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = models();

function models() {
  // connect to db
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    { dialect: "mysql", logging: console.log }
  );

  const models = {};
  const modules = [
    require("../publications/publication.model"),
    require("../users/user.model"),
  ];

  modules.forEach((module) => {
    const model = module(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) models[modelName].associate(models);
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  initialize(sequelize);

  return models;
}

async function initialize(sequelize) {
  // create db if it doesn't already exist
  const connection = await mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
  );
  // sync all models with database
  await sequelize.sync();
}
