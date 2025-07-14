-- Update the calendar_settings_dwd2024 table to remove the embed_code column if it exists
-- and keep only the booking_url column

-- First, make sure we have at least one record
INSERT INTO calendar_settings_dwd2024 (booking_url)
VALUES ('https://tidycal.com/dwd/clarity-call')
ON CONFLICT DO NOTHING;