const { User } = require("../models");

class UserController {
  async store(req, res) {
    const user = await User.create({
      name: "alfiado",
      email: "alfiado@ngana.com",
      password_hash: "123456"
    });
    return res.json({ user });
  }
}

module.exports = new UserController();
