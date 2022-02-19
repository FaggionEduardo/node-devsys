require("dotenv").config({ path: ".env" });
const { Publication, User } = require("_helpers/db");

module.exports = {
  getAll,
  getAllByUser,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Publication.findAll({
    include: {
      model: User,
      required: true,
    },
  });
}

async function getAllByUser(user_id) {
  return await Publication.findAll({ where: { userId: user_id } });
}

async function getById(id) {
  return await getPublication(id);
}

async function create(req) {
  var params = {
    ...req.body,
    image: req.file.filename,
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

  Object.assign(publication, {
    ...req.body,
    image: req.file ? req.file.filename : publication.image,
  });

  await publication.save();

  return publication;
}

async function _delete(req) {
  const publication = await getPublication(req.params.id);

  //validate
  if (publication.userId !== req.user.id) {
    throw "Usuário não autorizado";
  }

  await publication.destroy();
}

// helper functions

async function getPublication(id) {
  const publication = await Publication.findOne({
    where: { id },
    include: {
      model: User,
      required: true,
    },
  });
  if (!publication) throw "Publicação não encontrada";
  return publication;
}
