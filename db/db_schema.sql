-- Table: photos
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    original_width_px INTEGER NOT NULL,
    original_height_px INTEGER NOT NULL
);

-- Table: characters
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    photo_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    x1_percent NUMERIC(5, 2) NOT NULL,
    y1_percent NUMERIC(5, 2) NOT NULL,
    x2_percent NUMERIC(5, 2) NOT NULL,
    y2_percent NUMERIC(5, 2) NOT NULL,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

-- Table: scores
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    photo_id INTEGER NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    time_taken_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
); 