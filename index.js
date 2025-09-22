// index.js
import 'dotenv/config';
import {
  Client, GatewayIntentBits, ActivityType, Events,
  EmbedBuilder, ChannelType, PermissionFlagsBits
} from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
client.on('error', console.error);

// guarda o ID da última mensagem de HUD por guilda
const hudMessageByGuild = new Map();

client.once(Events.ClientReady, (c) => {
  console.log(`Logado como ${c.user.tag}`);
  c.user.setPresence({
    activities: [{ name: 'Dungeon Defenders – Fase 1', type: ActivityType.Playing }],
    status: 'online'
  });
});

function ddPresenceText({ mapa, dificuldade, wave, heroi }) {
  return `Dungeon Defenders — ${mapa} | ${dificuldade} | Wave ${wave} | ${heroi}`;
}

function ddEmbed({ mapa, dificuldade, wave, heroi, imagem }) {
  const embed = new EmbedBuilder()
    .setTitle(`Dungeon Defenders — ${mapa}`)
    .addFields(
      { name: 'Dificuldade', value: dificuldade, inline: true },
      { name: 'Wave', value: String(wave), inline: true },
      { name: 'Herói', value: heroi, inline: true }
    )
    .setColor(0x8a2be2) // roxo "místico"
    .setTimestamp();

  if (imagem) embed.setThumbnail(imagem);
  return embed;
}

