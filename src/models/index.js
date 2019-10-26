import Sequelize from 'sequelize'
import { development, production } from '../config/config'

//import all models here
import user from './user'
import task from './task'

const dbconfig = !!process.env.PRODUCTION ? production : development

let sequelize;

if(process.env.DATABASE_URL) {
  sequelize = new Sequelize(
    process.env.DATABASE_URL,
    { dialect: dbconfig.dialect }
  );
} else {
  sequelize = new Sequelize(dbconfig)
}

const models = {
  User: user(sequelize, Sequelize.DataTypes),
  Task: task(sequelize, Sequelize.DataTypes)
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export { sequelize }

export default models
