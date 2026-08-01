import { pgTable, uuid, text, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const pipelineStatusEnum = pgEnum('pipeline_status', [
  'prospek',
  'outreach',
  'nego',
  'deal',
  'posting',
  'selesai',
])

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  clerkOrgId: text('clerk_org_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const kols = pgTable('kols', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  name: text('name').notNull(),
  platform: text('platform').notNull(), // Instagram | TikTok | YouTube | Twitter
  username: text('username'),
  niche: text('niche'),
  followers: integer('followers').default(0),
  engagementRate: numeric('engagement_rate'),
  ratePerPost: numeric('rate_per_post'), // dalam IDR
  contact: text('contact'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  name: text('name').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  totalBudget: numeric('total_budget'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const campaignKols = pgTable('campaign_kols', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  kolId: uuid('kol_id').references(() => kols.id).notNull(),
  allocatedBudget: numeric('allocated_budget'),
  status: pipelineStatusEnum('status').default('prospek'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const pipelineEntries = pgTable('pipeline_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  kolId: uuid('kol_id').references(() => kols.id).notNull(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  status: pipelineStatusEnum('status').default('prospek').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const performanceRecords = pgTable('performance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignKolId: uuid('campaign_kol_id').references(() => campaignKols.id).notNull(),
  views: integer('views'),
  engagement: integer('engagement'),
  conversions: integer('conversions'),
  cpm: numeric('cpm'),
  cpe: numeric('cpe'),
  cpv: numeric('cpv'),
  createdAt: timestamp('created_at').defaultNow(),
})
