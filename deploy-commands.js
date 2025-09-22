// deploy-commands.js
import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'dd',
    description: 'HUD do Dungeon Defenders',
    options: [
      {
        type: 1, // SUB_COMMAND
        name: 'set',
        description: 'Atualiza presença e card do DD',
        options: [
          { type: 3, name: 'mapa', description: 'Nome do mapa', required: true },
          { type: 3, name: 'dificuldade', description: 'Dificuldade', required: true },
          { type: 4, name: 'wave', description: 'Wave atual', required: true },
          { type: 3, name: 'heroi', description: 'Herói', required: true },
          { type: 3, name: 'imagem', description: 'URL da imagem do mapa', required: false },
          { type: 7, name: 'canal', description: 'Canal para o HUD', required: false }
        ]
      },
      {
        type: 1,
        name: 'preview',
        description: 'Mostra o card sem mudar presença',
        options: [
          { type: 3, name: 'mapa', description: 'Nome do mapa', required: true },
          { type: 3, name: 'dificuldade', description: 'Dificuldade', required: true },
          { type: 4, name: 'wave', description: 'Wave atual', required: true },
          { type: 3, name: 'heroi', description: 'Herói', required: true },
          { type: 3, name: 'imagem', description: 'URL da imagem do mapa', required: false },
          { type: 7, name: 'canal', description: 'Canal para o HUD', required: false }
        ]
      },
      {
        type: 1,
        name: 'off',
        description: 'Limpa presença do DD'
      },
      {
        type: 1,
        name: 'lootbox',
        description: 'Abre uma lootbox e gera um item aleatório'
      }
    ]
  },
  {
    name: 'teste',
    description: 'Envia uma mensagem engraçada'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('Slash commands registrados.');
} catch (err) {
  console.error(err);
}
