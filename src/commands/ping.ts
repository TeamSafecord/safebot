import { CommandInteraction } from 'discord.js'
import SlashCommand from '../SlashCommand'

export default class PingCommand extends SlashCommand {
    constructor() {
        super('ping', 'Sends pong!')
    }

    public exec(i: CommandInteraction) {
        i.reply('pong')
    }
}
