import {ApplicationCommandData, Client, Team} from "discord.js";
import CommandHandler from "./CommandHandler";
import SlashCommand from "./SlashCommand";
import {setupServer} from "./server";

import {config} from "dotenv";
config();

export const client = new Client({intents: ["GUILD_MESSAGES", "GUILDS"]});

let cmds: SlashCommand[];

client.on("ready", () => {
  console.log(`${client.user.tag} logged in!`);

  const cmd = new CommandHandler(client);
  cmd.init("./commands/");

  cmds = cmd.commands.map((c) => c);

  setupServer(1337);
});

client.on("messageCreate", async (m) => {
  if (!client.application.owner) await client.application.fetch();
  const owner = client.application.owner;

  const regex = new RegExp(`^<@!?${client.user.id}> deploy`);

  if (owner instanceof Team) {
    if (!owner.members.has(m.author.id) || !regex.test(m.content)) return;
  } else {
    if (owner.id !== m.id || m.content !== `<@${client.user.id}> deploy`) {
      return;
    }
  }

  const opts: ApplicationCommandData[] = [];

  for (const cmd of cmds) {
    if (cmd.opts) {
      opts.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.opts,
      });
    } else {
      opts.push({name: cmd.name, description: cmd.description});
    }
  }
  if (m.content.endsWith("prod")) {
    client.application.commands.set(opts);

    m.reply("Deployed globally!");
  } else if (m.content.endsWith("dev")) {
    m.guild.commands.set(opts);

    m.reply("Deployed locally!");
  }
});

client.login();
