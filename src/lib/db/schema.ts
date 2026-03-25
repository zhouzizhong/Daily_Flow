import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ==================== 认证相关表 ====================

/**
 * 用户表
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 会话表（Better Auth 使用）
 */
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 验证表（邮箱验证等）
 */
export const verifications = sqliteTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ==================== 吃饭推荐相关表 ====================

/**
 * 食谱表
 */
export const meals = sqliteTable('meals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameEn: text('name_en'),
  description: text('description'),
  prepTime: integer('prep_time').notNull(),
  cookTime: integer('cook_time').notNull(),
  totalTime: integer('total_time').notNull(),
  difficulty: text('difficulty').notNull().default('easy'),
  calories: integer('calories'),
  tags: text('tags'),
  ingredients: text('ingredients').notNull(),
  steps: text('steps').notNull(),
  imageUrl: text('image_url'),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 每日用餐记录
 */
export const dailyMeals = sqliteTable('daily_meals', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  mealId: text('meal_id').references(() => meals.id, { onDelete: 'set null' }),
  date: text('date').notNull(),
  mealType: text('meal_type').notNull().default('dinner'),
  note: text('note'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ==================== 时间规划相关表 ====================

/**
 * 每日时间块规划
 */
export const dailyPlans = sqliteTable('daily_plans', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  color: text('color').notNull().default('blue'),
  category: text('category').notNull().default('work'),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  priority: integer('priority').default(1),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ==================== Todo 相关表 ====================

/**
 * Todo 事项表
 */
export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('pending'),
  priority: text('priority').default('medium'),
  dueDate: text('due_date'),
  dueTime: text('due_time'),
  tags: text('tags'),
  isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
  recurringPattern: text('recurring_pattern'),
  completedAt: text('completed_at'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ==================== 习惯打卡相关表 ====================

/**
 * 习惯表
 */
export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon').default('check'),
  color: text('color').default('green'),
  frequency: text('frequency').notNull().default('daily'),
  targetDays: text('target_days'),
  targetCount: integer('target_count').default(1),
  streak: integer('streak').default(0),
  bestStreak: integer('best_streak').default(0),
  totalCompletions: integer('total_completions').default(0),
  startDate: text('start_date').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 习惯打卡记录表
 */
export const habitLogs = sqliteTable('habit_logs', {
  id: text('id').primaryKey(),
  habitId: text('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  count: integer('count').default(1),
  note: text('note'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ==================== 导出所有表 ====================

export const schema = {
  users,
  sessions,
  verifications,
  meals,
  dailyMeals,
  dailyPlans,
  todos,
  habits,
  habitLogs,
};

// 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;

export type DailyMeal = typeof dailyMeals.$inferSelect;
export type NewDailyMeal = typeof dailyMeals.$inferInsert;

export type DailyPlan = typeof dailyPlans.$inferSelect;
export type NewDailyPlan = typeof dailyPlans.$inferInsert;

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

export type HabitLog = typeof habitLogs.$inferSelect;
export type NewHabitLog = typeof habitLogs.$inferInsert;
