require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("_middleware/error-handler");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use("/users", require("./users/users.controller"));
app.use("/publications", require("./publications/publications.controller"));

// global error handler
app.use(errorHandler);

// start server
const port = 4000;
app.listen(port, () => console.log("Server listening on port " + port));
