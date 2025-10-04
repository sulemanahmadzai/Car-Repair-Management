import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // STRIPE FIELDS COMMENTED OUT - TO BE ENABLED LATER
  // stripeCustomerId: text('stripe_customer_id').unique(),
  // stripeSubscriptionId: text('stripe_subscription_id').unique(),
  // stripeProductId: text('stripe_product_id'),
  // planName: varchar('plan_name', { length: 50 }),
  // subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  role: varchar("role", { length: 50 }).notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  invitedBy: integer("invited_by")
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp("invited_at").notNull().defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  name: varchar("name", { length: 255 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  // Vehicle Information
  registrationNumber: varchar("registration_number", { length: 20 }).notNull(),
  make: varchar("make", { length: 100 }),
  model: varchar("model", { length: 100 }),
  colour: varchar("colour", { length: 50 }),
  fuelType: varchar("fuel_type", { length: 50 }),
  motExpiry: varchar("mot_expiry", { length: 20 }),
  taxDueDate: varchar("tax_due_date", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const serviceRecords = pgTable("service_records", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  vehicleReg: varchar("vehicle_reg", { length: 20 }).notNull(),
  serviceType: varchar("service_type", { length: 50 }).notNull(),
  mileage: integer("mileage"),
  labourHours: integer("labour_hours"),
  partsUsed: jsonb("parts_used").$type<string[]>(),
  notes: text("notes"),
  mediaFiles:
    jsonb("media_files").$type<{ url: string; type: string; name: string }[]>(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  carReg: varchar("car_reg", { length: 20 }).notNull(),
  services: jsonb("services").$type<string[]>().notNull(),
  bookDate: varchar("book_date", { length: 20 }).notNull(),
  bookTime: varchar("book_time", { length: 20 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  customers: many(customers),
  serviceRecords: many(serviceRecords),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  team: one(teams, {
    fields: [customers.teamId],
    references: [teams.id],
  }),
}));

export const serviceRecordsRelations = relations(serviceRecords, ({ one }) => ({
  team: one(teams, {
    fields: [serviceRecords.teamId],
    references: [teams.id],
  }),
  creator: one(users, {
    fields: [serviceRecords.createdBy],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type ServiceRecord = typeof serviceRecords.$inferSelect;
export type NewServiceRecord = typeof serviceRecords.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, "id" | "name" | "email">;
  })[];
};

export enum ActivityType {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  CREATE_TEAM = "CREATE_TEAM",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
}
