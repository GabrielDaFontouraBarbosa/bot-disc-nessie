// index.js
import 'dotenv/config';
import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// logs de erro (ajudam a debugar)
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
client.on('error', console.error);

client.once(Events.ClientReady, (c) => {
  console.log(`Logado como ${c.user.tag}`);
  c.user.setPresence({
    activities: [{ name: 'diga /status', type: ActivityType.Playing }],
    status: 'online'
  });
});

client.login(process.env.DISCORD_TOKEN);

