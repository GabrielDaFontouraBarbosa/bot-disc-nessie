// deploy-commands.js
import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const difficulties = [
  'Easy','Medium','Hard','Insane','Nightmare',
  'NMHC','NMHCMM' // Nightmare Hardcore / Mixed Mode
];

const heroes = [
  'Squire','Apprentice','Huntress','Monk','Summoner','EV','Barbarian','Jester'
];

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
          { type: 3, name: 'dificuldade', description: 'Dificuldade', required: true,
            choices: difficulties.map(d => ({ name: d, value: d })) },
          { type: 4, name: 'wave', description: 'Wave atual (1..35)', required: true, min_value: 1, max_value: 35 },
          { type: 3, name: 'heroi', description: 'Herói', required: true,
            choices: heroes.map(h => ({ name: h, value: h })) },
          { type: 3, name: 'imagem', description: 'URL da imagem/miniatura do mapa', required: false },
          { type: 7, name: 'canal', description: 'Canal para postar/atualizar o card', required: false } // channel
        ]
      },
      {
        type: 1,
        name: 'preview',
        description: 'Mostra o card sem mudar presença',
        options: [
          { type: 3, name: 'mapa', required: true, description: 'Nome do mapa' },
          { type: 3, name: 'dificuldade', required: true, description: 'Dificuldade',
            choices: difficulties.map(d => ({ name: d, value: d })) },
          { type: 4, name: 'wave', required: true, description: 'Wave' },
          { type: 3, name: 'heroi', required: true, description: 'Herói',
            choices: heroes.map(h => ({ name: h, value: h })) },
          { type: 3, name: 'imagem', required: false, description: 'URL da imagem do mapa' },
          { type: 7, name: 'canal', required: false, description: 'Canal (senão responde aqui)' }
        ]
      },
      {
        type: 1,
        name: 'off',
        description: 'Limpa presença do DD'
      }
    ]
  },
  {
    name: 'teste',
    description: 'Envia uma mensagem engraçada'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

await rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands }
);
console.log('Slash commands registrados.');

