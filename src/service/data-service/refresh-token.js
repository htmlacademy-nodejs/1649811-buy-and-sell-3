'use strict';


class RefreshTokenService {
  constructor(sequelize) {
    this._RefreshToken = sequelize.models.RefreshToken;
  }

  async create(refreshToken) {
    try {
      await this._RefreshToken.create({token: refreshToken});
      return true;
    } catch (err) {
      return false;
    }
  }

  async find(refreshToken) {
    return await this._RefreshToken.findOne({
      where: {
        token: refreshToken,
      },
    });
  }

  async drop(refreshToken) {
    try {
      const token = await this.find(refreshToken);
      token.destroy();
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = RefreshTokenService;
