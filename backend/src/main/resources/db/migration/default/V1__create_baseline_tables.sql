-- Create Utility Table
CREATE TABLE utility (
                         utility_id BIGSERIAL PRIMARY KEY,
                         utility_name VARCHAR(255) NOT NULL,
                         program_name VARCHAR(255) NOT NULL,
                         program_type VARCHAR(2) CHECK (program_type IN ('DR', 'DP')) NOT NULL,
                         program_details JSONB,
                         sign_up_incentive NUMERIC(5,2),
                         ongoing_incentive NUMERIC(5,2)
);

-- Create Customer Table
CREATE TABLE customer (
                          customer_id BIGSERIAL PRIMARY KEY,
                          utility_id BIGINT,
                          first_name VARCHAR(255) NOT NULL,
                          last_name VARCHAR(255) NOT NULL,
                          password VARCHAR(255) NOT NULL,
                          email VARCHAR(255) UNIQUE NOT NULL,
                          created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          enrollment_status VARCHAR(50)
);

-- Create Customer Vehicle Table
CREATE TABLE customer_vehicle (
                                  customer_vehicle_id BIGSERIAL PRIMARY KEY,
                                  customer_id BIGINT,
                                  nickname VARCHAR(255),
                                  model_name VARCHAR(255),
                                  model_year INTEGER,
                                  encoded_photo TEXT
);

-- Create DR Event Table
CREATE TABLE dr_event (
                          dr_event_id BIGSERIAL PRIMARY KEY,
                          utility_id BIGINT,
                          dr_event_date TIMESTAMP NOT NULL,
                          dr_event_window JSONB NOT NULL
);

-- Create Customer DR Event Table
CREATE TABLE customer_dr_event (
                                   customer_dr_event_id BIGSERIAL PRIMARY KEY,
                                   dr_event_id BIGINT,
                                   plug_session_id BIGINT NOT NULL, -- References the session
                                   customer_vehicle_id BIGINT,
                                   dr_event_overridden BOOLEAN DEFAULT FALSE,
                                   kwh_shifted NUMERIC(10, 4) DEFAULT 0.0000
);

-- Create Schedule Table
CREATE TABLE schedule (
                          schedule_id BIGSERIAL PRIMARY KEY,
                          plug_session_id BIGINT NOT NULL,
                          customer_vehicle_id BIGINT,
                          schedule_date TIMESTAMP NOT NULL,
                          schedule_overridden BOOLEAN DEFAULT FALSE,
                          actual_savings NUMERIC(10, 2) DEFAULT 0.00,
                          potential_savings NUMERIC(10, 2) DEFAULT 0.00,
                          kwh_shifted NUMERIC(10, 4) DEFAULT 0.0000,
                          charge_windows JSONB
);

-- Create Plug In Table
CREATE TABLE plug_in (
                         plug_in_id BIGSERIAL PRIMARY KEY,
                         plug_in_time TIMESTAMP NOT NULL,
                         battery_percentage_at_plug_in INTEGER CHECK (battery_percentage_at_plug_in BETWEEN 0 AND 100)
);

-- Create Plug Out Table
CREATE TABLE plug_out (
                          plug_out_id BIGSERIAL PRIMARY KEY,
                          plug_out_time TIMESTAMP NOT NULL,
                          battery_percentage_at_plug_out INTEGER CHECK (battery_percentage_at_plug_out BETWEEN 0 AND 100)
);

-- Create Plug Session Table
CREATE TABLE plug_session (
                          plug_session_id BIGSERIAL PRIMARY KEY,
                          customer_vehicle_id BIGINT NOT NULL,
                          plug_in_id BIGINT NOT NULL,
                          plug_out_id BIGINT,
                          is_active_session BOOLEAN DEFAULT TRUE
);
