/**
 * Admin Seeder
 * Run with: bun run seed:admin
 *
 * Creates a default admin account if it doesn't already exist.
 * Bun automatically loads .env from the working directory.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";

const ADMIN_DATA = {
  fullName: "Administrator",
  username: "admin",
  email: "admin@menterikebenaran.com",
  password: "Admin@12345",
  role: "admin" as const,
};

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not set in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to database...");
  console.log("   URI:", uri.substring(0, 40) + "...");
  await mongoose.connect(uri);
  console.log("✅ Connected to database");

  try {
    // Check if admin already exists
    const existing = await User.findOne({
      $or: [{ email: ADMIN_DATA.email }, { username: ADMIN_DATA.username }],
    });

    if (existing) {
      console.log(`⚠️  Admin already exists:`);
      console.log(`   - Username : ${existing.username}`);
      console.log(`   - Email    : ${existing.email}`);
      console.log(`   - Role     : ${existing.role}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, 12);

    // Create admin user
    const admin = await User.create({
      ...ADMIN_DATA,
      password: hashedPassword,
    });

    console.log("🎉 Admin account created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Full Name : ${admin.fullName}`);
    console.log(`   Username  : ${admin.username}`);
    console.log(`   Email     : ${admin.email}`);
    console.log(`   Password  : ${ADMIN_DATA.password}  ← ganti setelah login!`);
    console.log(`   Role      : ${admin.role}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
}

seedAdmin().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
