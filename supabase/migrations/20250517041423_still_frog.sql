/*
  # Create agents table and related security policies

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, unique, not null)
      - `mobile` (text, not null)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `agents` table
    - Add policies for authenticated users to:
      - Read all agents
      - Create new agents
      - Update agents they created
      - Delete agents they created
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  mobile text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all agents" 
  ON agents 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create agents" 
  ON agents 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own agents" 
  ON agents 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own agents" 
  ON agents 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();