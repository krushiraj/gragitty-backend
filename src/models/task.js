import { id } from "./utils";

const COMMIT = 'COMMIT',
  RAISEPR = 'RAISEPR',
  ISSUE = 'ISSUE',
  MERGEPR = 'MERGEPR',
  REVIEW = 'REVIEW',
  EMPTY = "EMPTY",
  GREEN1 = "GREEN1",
  GREEN2 = "GREEN2",
  GREEN3 = "GREEN3",
  GREEN4 = "GREEN4"

const task = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    id: id(DataTypes),
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      defaultValue: "painting my GitHub contribution calendar"
    },
    color: {
      type: DataTypes.ENUM(
        EMPTY, GREEN1, GREEN2,
        GREEN3, GREEN4
      ),
      allowNull: false,
      validate: {
        notEmpty: true
      },
      defaultValue: EMPTY
    },
    date: {
      type: DataTypes.STRING,
      unique: 'unique_task',
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    type: {
      type: DataTypes.ENUM(
        COMMIT, RAISEPR, MERGEPR,
        ISSUE, REVIEW
      ),
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: 'unique_task',
      defaultValue: COMMIT
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.UUID,
      unique: 'unique_task',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  Task.associate = models => {
    Task.belongsTo(models.User, {
      onDelete: "CASCADE",
      constraints: true,
      foreignKey: 'userId'
    });
  }

  return Task;
};

export default task;
