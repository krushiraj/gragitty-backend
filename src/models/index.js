import Sequelize from 'sequelize'
import { development, production } from '../config/config'

//import all models here
import user from './user'

const dbconfig = process.env.PRODUCTION ? production : development

let sequelize = new Sequelize({
  storage: dbconfig.storage,
  dialect: dbconfig.dialect
});


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
