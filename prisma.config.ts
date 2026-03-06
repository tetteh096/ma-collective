import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

// Load .env and .env.local for DATABASE_URL
config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local'), override: true });

const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: DATABASE_URL,
  },
});
