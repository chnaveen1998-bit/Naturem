import { pool } from './connection';
import bcrypt from 'bcryptjs';
import { config } from '../config';

async function seed() {
  try {
    console.log('Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash(config.admin.password, 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, username, full_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING`,
      [config.admin.email, hashedPassword, 'admin', 'Administrator', 'admin']
    );
    console.log('Admin user created');

    // Create sample users
    const sampleUsers = [
      { email: 'john@example.com', username: 'john_doe', full_name: 'John Doe' },
      { email: 'jane@example.com', username: 'jane_smith', full_name: 'Jane Smith' },
    ];

    for (const user of sampleUsers) {
      const password = await bcrypt.hash('password123', 10);
      await pool.query(
        `INSERT INTO users (email, password_hash, username, full_name, role) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (email) DO NOTHING`,
        [user.email, password, user.username, user.full_name, 'user']
      );
    }
    console.log('Sample users created');

    // Get admin user ID
    const adminResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [config.admin.email]
    );
    const adminId = adminResult.rows[0]?.id;

    // Create sample remedies
    const sampleRemedies = [
      {
        title: 'Ginger Tea for Nausea',
        description: 'A natural remedy to help relieve nausea and upset stomach using fresh ginger root.',
        ingredients: ['Fresh ginger root (1-2 inches)', 'Water (2 cups)', 'Honey (optional)', 'Lemon (optional)'],
        instructions: '1. Peel and slice the ginger root into thin pieces.\n2. Boil water in a pot.\n3. Add ginger slices and simmer for 10-15 minutes.\n4. Strain the tea into a cup.\n5. Add honey and lemon to taste if desired.\n6. Drink while warm, 2-3 times daily.',
        category: 'Digestive Health',
        tags: ['nausea', 'ginger', 'digestive', 'tea'],
        status: 'approved',
      },
      {
        title: 'Turmeric Golden Milk',
        description: 'An anti-inflammatory drink that supports immune health and promotes better sleep.',
        ingredients: ['Turmeric powder (1 tsp)', 'Milk (1 cup)', 'Honey (1 tsp)', 'Black pepper (pinch)', 'Cinnamon (optional)'],
        instructions: '1. Heat milk in a saucepan over medium heat.\n2. Add turmeric powder and black pepper.\n3. Stir well and bring to a gentle simmer.\n4. Remove from heat and add honey.\n5. Add cinnamon if desired.\n6. Drink warm before bedtime.',
        category: 'Immune Support',
        tags: ['turmeric', 'anti-inflammatory', 'immune', 'sleep'],
        status: 'approved',
      },
      {
        title: 'Honey and Lemon for Sore Throat',
        description: 'A soothing remedy to relieve sore throat and cough symptoms naturally.',
        ingredients: ['Raw honey (2 tbsp)', 'Fresh lemon juice (1 lemon)', 'Warm water (1 cup)'],
        instructions: '1. Squeeze fresh lemon juice into a cup.\n2. Add raw honey to the lemon juice.\n3. Pour warm (not boiling) water into the cup.\n4. Stir well until honey is dissolved.\n5. Sip slowly while the mixture is warm.\n6. Repeat 3-4 times daily.',
        category: 'Respiratory Health',
        tags: ['sore throat', 'honey', 'lemon', 'cough'],
        status: 'approved',
      },
      {
        title: 'Peppermint Oil for Headaches',
        description: 'Essential oil remedy to naturally relieve tension headaches and migraines.',
        ingredients: ['Peppermint essential oil', 'Carrier oil (coconut or almond oil)'],
        instructions: '1. Mix 2-3 drops of peppermint oil with 1 tsp of carrier oil.\n2. Apply to temples and massage gently.\n3. Also apply to the back of the neck.\n4. Breathe deeply and relax.\n5. Reapply every 15-20 minutes as needed.',
        category: 'Pain Relief',
        tags: ['headache', 'peppermint', 'essential oil', 'pain relief'],
        status: 'approved',
      },
      {
        title: 'Chamomile Tea for Better Sleep',
        description: 'A calming herbal tea that promotes relaxation and improves sleep quality.',
        ingredients: ['Chamomile tea bag or dried chamomile (1-2 tsp)', 'Hot water (1 cup)', 'Honey (optional)'],
        instructions: '1. Boil water and pour into a cup.\n2. Add chamomile tea bag or dried flowers.\n3. Steep for 5-10 minutes.\n4. Remove tea bag or strain flowers.\n5. Add honey if desired.\n6. Drink 30 minutes before bedtime.',
        category: 'Sleep & Relaxation',
        tags: ['sleep', 'chamomile', 'relaxation', 'insomnia'],
        status: 'approved',
      },
    ];

    for (const remedy of sampleRemedies) {
      await pool.query(
        `INSERT INTO remedies (title, description, ingredients, instructions, category, tags, author_id, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          remedy.title,
          remedy.description,
          remedy.ingredients,
          remedy.instructions,
          remedy.category,
          remedy.tags,
          adminId,
          remedy.status,
        ]
      );
    }
    console.log('Sample remedies created');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
