require("dotenv").config({ path: ".env" });
const { Publication } = require("_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Publication.findAll();
}

async function getById(id) {
  return await getPublication(id);
}

async function create(req) {
  var params = {
    ...req.body,
    userId: req.user.id,
  };
  await Publication.create(params);
}

async function update(id, req) {
  const publication = await getPublication(id);

  //validate
  if (publication.userId !== req.user.id) {
    throw "Usuário não autorizado";
  }

  Object.assign(publication, req.body);

  await publication.save();

  return publication;
}

async function _delete(id) {
  const publication = await getPublication(id);

  //validate
  if (publication.userId !== req.user.id) {
    throw "Usuário não autorizado";
  }

  await publication.destroy();
}

// helper functions

async function getPublication(id) {
  const publication = await Publication.findByPk(id);
  if (!publication) throw "Publicação não encontrada";
  return publication;
}
