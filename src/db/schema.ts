import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  clientId: text("client_id").notNull(),
  domainName: text("domain_name").notNull(),
  domainProvider: text("domain_provider").notNull(),
  apiConfig: text("api_config").notNull().default("New API"),
  whatsapp: text("whatsapp").notNull(),
  projectType: text("project_type").default("Deriv Site Ecosystem"),
  message: text("message"),
  magicKey: uuid("magic_key").defaultRandom().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id").references(() => leads.id),
  title: text("title").notNull(),
  status: text("status").default("pending").notNull(), // pending, active, completed
  
  // High-fidelity Lifecycle Tracking
  accountStatus: text("account_status").default("completed"),
  clientIdStatus: text("client_id_status").default("completed"),
  domainStatus: text("domain_status").default("pending"),
  devStatus: text("dev_status").default("pending"),
  deployStatus: text("deploy_status").default("pending"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const devices = pgTable("devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id").references(() => leads.id).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
});

// Institutional Admin Layer
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  magicKey: uuid("magic_key").defaultRandom().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
