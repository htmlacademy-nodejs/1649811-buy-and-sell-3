'use strict';

const bcrypt = require(`bcrypt`);
const SALT_ROUNDS = 6;

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const {password} = userData;

    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      userData.password = await bcrypt.hash(password, salt);
      await this._User.create(userData);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  async findByEmail(email) {
    return this._User.findOne({
      where: {email},
      raw: true,
    });
  }

  async checkAuth(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

module.exports = UserService;
