import bcrypt from 'bcrypt'
import { id } from './utils'

const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: id(DataTypes),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    gitProfile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1"
    }
  });

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { email: login }
    })

    return user
  }

  return User
}

export default user
