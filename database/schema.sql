CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    role VARCHAR(50)
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100),
    question TEXT,
    weight INT
);

CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    user_id INT,
    question_id INT,
    answer VARCHAR(20)
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INT,
    score INT,
    percentage FLOAT,
    risk_level VARCHAR(50)
);

CREATE TABLE question_compliance_mapping (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,

    iso_standard VARCHAR(255),
    nist_standard VARCHAR(255),
    pci_standard VARCHAR(255),

    soc2_standard VARCHAR(255),
    gdpr_standard VARCHAR(255),
    hipaa_standard VARCHAR(255),
    cobit_standard VARCHAR(255),

    cis_control VARCHAR(255)
);
CREATE TABLE findings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,

    weakness TEXT,
    severity VARCHAR(50),
    recommendation TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);