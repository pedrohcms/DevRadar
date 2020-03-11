const axios = require("axios");
const Dev = require("../models/Dev");
const parseStrigAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

// index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      let { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStrigAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      // Filtrar as conexões que estão no máximo 10 km de distância
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return response.json(dev);
  },

  async update(request, response) {
    //Salvar apenas: name, avatar_url, bio, localização e techs

    const { name, avatar_url, bio, latitude, longitude, techs } = request.body;

    const techsArray = parseStrigAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev = await Dev.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          name,
          bio,
          avatar_url,
          techs: techsArray,
          location
        }
      },
      {
        new: true
      }
    );

    return response.json(dev);
  },

  async destroy(request, response) {
    await Dev.findByIdAndRemove(request.params.id);

    return response.json({ status: 200 });
  }
};
