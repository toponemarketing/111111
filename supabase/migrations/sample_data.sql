/*
  # Sample Data for Property Management System

  1. Sample Data
    - Profiles (landlords and tenants)
    - Properties
    - Units
    - Leases
    - Maintenance requests
    - Payments
    - Notifications
    - Comments
*/

-- Sample Landlord Profiles
INSERT INTO profiles (id, created_at, updated_at, first_name, last_name, email, phone, role, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', now(), now(), 'John', 'Smith', 'john.smith@example.com', '555-123-4567', 'landlord', 'https://randomuser.me/api/portraits/men/1.jpg'),
  ('00000000-0000-0000-0000-000000000002', now(), now(), 'Sarah', 'Johnson', 'sarah.johnson@example.com', '555-987-6543', 'landlord', 'https://randomuser.me/api/portraits/women/1.jpg');

-- Sample Tenant Profiles
INSERT INTO profiles (id, created_at, updated_at, first_name, last_name, email, phone, role, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000003', now(), now(), 'Michael', 'Brown', 'michael.brown@example.com', '555-111-2222', 'tenant', 'https://randomuser.me/api/portraits/men/2.jpg'),
  ('00000000-0000-0000-0000-000000000004', now(), now(), 'Emily', 'Davis', 'emily.davis@example.com', '555-333-4444', 'tenant', 'https://randomuser.me/api/portraits/women/2.jpg'),
  ('00000000-0000-0000-0000-000000000005', now(), now(), 'David', 'Wilson', 'david.wilson@example.com', '555-555-6666', 'tenant', 'https://randomuser.me/api/portraits/men/3.jpg'),
  ('00000000-0000-0000-0000-000000000006', now(), now(), 'Jessica', 'Martinez', 'jessica.martinez@example.com', '555-777-8888', 'tenant', 'https://randomuser.me/api/portraits/women/3.jpg'),
  ('00000000-0000-0000-0000-000000000007', now(), now(), 'Robert', 'Anderson', 'robert.anderson@example.com', '555-999-0000', 'tenant', 'https://randomuser.me/api/portraits/men/4.jpg');

-- Sample Properties
INSERT INTO properties (id, created_at, updated_at, landlord_id, name, address, city, state, zip, description, image_url)
VALUES
  ('00000000-0000-0000-0000-000000000101', now(), now(), '00000000-0000-0000-0000-000000000001', 'Sunset Apartments', '123 Sunset Blvd', 'Los Angeles', 'CA', '90001', 'Modern apartment complex with great amenities', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'),
  ('00000000-0000-0000-0000-000000000102', now(), now(), '00000000-0000-0000-0000-000000000001', 'Riverside Condos', '456 River St', 'Chicago', 'IL', '60601', 'Luxury condos with river views', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'),
  ('00000000-0000-0000-0000-000000000103', now(), now(), '00000000-0000-0000-0000-000000000002', 'Mountain View Homes', '789 Mountain Rd', 'Denver', 'CO', '80201', 'Beautiful homes with mountain views', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg');

-- Sample Units
INSERT INTO units (id, created_at, updated_at, property_id, unit_number, bedrooms, bathrooms, square_feet, rent_amount, status, description, image_url)
VALUES
  ('00000000-0000-0000-0000-000000000201', now(), now(), '00000000-0000-0000-0000-000000000101', '101', 1, 1, 750, 1200, 'occupied', 'Cozy 1-bedroom apartment with balcony', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'),
  ('00000000-0000-0000-0000-000000000202', now(), now(), '00000000-0000-0000-0000-000000000101', '102', 2, 2, 1000, 1800, 'occupied', 'Spacious 2-bedroom apartment with modern kitchen', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'),
  ('00000000-0000-0000-0000-000000000203', now(), now(), '00000000-0000-0000-0000-000000000101', '103', 2, 1, 900, 1600, 'vacant', 'Bright 2-bedroom apartment with city views', 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'),
  ('00000000-0000-0000-0000-000000000204', now(), now(), '00000000-0000-0000-0000-000000000102', '201', 3, 2, 1500, 2500, 'occupied', 'Luxury 3-bedroom condo with river views', 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'),
  ('00000000-0000-0000-0000-000000000205', now(), now(), '00000000-0000-0000-0000-000000000102', '202', 2, 2, 1200, 2200, 'maintenance', 'Modern 2-bedroom condo with updated appliances', 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'),
  ('00000000-0000-0000-0000-000000000206', now(), now(), '00000000-0000-0000-0000-000000000103', '301', 4, 3, 2000, 3000, 'occupied', 'Spacious 4-bedroom home with mountain views', 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg');

-- Sample Leases
INSERT INTO leases (id, created_at, updated_at, unit_id, tenant_id, start_date, end_date, rent_amount, security_deposit, rent_due_day, late_fee_amount, late_fee_days, status, document_url)
VALUES
  ('00000000-0000-0000-0000-000000000301', now(), now(), '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000003', '2023-01-01', '2024-01-01', 1200, 1200, 1, 50, 5, 'active', 'https://example.com/lease-301.pdf'),
  ('00000000-0000-0000-0000-000000000302', now(), now(), '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000004', '2023-02-15', '2024-02-15', 1800, 1800, 1, 75, 5, 'active', 'https://example.com/lease-302.pdf'),
  ('00000000-0000-0000-0000-000000000303', now(), now(), '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000005', '2023-03-01', '2024-03-01', 2500, 2500, 1, 100, 5, 'active', 'https://example.com/lease-303.pdf'),
  ('00000000-0000-0000-0000-000000000304', now(), now(), '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000006', '2023-04-15', '2024-04-15', 2200, 2200, 1, 90, 5, 'active', 'https://example.com/lease-304.pdf'),
  ('00000000-0000-0000-0000-000000000305', now(), now(), '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000007', '2023-05-01', '2024-05-01', 3000, 3000, 1, 120, 5, 'active', 'https://example.com/lease-305.pdf');

-- Sample Payments
INSERT INTO payments (id, created_at, updated_at, lease_id, tenant_id, amount, payment_date, due_date, payment_method, status, transaction_id, notes, late_fee)
VALUES
  ('00000000-0000-0000-0000-000000000401', now(), now(), '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000003', 1200, '2023-06-01', '2023-06-01', 'credit_card', 'completed', 'txn_123456', 'June rent', null),
  ('00000000-0000-0000-0000-000000000402', now(), now(), '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000003', 1200, '2023-07-01', '2023-07-01', 'credit_card', 'completed', 'txn_234567', 'July rent', null),
  ('00000000-0000-0000-0000-000000000403', now(), now(), '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000003', 1250, '2023-08-07', '2023-08-01', 'credit_card', 'completed', 'txn_345678', 'August rent (late)', 50),
  ('00000000-0000-0000-0000-000000000404', now(), now(), '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000004', 1800, '2023-06-01', '2023-06-01', 'paypal', 'completed', 'txn_456789', 'June rent', null),
  ('00000000-0000-0000-0000-000000000405', now(), now(), '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000004', 1800, '2023-07-01', '2023-07-01', 'paypal', 'completed', 'txn_567890', 'July rent', null),
  ('00000000-0000-0000-0000-000000000406', now(), now(), '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000004', 1800, '2023-08-01', '2023-08-01', 'paypal', 'completed', 'txn_678901', 'August rent', null),
  ('00000000-0000-0000-0000-000000000407', now(), now(), '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000005', 2500, '2023-06-01', '2023-06-01', 'venmo', 'completed', 'txn_789012', 'June rent', null),
  ('00000000-0000-0000-0000-000000000408', now(), now(), '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000005', 2500, '2023-07-01', '2023-07-01', 'venmo', 'completed', 'txn_890123', 'July rent', null),
  ('00000000-0000-0000-0000-000000000409', now(), now(), '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000005', 2500, '2023-08-01', '2023-08-01', 'venmo', 'pending', null, 'August rent', null),
  ('00000000-0000-0000-0000-000000000410', now(), now(), '00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000006', 2200, '2023-06-01', '2023-06-01', 'cash', 'completed', 'txn_901234', 'June rent', null),
  ('00000000-0000-0000-0000-000000000411', now(), now(), '00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000006', 2200, '2023-07-01', '2023-07-01', 'cash', 'completed', 'txn_012345', 'July rent', null),
  ('00000000-0000-0000-0000-000000000412', now(), now(), '00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000007', 3000, '2023-06-01', '2023-06-01', 'credit_card', 'completed', 'txn_123456', 'June rent', null),
  ('00000000-0000-0000-0000-000000000413', now(), now(), '00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000007', 3000, '2023-07-01', '2023-07-01', 'credit_card', 'completed', 'txn_234567', 'July rent', null),
  ('00000000-0000-0000-0000-000000000414', now(), now(), '00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000007', 3000, '2023-08-01', '2023-08-01', 'credit_card', 'pending', null, 'August rent', null);

-- Sample Maintenance Requests
INSERT INTO maintenance_requests (id, created_at, updated_at, unit_id, tenant_id, title, description, priority, status, completed_at, notes)
VALUES
  ('00000000-0000-0000-0000-000000000501', now(), now(), '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000003', 'Leaking faucet in bathroom', 'The bathroom sink faucet is leaking constantly. Water is dripping even when turned off completely.', 'medium', 'completed', now() - interval '5 days', 'Replaced washer and fixed leak.'),
  ('00000000-0000-0000-0000-000000000502', now(), now(), '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000003', 'Broken light fixture in kitchen', 'The ceiling light in the kitchen is not working. I changed the bulb but it still doesn''t work.', 'low', 'open', null, null),
  ('00000000-0000-0000-0000-000000000503', now(), now(), '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000004', 'AC not cooling properly', 'The air conditioner is running but not cooling the apartment. It''s very hot inside.', 'high', 'in_progress', null, 'Technician scheduled for tomorrow.'),
  ('00000000-0000-0000-0000-000000000504', now(), now(), '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000005', 'Dishwasher not draining', 'The dishwasher fills with water but doesn''t drain properly. There''s standing water after each cycle.', 'medium', 'open', null, null),
  ('00000000-0000-0000-0000-000000000505', now(), now(), '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000006', 'Water damage on ceiling', 'There''s a water stain on the ceiling in the living room that seems to be growing. Might be a leak from upstairs.', 'emergency', 'in_progress', null, 'Plumber identified leak from unit above. Repairs in progress.'),
  ('00000000-0000-0000-0000-000000000506', now(), now(), '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000007', 'Garage door not opening', 'The automatic garage door opener isn''t working. I can''t get my car out of the garage.', 'high', 'completed', now() - interval '2 days', 'Replaced garage door opener motor.');

-- Sample Maintenance Comments
INSERT INTO maintenance_comments (id, created_at, maintenance_request_id, user_id, comment)
VALUES
  ('00000000-0000-0000-0000-000000000601', now() - interval '7 days', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000003', 'The leak is getting worse. Can someone please come fix it soon?'),
  ('00000000-0000-0000-0000-000000000602', now() - interval '6 days', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', 'I''ll send a plumber tomorrow morning between 9-11am. Will you be home?'),
  ('00000000-0000-0000-0000-000000000603', now() - interval '6 days', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000003', 'Yes, I''ll be home. Thank you!'),
  ('00000000-0000-0000-0000-000000000604', now() - interval '5 days', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', 'The plumber has fixed the leak. Please let me know if you have any further issues.'),
  ('00000000-0000-0000-0000-000000000605', now() - interval '3 days', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000004', 'It''s getting really hot in here. Can you please expedite this repair?'),
  ('00000000-0000-0000-0000-000000000606', now() - interval '2 days', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', 'I''ve scheduled an HVAC technician for tomorrow. In the meantime, I''ll drop off a portable AC unit this evening.'),
  ('00000000-0000-0000-0000-000000000607', now() - interval '2 days', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000004', 'Thank you, that would be very helpful!'),
  ('00000000-0000-0000-0000-000000000608', now() - interval '1 day', '00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000006', 'The water stain is getting bigger and now there''s a drip. This is urgent!'),
  ('00000000-0000-0000-0000-000000000609', now() - interval '1 day', '00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000002', 'I''m sending an emergency plumber right away. They should be there within the hour.'),
  ('00000000-0000-0000-0000-000000000610', now() - interval '1 day', '00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000002', 'The plumber found a leak in the unit above. We''re working on repairs now and will fix your ceiling once the leak is resolved.');

-- Sample Maintenance Images
INSERT INTO maintenance_images (id, created_at, maintenance_request_id, image_url, description)
VALUES
  ('00000000-0000-0000-0000-000000000701', now() - interval '7 days', '00000000-0000-0000-0000-000000000501', 'https://images.pexels.com/photos/1027508/pexels-photo-1027508.jpeg', 'Leaking bathroom faucet'),
  ('00000000-0000-0000-0000-000000000702', now() - interval '3 days', '00000000-0000-0000-0000-000000000503', 'https://images.pexels.com/photos/4397831/pexels-photo-4397831.jpeg', 'AC unit not cooling'),
  ('00000000-0000-0000-0000-000000000703', now() - interval '2 days', '00000000-0000-0000-0000-000000000505', 'https://images.pexels.com/photos/5980800/pexels-photo-5980800.jpeg', 'Water damage on ceiling'),
  ('00000000-0000-0000-0000-000000000704', now() - interval '2 days', '00000000-0000-0000-0000-000000000505', 'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg', 'Close-up of water damage');

-- Sample Notifications
INSERT INTO notifications (id, created_at, user_id, title, message, type, is_read, related_id)
VALUES
  ('00000000-0000-0000-0000-000000000801', now() - interval '7 days', '00000000-0000-0000-0000-000000000003', 'Maintenance Request Update', 'Your maintenance request for "Leaking faucet in bathroom" has been received.', 'maintenance', true, '00000000-0000-0000-0000-000000000501'),
  ('00000000-0000-0000-0000-000000000802', now() - interval '5 days', '00000000-0000-0000-0000-000000000003', 'Maintenance Request Completed', 'Your maintenance request for "Leaking faucet in bathroom" has been completed.', 'maintenance', true, '00000000-0000-0000-0000-000000000501'),
  ('00000000-0000-0000-0000-000000000803', now() - interval '3 days', '00000000-0000-0000-0000-000000000004', 'Maintenance Request Update', 'Your maintenance request for "AC not cooling properly" is now in progress.', 'maintenance', true, '00000000-0000-0000-0000-000000000503'),
  ('00000000-0000-0000-0000-000000000804', now() - interval '2 days', '00000000-0000-0000-0000-000000000004', 'New Comment on Maintenance Request', 'Your landlord has added a comment to your maintenance request.', 'maintenance', false, '00000000-0000-0000-0000-000000000503'),
  ('00000000-0000-0000-0000-000000000805', now() - interval '1 day', '00000000-0000-0000-0000-000000000005', 'Rent Payment Reminder', 'Your rent payment of $2500 is due on August 1st.', 'payment', false, '00000000-0000-0000-0000-000000000409'),
  ('00000000-0000-0000-0000-000000000806', now() - interval '1 day', '00000000-0000-0000-0000-000000000006', 'Maintenance Emergency Update', 'We''re addressing your emergency maintenance request for "Water damage on ceiling".', 'maintenance', false, '00000000-0000-0000-0000-000000000505'),
  ('00000000-0000-0000-0000-000000000807', now() - interval '1 day', '00000000-0000-0000-0000-000000000001', 'New Maintenance Request', 'A new maintenance request has been submitted for Sunset Apartments - Unit 101.', 'maintenance', false, '00000000-0000-0000-0000-000000000502'),
  ('00000000-0000-0000-0000-000000000808', now() - interval '1 day', '00000000-0000-0000-0000-000000000001', 'Payment Received', 'A rent payment of $1200 has been received from Michael Brown.', 'payment', true, '00000000-0000-0000-0000-000000000403'),
  ('00000000-0000-0000-0000-000000000809', now() - interval '1 day', '00000000-0000-0000-0000-000000000002', 'Emergency Maintenance Alert', 'An emergency maintenance request has been submitted for Riverside Condos - Unit 202.', 'maintenance', true, '00000000-0000-0000-0000-000000000505'),
  ('00000000-0000-0000-0000-000000000810', now() - interval '1 day', '00000000-0000-0000-0000-000000000002', 'Lease Expiring Soon', 'The lease for Jessica Martinez at Riverside Condos - Unit 202 will expire in 30 days.', 'lease', false, '00000000-0000-0000-0000-000000000304');

-- Sample Payment Methods
INSERT INTO payment_methods (id, created_at, updated_at, landlord_id, method_type, is_enabled, account_email, account_username, account_details, instructions)
VALUES
  ('00000000-0000-0000-0000-000000000901', now(), now(), '00000000-0000-0000-0000-000000000001', 'stripe', true, 'john.smith@example.com', null, null, 'Pay securely with credit or debit card'),
  ('00000000-0000-0000-0000-000000000902', now(), now(), '00000000-0000-0000-0000-000000000001', 'paypal', true, 'john.smith@example.com', null, null, 'Send payment to the email address listed'),
  ('00000000-0000-0000-0000-000000000903', now(), now(), '00000000-0000-0000-0000-000000000001', 'venmo', true, null, '@john-smith-landlord', null, 'Send payment to the Venmo username listed'),
  ('00000000-0000-0000-0000-000000000904', now(), now(), '00000000-0000-0000-0000-000000000001', 'cash', true, null, null, null, 'Drop off cash payment at the office during business hours'),
  ('00000000-0000-0000-0000-000000000905', now(), now(), '00000000-0000-0000-0000-000000000002', 'stripe', true, 'sarah.johnson@example.com', null, null, 'Pay securely with credit or debit card'),
  ('00000000-0000-0000-0000-000000000906', now(), now(), '00000000-0000-0000-0000-000000000002', 'paypal', true, 'sarah.johnson@example.com', null, null, 'Send payment to the email address listed'),
  ('00000000-0000-0000-0000-000000000907', now(), now(), '00000000-0000-0000-0000-000000000002', 'bank', true, null, null, 'Bank: Chase, Account: 1234567890, Routing: 987654321', 'Set up direct deposit or bank transfer using the account details provided');
