-- Database Schema for Naturem

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Remedies table
CREATE TABLE IF NOT EXISTS remedies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT[],
    instructions TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    remedy_id INTEGER REFERENCES remedies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT[],
    instructions TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Board remedies (many-to-many relationship)
CREATE TABLE IF NOT EXISTS board_remedies (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    remedy_id INTEGER REFERENCES remedies(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(board_id, remedy_id)
);

-- Remedy likes
CREATE TABLE IF NOT EXISTS remedy_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    remedy_id INTEGER REFERENCES remedies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, remedy_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    remedy_id INTEGER REFERENCES remedies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_remedies_author ON remedies(author_id);
CREATE INDEX IF NOT EXISTS idx_remedies_status ON remedies(status);
CREATE INDEX IF NOT EXISTS idx_remedies_category ON remedies(category);
CREATE INDEX IF NOT EXISTS idx_remedies_created_at ON remedies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_boards_user ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_board_remedies_board ON board_remedies(board_id);
CREATE INDEX IF NOT EXISTS idx_board_remedies_remedy ON board_remedies(remedy_id);
CREATE INDEX IF NOT EXISTS idx_comments_remedy ON comments(remedy_id);
CREATE INDEX IF NOT EXISTS idx_remedy_likes_remedy ON remedy_likes(remedy_id);
CREATE INDEX IF NOT EXISTS idx_remedy_likes_user ON remedy_likes(user_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_remedies_title_search ON remedies USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_remedies_description_search ON remedies USING gin(to_tsvector('english', description));
