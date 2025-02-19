-- Create event_type enum
CREATE TYPE event_type AS ENUM (
    'meeting',
    'appointment',
    'reminder',
    'task',
    'other'
);

-- Create event_status enum
CREATE TYPE event_status AS ENUM (
    'scheduled',
    'cancelled',
    'completed',
    'rescheduled'
);

-- Create reminder_type enum
CREATE TYPE reminder_type AS ENUM (
    'email',
    'notification',
    'sms'
);

-- Create reminder_status enum
CREATE TYPE reminder_status AS ENUM (
    'pending',
    'sent',
    'failed'
);

-- Create calendar_events table
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendees UUID[] NOT NULL DEFAULT '{}',
    location VARCHAR(255),
    event_type event_type NOT NULL DEFAULT 'other',
    status event_status NOT NULL DEFAULT 'scheduled',
    recurrence JSONB,
    reminders UUID[] NOT NULL DEFAULT '{}',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT valid_attendees CHECK (array_length(attendees, 1) IS NULL OR array_length(attendees, 1) > 0)
);

-- Create event_reminders table
CREATE TABLE event_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    remind_at TIMESTAMPTZ NOT NULL,
    reminder_type reminder_type NOT NULL DEFAULT 'email',
    status reminder_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_calendar_events_creator ON calendar_events(creator_id);
CREATE INDEX idx_calendar_events_attendees ON calendar_events USING GIN(attendees);
CREATE INDEX idx_calendar_events_time_range ON calendar_events(start_time, end_time);
CREATE INDEX idx_event_reminders_event ON event_reminders(event_id);
CREATE INDEX idx_event_reminders_remind_at ON event_reminders(remind_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_reminders_updated_at
    BEFORE UPDATE ON event_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 