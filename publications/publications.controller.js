﻿const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const publicationService = require("./publication.service");

// routes
router.post("/create", authorize(), createSchema, create);
router.get("/", authorize(), getAll);
router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  publicationService
    .create(req)
    .then(() => res.json({ message: "Cadastro realizado com sucesso" }))
    .catch(next);
}

function getAll(req, res, next) {
  publicationService
    .getAll()
    .then((publications) => res.json(publications))
    .catch(next);
}

function getById(req, res, next) {
  publicationService
    .getById(req.params.id)
    .then((publication) => res.json(publication))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  publicationService
    .update(req.params.id, req)
    .then((publication) => res.json(publication))
    .catch(next);
}

function _delete(req, res, next) {
  publicationService
    .delete(req.params.id)
    .then(() => res.json({ message: "Publicação deletada com sucesso" }))
    .catch(next);
}