async function upsertHud({ interaction, data, channel }) {
  const embed = ddEmbed(data);

  // se não vier canal, responde no mesmo lugar (mensagem efêmera = false para ficar visível)
  if (!channel) {
    // tenta editar a própria resposta se já existir
    if (interaction.replied || interaction.deferred) {
      return interaction.editReply({ embeds: [embed] });
    }
    return interaction.reply({ embeds: [embed] });
  }

  // tem canal: vamos tentar editar a última mensagem do bot (um "painel" persistente)
  const gid = interaction.guildId;
  const prevId = hudMessageByGuild.get(gid);

  try {
    const ch = channel;
    if (ch.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'Escolha um canal de texto.', ephemeral: true });
    }

    if (prevId) {
      const msg = await ch.messages.fetch(prevId).catch(() => null);
      if (msg && msg.editable) {
        const edited = await msg.edit({ embeds: [embed] });
        return interaction.reply({ content: 'HUD atualizado ✅', ephemeral: true });
      }
    }

    const sent = await ch.send({ embeds: [embed] });
    hudMessageByGuild.set(gid, sent.id);
    return interaction.reply({ content: 'HUD publicado ✅', ephemeral: true });
  } catch (e) {
    console.error(e);
    return interaction.reply({ content: 'Não consegui publicar/atualizar o HUD no canal.', ephemeral: true });
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

     if (interaction.commandName === 'dd') {
    const sub = interaction.options.getSubcommand();

    
    if (sub === 'lootbox') {
      const { rarity, material, slot } = rollItem();
      const meta = RARITY_META[rarity] ?? { emoji: '🎁', color: 0x5865f2, msg: 'loot misteriosa!' };
      const itemName = `${rarity} ${material} ${slot}`;

      // responde com embed bonitinho
      const embed = new EmbedBuilder()
        .setTitle(`${meta.emoji} Você abriu uma Lootbox!`)
        .setDescription(`**Drop:** ${itemName}\n${meta.msg}`)
        .setColor(meta.color)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }
  
        }

    

  if (interaction.commandName === 'teste') {
    return interaction.reply('🧪 Teste! Nessie está te aguardando em Deeper Well!');
  }

  if (interaction.commandName === 'dd') {
    const sub = interaction.options.getSubcommand();

    if (sub === 'off') {
      client.user.setPresence({ activities: [], status: 'online' });
      return interaction.reply({ content: 'Presença do DD limpa. 🧹', ephemeral: true });
    }

    if (sub === 'set' || sub === 'preview') {
      const mapa = interaction.options.getString('mapa', true);
      const dificuldade = interaction.options.getString('dificuldade', true);
      const wave = interaction.options.getInteger('wave', true);
      const heroi = interaction.options.getString('heroi', true);
      const imagem = interaction.options.getString('imagem') ?? null;
      const channel = interaction.options.getChannel('canal');

      const data = { mapa, dificuldade, wave, heroi, imagem };

      if (sub === 'set') {
        // Atualiza presença com um texto “rico”
        client.user.setPresence({
          activities: [{ name: ddPresenceText(data), type: ActivityType.Playing }],
          status: 'online'
        });
      }

      // Publica/atualiza o “HUD” (embed)
      return upsertHud({ interaction, data, channel });
    }
  }

  
const RARITIES = [
  'Cursed','Torn','Worn','Stocky','Sturdy','Blessed','Enchanted','Powerful',
  'Epic','Legendary','Godly','Mythical','Transcendent','Supreme','Ultimate','Ultimate+','Ultimate++'
];
const RARITY_WEIGHTS = [20,18,16,14,12,10,9,8,6,5,4,3,2,1.5,1,0.5,0.25]; // altas mais raras

const MATERIALS = ['Leather','Chain','Mail','Plate','Pristine'];
const SLOTS = ['Helmet','Chest','Gloves','Boots'];

// mensagem/emoji/cor por raridade
const RARITY_META = {
  Cursed:         { emoji: '🗑️',  color: 0x777777, msg: '…é, eu desinstalava o game' },
  Torn:           { emoji: '🧻',  color: 0x777777, msg: 'menos merda' },
  Worn:           { emoji: '🧥',  color: 0x888888, msg: 'melhorando ai no conceito.' },
  Stocky:         { emoji: '🥊',  color: 0x888888, msg: 'pelo menos aguenta umas porradas.' },
  Sturdy:         { emoji: '🧱',  color: 0x999999, msg: 'resistente o suficiente pra wave 2.' },
  Blessed:        { emoji: '✨',  color: 0x66ccff, msg: 'AMÉM' },
  Enchanted:      { emoji: '🔮',  color: 0x66ccff, msg: ' "Bota no RUTHLESS" ' },
  Powerful:       { emoji: '💪',  color: 0x4db6ac, msg: 'Talvez voce nao morra em The Summit tão rápido' },
  Epic:           { emoji: '🟣',  color: 0x9c27b0, msg: ' "Dropa Mana ai" '},
  Legendary:      { emoji: '🟠',  color: 0xff9800, msg: 'OLHA SÓ' },
  Godly:          { emoji: '🟡',  color: 0xffeb3b, msg: 'CADÊ MEU NÍVEL 74'},
  Mythical:       { emoji: '💜',  color: 0x8e24aa, msg: ' "NO INSANE OU NO HARD?" ' },
  Transcendent:   { emoji: '💠',  color: 0x00bcd4, msg: 'você sente o poder atravessando planos.' },
  Supreme:        { emoji: '🟥',  color: 0xe53935, msg: 'Cheater?' },
  Ultimate:       { emoji: '🧬',  color: 0x43a047, msg: 'PUTA QUE PARIU' },
  'Ultimate+':    { emoji: '➕',  color: 0x2e7d32, msg: 'plus = plus de dano. simples.' },
  'Ultimate++':   { emoji: '⭑',  color: 0x1b5e20, msg: 'TU CHEATA POUCO HEIN' }
};

function pickWeighted(items, weights) {
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for (let i=0; i<items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length-1];
}

function rollItem() {
  const rarity = pickWeighted(RARITIES, RARITY_WEIGHTS);
  const material = MATERIALS[Math.floor(Math.random()*MATERIALS.length)];
  const slot = SLOTS[Math.floor(Math.random()*SLOTS.length)];
  return { rarity, material, slot };
}
// --- fim dos utilitários ---

});

client.login(process.env.DISCORD_TOKEN);
