-- Add Customer Foreign Keys
ALTER TABLE customer
    ADD CONSTRAINT fk_customer_utility
        FOREIGN KEY (utility_id) REFERENCES utility(utility_id);

-- Add Customer_Vehicle Constraints
ALTER TABLE customer_vehicle
    ADD CONSTRAINT fk_vehicle_customer
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    ADD CONSTRAINT unique_vehicle_customer
        UNIQUE (customer_id);

-- Add Plug_Session Foreign Keys
ALTER TABLE plug_session
    ADD CONSTRAINT fk_session_vehicle
        FOREIGN KEY (customer_vehicle_id) REFERENCES customer_vehicle(customer_vehicle_id),
    ADD CONSTRAINT fk_session_plug_in
        FOREIGN KEY (plug_in_id) REFERENCES plug_in(plug_in_id),
    ADD CONSTRAINT fk_session_plug_out
        FOREIGN KEY (plug_out_id) REFERENCES plug_out(plug_out_id);

-- Add DR_Event Foreign Keys
ALTER TABLE dr_event
    ADD CONSTRAINT fk_dr_event_utility
        FOREIGN KEY (utility_id) REFERENCES utility(utility_id);

-- Add Schedule Foreign Keys
ALTER TABLE schedule
    ADD CONSTRAINT fk_schedule_vehicle
        FOREIGN KEY (customer_vehicle_id) REFERENCES customer_vehicle(customer_vehicle_id),
    ADD CONSTRAINT fk_schedule_plug_session
        FOREIGN KEY (plug_session_id) REFERENCES plug_session(plug_session_id),
    ADD CONSTRAINT uq_schedule_plug_session
        UNIQUE (plug_session_id); -- Ensures 1 session = 1 schedule

-- Add Customer_DR_Event Foreign Keys and Constraints
ALTER TABLE customer_dr_event
    ADD CONSTRAINT fk_customer_dr_event_main
        FOREIGN KEY (dr_event_id) REFERENCES dr_event(dr_event_id),
    ADD CONSTRAINT fk_customer_dr_vehicle
        FOREIGN KEY (customer_vehicle_id) REFERENCES customer_vehicle(customer_vehicle_id),
    ADD CONSTRAINT fk_customer_dr_session
        FOREIGN KEY (plug_session_id) REFERENCES plug_session(plug_session_id),
    ADD CONSTRAINT uq_customer_dr_session
        UNIQUE (plug_session_id); -- Ensures 1 session = 1 DR event