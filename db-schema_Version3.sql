-- esquema inicial PostgreSQL
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE athlete_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  age INT,
  height_cm INT,
  weight_kg NUMERIC,
  vo2max NUMERIC,
  ftp_watts INT,
  hr_max INT,
  discipline VARCHAR(50), -- estrada, mtb, triathlon
  level VARCHAR(50), -- iniciante, amador, profissional, elite
  weekly_hours NUMERIC,
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE race_calendar (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  date DATE,
  distance VARCHAR(100),
  target VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE workouts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  date DATE,
  payload JSONB, -- treino estruturado retornado pela IA
  duration_min INT,
  tss_estimate INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50),
  provider_subscription_id VARCHAR(255),
  plan VARCHAR(50),
  status VARCHAR(50),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE oauth_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);