CREATE TABLE customer (
    id BIGSERIAL PRIMARY KEY,
    created_dt TIMESTAMP NOT NULL,
    first_name VARCHAR(32),
    last_name VARCHAR(32)
);