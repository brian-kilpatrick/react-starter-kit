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

const User = Model.define('User', {
  email: {
    type: DataType.STRING(255),
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

}, {

  // indexes: [
  //   { fields: ['email'] },
  // ],

});

export default User;
