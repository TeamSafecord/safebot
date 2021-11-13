import {
    ApplicationCommandOptionData,
    Client,
    CommandInteraction,
    MessageEmbed,
} from 'discord.js'
import CommandHandler from './CommandHandler'

export default class SlashCommand {
    constructor(
        public name: string,
        public description: string,
        public opts?: ApplicationCommandOptionData[]
    ) {}

    public client: Client
    public handler: CommandHandler
    public embed = new MessageEmbed()
        .setColor('#23272A')
        .setTimestamp()
        .setFooter('Safecord', 'https://www.eviebot.rocks/assets/EvieIcon.png') // replace with actual image when frontend is ready

    public exec(i: CommandInteraction) {}
}
