const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const routes = require("./routes");
const { setupWebsocket } = require("./websocket");

const app = express();
const server = http.Server(app); // O servidor http foi extraido do express

setupWebsocket(server);

// Conectando com o MongoDB Atlas
mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-iej14.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333); //trocamos de app para server
