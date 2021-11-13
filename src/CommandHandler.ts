import { Client, Collection } from "discord.js";
import * as fs from "fs";
import path from "path";
import SlashCommand from "./SlashCommand";

export default class CommandHandler {
  constructor(public client: Client) {}

  public commands = new Collection<string, SlashCommand>();

  public init(input: string) {
    const filePaths = CommandHandler.readdirRecursive(input);

    for (const filePath of filePaths) {
      const file = require(path.resolve(filePath));

      const command: SlashCommand = new file.default();
      command.client = this.client;
      command.handler = this;

      this.commands.set(command.name, command);
    }

    this.setup();
  }

  public setup() {
    this.client.on("interactionCreate", (i) => {
      if (i.isCommand()) {
        const cmd = this.commands.get(i.commandName);
        if (!cmd)
          throw new Error(`Unregistered command (${i.commandName}) found!`);
        cmd.exec(i);
      }
    });
  }

  private static readdirRecursive(directory: string): string[] {
    const result = [];

    (function read(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filepath = path.join(dir, file);

        if (fs.statSync(filepath).isDirectory()) {
          read(filepath);
        } else {
          result.push(filepath);
        }
      }
    })(directory);

    return result;
  }
}
