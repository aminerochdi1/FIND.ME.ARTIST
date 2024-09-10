'use strict';

const models = require("../config/models.json")
import mysql2 from 'mysql2';
const dirname = models.path;
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = 'index.js';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize;

if (options.dialect === 'mysql') {
  options.dialectModule = mysql2;
}
new Sequelize(options)

// sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     dialect: 'mysql',
//     dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT
//   }
// )

export async function connectToDatabase() {
  console.log('Trying to connect via sequelize')
  await sequelize.sync()
  await sequelize.authenticate()
  console.log('=> Created a new connection.')

};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require("./"+file)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
