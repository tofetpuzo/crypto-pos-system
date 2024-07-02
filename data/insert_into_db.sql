-- create a table to store the payment gateway data

CREATE TABLE payment_gateway_data (
    id SERIAL PRIMARY KEY,
    payment_gateway_name VARCHAR(255) NOT NULL,
    payment_gateway_id VARCHAR(255) NOT NULL,
    payment_gateway_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- insert custom data into the table
INSERT INTO payment_gateway_data (payment_gateway_name, payment_gateway_id, payment_gateway_data)
VALUES ('paypal
', '123456
', '{"payment
": "paypal
", "payment_id
": "123456
", "payment_data
": {"amount
": 100, "currency
": "USD"}}');

