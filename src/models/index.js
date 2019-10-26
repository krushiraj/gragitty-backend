import Sequelize from 'sequelize'
import { development, production } from '../config/config'

//import all models here
import user from './user'

const dbconfig = !!process.env.PRODUCTION ? production : development

let sequelize;

if(process.env.DATABASE_URL) {
  console.log(
    {
      DB_URL: process.env.DATABASE_URL,
      dialect: dbconfig.dialect
    }
  )
  sequelize = new Sequelize(
    process.env.DATABASE_URL,
    { dialect: dbconfig.dialect }
  );
} else {
  sequelize = new Sequelize(dbconfig)
}

const models = {
  User: user(sequelize, Sequelize.DataTypes),
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export { sequelize }

export default models
