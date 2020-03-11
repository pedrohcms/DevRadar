const { Router } = require("express");
const DevController = require("./controllers/DevController");
const SearchController = require("./controllers/SearchController");

const routes = Router();

// Métodos HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:

// Query Params: request.query (Usados para filtros, ordenação, paginação, ...)
// Route Params: request.params (Usado para identificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);
routes.put("/devs/:id", DevController.update);
routes.delete("/devs/:id", DevController.destroy);

routes.get("/search", SearchController.index);

module.exports = routes;
