/*
  # Create bookmarks table

  1. New Tables
    - `bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text, bookmark or memo)
      - `url` (text, nullable)
      - `title` (text)
      - `site_name` (text, nullable)
      - `description` (text, nullable)
      - `thumbnail` (text, nullable)
      - `custom_image` (text, nullable)
      - `memo` (text, nullable)
      - `tags` (text array)
      - `is_bookmarked` (boolean)
      - `view_count` (integer)
      - `last_viewed_at` (timestamp, nullable)
      - `ogp_data` (jsonb, nullable)
      - `image_source` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookmarks` table
    - Add policies for users to manage their own bookmarks

  3. Indexes
    - Add indexes for performance optimization
*/

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('bookmark', 'memo')),
  url text,
  title text NOT NULL,
  site_name text,
  description text,
  thumbnail text,
  custom_image text,
  memo text,
  tags text[] DEFAULT '{}',
  is_bookmarked boolean DEFAULT false,
  view_count integer DEFAULT 0,
  last_viewed_at timestamptz,
  ogp_data jsonb,
  image_source text DEFAULT 'fallback' CHECK (image_source IN ('ogp', 'custom', 'fallback')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON bookmarks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_type ON bookmarks(type);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_bookmarked ON bookmarks(is_bookmarked);