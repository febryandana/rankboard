import dotenv from 'dotenv';
import { initDatabase } from '../config/database';
import * as userService from '../services/userService';
import * as challengeService from '../services/challengeService';

dotenv.config();

async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Seeding database...\n');

    await initDatabase();
    console.log('✅ Database initialized\n');

    console.log('Creating root admin...');
    try {
      const rootAdmin = await userService.getUserByUsername(
        process.env.ROOT_ADMIN_USERNAME || 'admin'
      );

      if (!rootAdmin) {
        await userService.createUser({
          username: process.env.ROOT_ADMIN_USERNAME || 'admin',
          email: process.env.ROOT_ADMIN_EMAIL || 'admin@rankboard.local',
          password: process.env.ROOT_ADMIN_PASSWORD || 'Admin123!',
          role: 'admin',
        });
        console.log('✅ Root admin created');
      } else {
        console.log('ℹ️  Root admin already exists');
      }
    } catch (error) {
      console.log('ℹ️  Root admin already exists or error:', (error as Error).message);
    }

    console.log('\nCreating additional admins...');
    const admins = [
      { username: 'judge1', email: 'judge1@rankboard.local', password: 'Judge123!' },
      { username: 'judge2', email: 'judge2@rankboard.local', password: 'Judge123!' },
    ];

    for (const admin of admins) {
      try {
        const existing = await userService.getUserByUsername(admin.username);
        if (!existing) {
          await userService.createUser({ ...admin, role: 'admin' });
          console.log(`✅ Created admin: ${admin.username}`);
        } else {
          console.log(`ℹ️  Admin ${admin.username} already exists`);
        }
      } catch (error) {
        console.log(
          `ℹ️  Admin ${admin.username} already exists or error:`,
          (error as Error).message
        );
      }
    }

    console.log('\nCreating users...');
    const users = [
      { username: 'alice', email: 'alice@rankboard.local', password: 'User123!' },
      { username: 'bob', email: 'bob@rankboard.local', password: 'User123!' },
      { username: 'charlie', email: 'charlie@rankboard.local', password: 'User123!' },
      { username: 'diana', email: 'diana@rankboard.local', password: 'User123!' },
      { username: 'eve', email: 'eve@rankboard.local', password: 'User123!' },
    ];

    for (const user of users) {
      try {
        const existing = await userService.getUserByUsername(user.username);
        if (!existing) {
          await userService.createUser({ ...user, role: 'user' });
          console.log(`✅ Created user: ${user.username}`);
        } else {
          console.log(`ℹ️  User ${user.username} already exists`);
        }
      } catch (error) {
        console.log(`ℹ️  User ${user.username} already exists or error:`, (error as Error).message);
      }
    }

    console.log('\nCreating challenges...');

    const adminUser = await userService.getUserByUsername(
      process.env.ROOT_ADMIN_USERNAME || 'admin'
    );

    if (adminUser) {
      const now = new Date();
      const challenges = [
        {
          title: 'Web Development Challenge',
          description:
            'Build a responsive web application using modern frameworks. The application should demonstrate your understanding of HTML, CSS, JavaScript, and a frontend framework of your choice.',
          created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        },
        {
          title: 'Algorithm Challenge',
          description:
            'Solve complex algorithmic problems efficiently. Focus on time and space complexity optimization.',
          created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
        },
        {
          title: 'Database Design Challenge',
          description:
            'Design and implement a scalable database schema for a complex application. Include normalization, indexing strategies, and query optimization.',
          created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        },
        {
          title: 'UI/UX Design Challenge',
          description:
            'Create an intuitive and visually appealing user interface for a mobile application. Focus on user experience, accessibility, and design consistency.',
          created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        },
      ];

      for (const challenge of challenges) {
        try {
          await challengeService.createChallenge({
            ...challenge,
            created_by_admin_id: adminUser.id,
          });
          console.log(`✅ Created challenge: ${challenge.title}`);
        } catch (error) {
          console.log(
            `ℹ️  Challenge "${challenge.title}" creation error:`,
            (error as Error).message
          );
        }
      }
    }

    console.log('\n================================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('================================================\n');
    console.log('Sample accounts created:');
    console.log('\nAdmins:');
    console.log(`  Username: ${process.env.ROOT_ADMIN_USERNAME || 'admin'}`);
    console.log(`  Password: ${process.env.ROOT_ADMIN_PASSWORD || 'Admin123!'}`);
    console.log(`
  Username: judge1 / judge2
  Password: Judge123!`);
    console.log('\nUsers:');
    console.log(`  Username: alice, bob, charlie, diana, eve
  Password: User123!`);
    console.log('\nChallenges:');
    console.log(`  4 sample challenges created with varied deadlines`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
