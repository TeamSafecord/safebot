import { Client } from "discord.js";

require("dotenv").config({ path: "../.env" });

const client = new Client({ intents: [] });

client.on("ready", () => {
    console.log(`${client.user.tag} logged in!`)
})

client.login();