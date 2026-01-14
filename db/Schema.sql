CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'free', 
    credits INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);

CREATE TABLE summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    summary_type VARCHAR(50) NOT NULL, 
    summary_content JSONB NOT NULL, 
    diagram_content JSONB, 
    storage_path VARCHAR(255), 
    credits_used INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expire_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '1 month')
);

CREATE INDEX idx_summaries_user_id ON summaries(user_id);
CREATE INDEX idx_summaries_expire_at ON summaries(expire_at);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL, 
    amount DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' 
);

CREATE INDEX idx_payments_user_id ON payments(user_id);

CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
    chunk_id INT NOT NULL, 
    vector FLOAT8[] NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_embeddings_summary_id ON embeddings(summary_id);
CREATE INDEX idx_embeddings_chunk_id ON embeddings(chunk_id);

CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

ALTER TABLE users
DROP COLUMN password_hash;

ALTER TABLE users
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN status VARCHAR(20) DEFAULT 'active';