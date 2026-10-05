-- =========================================================================
-- Topson Media Database Schema (Supabase / PostgreSQL)
-- Production Clean Slate: Tables for Users, Videos, Feedbacks, and Messages
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_date VARCHAR(50) DEFAULT 'Joined recently',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Admin Account Row ("admin")
INSERT INTO public.users (username, email, role, joined_date)
VALUES ('admin', 'topsonkenedy@gmail.com', 'admin', 'Channel Creator & Admin')
ON CONFLICT (username) DO NOTHING;

-- 2. VIDEOS TABLE (Tutorial Gallery)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(80) NOT NULL,
    duration VARCHAR(20) DEFAULT '10:00',
    views VARCHAR(50) DEFAULT '0 views',
    date VARCHAR(50) DEFAULT 'Just now',
    thumbnail TEXT NOT NULL,
    youtube_id VARCHAR(50),
    video_url TEXT NOT NULL,
    source_type VARCHAR(20) DEFAULT 'link' CHECK (source_type IN ('link', 'device')),
    description TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMMUNITY FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name VARCHAR(100) NOT NULL,
    author_handle VARCHAR(100),
    author_role VARCHAR(100) DEFAULT 'Community Member',
    avatar_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date VARCHAR(50) DEFAULT 'Just now',
    content TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    likes INTEGER DEFAULT 0,
    hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LIVE CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('topson', 'user')),
    sender_name VARCHAR(100) NOT NULL,
    user_id TEXT,
    user_email VARCHAR(255),
    target_user_id TEXT,
    text TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON public.feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public videos can be viewed by everyone" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public feedbacks can be viewed by everyone" ON public.feedbacks FOR SELECT USING (hidden = false OR auth.role() = 'service_role');
CREATE POLICY "Public chat can be viewed by everyone" ON public.messages FOR SELECT USING (true);

-- Insert policies for users and moderation
CREATE POLICY "Anyone can submit feedback" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send a chat message" ON public.messages FOR INSERT WITH CHECK (true);
