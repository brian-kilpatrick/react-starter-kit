// 'use strict';
// module.exports = function(sequelize, DataTypes) {
//   var User = sequelize.define('User', {
//     email: DataTypes.STRING,
//     name: DataTypes.STRING
//   });
//   return User;
// };

import DataType from 'sequelize';
import Model from '../sequelize';
import bcrypt from 'bcrypt';
import { logger } from '../../utils';

const User = Model.define('User', {
  email: {
    type: DataType.STRING(255),
    unique: true,
    validate: { isEmail: true },
  },
  firstName: {
    type: DataType.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataType.STRING,
    allowNull: false,
  },
  password: {
    type: DataType.STRING,
    allowNull: false,
  },

}, {
  instanceMethods: {
    isValidPassword(password) {
      return bcrypt.compare(password, this.password).then(isValid => isValid);
    }
  }
  // indexes: [
  //   { fields: ['email'] },
  // ],

});

// hash
User.beforeCreate((user, opts) => {
  if (!user.password) throw new Error('Password Cannot Be Blank');
  return bcrypt.hash(user.password, 5).then(hash => user.password = hash)
});

export default User;
