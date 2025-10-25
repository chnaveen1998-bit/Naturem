-- Seed data for Naturem database

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, username, role) VALUES
('admin@naturem.com', '$2a$10$mF8KbL7jJ5lWvE/gNzJLH.pqaLRfGhPvKrqZ7Yq6x8vNbZLzP4VdG', 'admin', 'admin');

-- Insert regular users (password: user123)
INSERT INTO users (email, password, username, role) VALUES
('user1@example.com', '$2a$10$mF8KbL7jJ5lWvE/gNzJLH.pqaLRfGhPvKrqZ7Yq6x8vNbZLzP4VdG', 'john_doe', 'user'),
('user2@example.com', '$2a$10$mF8KbL7jJ5lWvE/gNzJLH.pqaLRfGhPvKrqZ7Yq6x8vNbZLzP4VdG', 'jane_smith', 'user');

-- Insert boards
INSERT INTO boards (name, description) VALUES
('General Discussion', 'General discussions about natural remedies'),
('Questions & Answers', 'Ask questions and get answers from the community'),
('Success Stories', 'Share your success stories with natural remedies');

-- Insert sample remedies
INSERT INTO remedies (title, description, ingredients, instructions, category, author_id, status) 
SELECT 
  'Honey and Lemon for Cold',
  'A simple and effective remedy for common cold symptoms. This natural combination helps soothe throat irritation and boost immunity.',
  '["1 tablespoon honey", "1/2 lemon", "1 cup warm water"]',
  '1. Squeeze half a lemon into warm water. 2. Add honey and stir well. 3. Drink while warm, 2-3 times daily.',
  'Cold & Flu',
  id,
  'published'
FROM users WHERE role = 'admin' LIMIT 1;

INSERT INTO remedies (title, description, ingredients, instructions, category, author_id, status) 
SELECT 
  'Ginger Tea for Digestion',
  'Ginger has powerful anti-inflammatory and digestive properties that help with nausea and stomach discomfort.',
  '["2 inches fresh ginger root", "2 cups water", "1 teaspoon honey (optional)", "Lemon slice (optional)"]',
  '1. Peel and slice ginger root. 2. Boil water and add ginger slices. 3. Simmer for 10 minutes. 4. Strain and add honey/lemon if desired. 5. Drink warm.',
  'Digestive Health',
  id,
  'published'
FROM users WHERE username = 'john_doe' LIMIT 1;

INSERT INTO remedies (title, description, ingredients, instructions, category, author_id, status) 
SELECT 
  'Turmeric Golden Milk',
  'Anti-inflammatory golden milk is perfect for boosting immunity and reducing inflammation. Great before bedtime.',
  '["1 cup milk (dairy or plant-based)", "1 teaspoon turmeric powder", "1/4 teaspoon cinnamon", "1/4 teaspoon ginger powder", "Pinch of black pepper", "1 teaspoon honey"]',
  '1. Heat milk in a saucepan. 2. Add turmeric, cinnamon, ginger, and black pepper. 3. Whisk well and simmer for 5 minutes. 4. Add honey before serving. 5. Drink warm.',
  'Immunity',
  id,
  'published'
FROM users WHERE username = 'jane_smith' LIMIT 1;

INSERT INTO remedies (title, description, ingredients, instructions, category, author_id, status) 
SELECT 
  'Aloe Vera for Skin Burns',
  'Fresh aloe vera gel provides instant relief for minor burns, sunburns, and skin irritations.',
  '["Fresh aloe vera leaf or pure aloe vera gel"]',
  '1. Cut aloe vera leaf and extract the gel. 2. Wash the affected area gently. 3. Apply fresh gel directly to the burn. 4. Leave on for 20-30 minutes. 5. Rinse with cool water. 6. Repeat 2-3 times daily.',
  'Skin Care',
  id,
  'published'
FROM users WHERE role = 'admin' LIMIT 1;

INSERT INTO remedies (title, description, ingredients, instructions, category, author_id, status) 
SELECT 
  'Chamomile Tea for Sleep',
  'Chamomile has calming properties that help promote better sleep and reduce anxiety.',
  '["2 teaspoons dried chamomile flowers or 1 tea bag", "1 cup boiling water", "Honey (optional)"]',
  '1. Place chamomile in a cup. 2. Pour boiling water over it. 3. Steep for 5-10 minutes. 4. Strain and add honey if desired. 5. Drink 30 minutes before bedtime.',
  'Sleep & Relaxation',
  id,
  'published'
FROM users WHERE username = 'john_doe' LIMIT 1;

-- Insert sample posts
INSERT INTO posts (board_id, author_id, title, content)
SELECT 
  b.id,
  u.id,
  'Welcome to Naturem!',
  'Welcome to our natural remedies community! Feel free to share your experiences and learn from others.'
FROM boards b, users u
WHERE b.name = 'General Discussion' AND u.role = 'admin'
LIMIT 1;

INSERT INTO posts (board_id, author_id, title, content)
SELECT 
  b.id,
  u.id,
  'How long should I use honey and lemon?',
  'I started using the honey and lemon remedy for my cold. How long should I continue this treatment?'
FROM boards b, users u
WHERE b.name = 'Questions & Answers' AND u.username = 'jane_smith'
LIMIT 1;
