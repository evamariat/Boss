# Boss Bot - Node.js Technical Specification (Spec.md)

**Event-Driven Discord Bot with Slash Commands**  
*Node.js 20+ | discord.js v14 | PostgreSQL | TypeScript*  
**Version 1.0** | **Feb 27, 2026** | **Tallinn, EE**

## 📋 Overview
Boss is a Node.js Discord bot where **the Boss gets advice from Bigcat 🐱💼**. Features slash commands: `/ping`, `/help`, `/assist`, `/next` with PostgreSQL user accounts.

## 📁 Complete File Structure

```
boss-bot/
├── README.md                 # User guide
├── Spec.md                   # ← THIS FILE (copy everything)
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── .env.example             # Environment vars
├── docker-compose.yml       # Local PostgreSQL
├── src/
│   ├── index.ts             # Bot entry point
│   ├── commands/
│   │   ├── ping.ts
│   │   ├── help.ts
│   │   ├── assist.ts
│   │   └── next.ts
│   ├── database/
│   │   └── db.ts           # PostgreSQL setup
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── utils/
│       └── logger.ts       # Logging
└── dist/                    # Compiled JS (gitignored)
```

## 📦 package.json (Complete)

```json
{
  "name": "boss-discord-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9",
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

## ⚙️ tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 🌍 .env.example

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DATABASE_URL=postgresql://postgres:password@localhost:5432/bossdb
```

## 🗄️ database/db.ts (PostgreSQL + Pooling)

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export interface BossUser {
  discordId: string;
  username: string;
  style: 'SASSY' | 'SERIOUS' | 'FUNNY';
  registeredAt: Date;
}

export async function getOrCreateUser(discordId: string, username: string) {
  const result = await pool.query(
    `INSERT INTO boss_users (discord_id, username, style) 
     VALUES ($1, $2, 'SASSY') 
     ON CONFLICT (discord_id) 
     DO UPDATE SET username = $2 
     RETURNING *`,
    [discordId, username]
  );
  return result.rows[0];
}
```

## 🎯 Slash Commands

### **src/commands/ping.ts**
```typescript
import { SlashCommandBuilder } from 'discord.js';

export const ping = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if Boss is alive 🐱'),
  async execute(interaction: any) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! **${latency}ms** | API: ${interaction.client.ws.ping}ms`);
  },
};
```

### **src/commands/help.ts**
```typescript
import { SlashCommandBuilder } from 'discord.js';

export const help = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Boss command list'),
  async execute(interaction: any) {
    const embed = {
      title: '🐱 Boss Bot - Bigcat Advisor',
      description: 'Commands for the Boss:',
      fields: [
        { name: '/ping', value: 'Check bot latency', inline: true },
        { name: '/assist [question]', value: 'Get Bigcat advice', inline: true },
        { name: '/next', value: 'What to do next', inline: true },
      ],
      color: 0x00ff00,
    };
    await interaction.reply({ embeds: [embed] });
  },
};
```

### **src/commands/assist.ts**
```typescript
import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getOrCreateUser } from '../database/db.js';

export const assist = {
  data: new SlashCommandBuilder()
    .setName('assist')
    .setDescription('Get advice from Bigcat 🐱💼')
    .addStringOption(new SlashCommandStringOption()
      .setName('question')
      .setDescription('Your question for Bigcat')
      .setRequired(true)),
  async execute(interaction: any) {
    await interaction.deferReply();
    
    const question = interaction.options.getString('question')!;
    const user = await getOrCreateUser(interaction.user.id, interaction.user.username);
    
    // Bigcat AI Logic (simple for now)
    const responses = {
      SASSY: `🐱 *claws sharpen* "${question}"? Boss, you already know the answer. Do it. Now. 💅`,
      SERIOUS: `📋 Analysis: "${question}" requires immediate action. Execute plan Alpha.`,
      FUNNY: `😂 "${question}"? Let me consult my hairball oracle... It's a **YES**! 🎉`,
    };
    
    await interaction.editReply(`${responses[user.style]} | Style: **${user.style}**`);
  },
};
```

### **src/commands/next.ts**
```typescript
import { SlashCommandBuilder } from 'discord.js';

export const next = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('What should Boss do next?'),
  async execute(interaction: any) {
    const actions = ['✅ Execute', '⏳ Wait', '🔥 Ban someone', '🍕 Order pizza', '😴 Nap time'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    await interaction.reply(`**Next Action:** ${action} 🐱💼`);
  },
};
```

## 🚀 src/index.ts (Main Bot)

```typescript
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { pool } from './database/db.js';
import { ping } from './commands/ping.js';
import { help } from './commands/help.js';
import { assist } from './commands/assist.js';
import { next } from './commands/next.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.commands.set(ping.data.name, ping);
client.commands.set(help.data.name, help);
client.commands.set(assist.data.name, assist);
client.commands.set(next.data.name, next);

client.once('ready', async () => {
  console.log(`🐱 Boss logged in as ${client.user?.tag}`);
  
  // Init DB
  await pool.query(`
    CREATE TABLE IF NOT EXISTS boss_users (
      discord_id VARCHAR(20) PRIMARY KEY,
      username VARCHAR(32) NOT NULL,
      style VARCHAR(10) DEFAULT 'SASSY',
      registered_at TIMESTAMP DEFAULT NOW()
    )
  `);
  
  // Register slash commands
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  await client.application?.commands.set(commands);
  console.log('✅ Slash commands registered');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = (interaction.client as any).commands.get(interaction.commandName);
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
```

## 🐳 docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: bossdb
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Setup
mkdir boss-bot && cd boss-bot
npm install

# 2. Copy ALL code blocks from Spec.md into files above
# 3. Env vars
cp .env.example .env
# Edit .env with your Discord token + DATABASE_URL

# 4. Start DB + Bot
docker-compose up -d
npm run dev

# 5. Test in Discord
/ping
/assist question: Should I ban this user?
```

## ✅ **SINGLE FILE SETUP - Copy → Paste → Run**

**Private App**: Developer Portal → OAuth2 → Clear default link → Toggle Public Bot OFF

**Commands Ready**: `/ping` `/help` `/assist` `/next` ✅

*Boss Bot Node.js by ero resolve | Tallinn, Estonia | 2026* 🐱💼
