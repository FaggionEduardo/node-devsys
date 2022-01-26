const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });
const bcrypt = require("bcryptjs");
const { User } = require("_helpers/db");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
};

async function authenticate({ username, password }) {
  const user = await User.scope("withHash").findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash)))
    throw "Usuário ou senha está incorreto";

  // authentication successful
  const token = jwt.sign({ sub: user.id }, process.env.AUTH_SECRET, {
    expiresIn: "7d",
  });
  return { ...omitHash(user.get()), token };
}

async function getAll() {
  return await User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await User.findOne({ where: { username: params.username } })) {
    throw 'Usuário "' + params.username + '" já está sendo usado';
  }

  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  await User.create(params);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Usuário "' + params.username + '" já está sendo usado';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

// helper functions

async function getUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw "Usuário não encontrado";
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
