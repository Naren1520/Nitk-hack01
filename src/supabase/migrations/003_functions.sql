-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role
    );
    
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'unread_notifications', (
            SELECT COUNT(*) FROM notifications 
            WHERE user_id = user_uuid AND read = false
        ),
        'upcoming_exams', (
            SELECT COUNT(*) FROM exams 
            WHERE status = 'scheduled' 
            AND scheduled_at > NOW() 
            AND scheduled_at < NOW() + INTERVAL '7 days'
        ),
        'active_documents', (
            SELECT COUNT(*) FROM documents 
            WHERE created_by = user_uuid 
            AND status = 'published'
        ),
        'upcoming_events', (
            SELECT COUNT(*) FROM events 
            WHERE is_public = true 
            AND start_time > NOW() 
            AND start_time < NOW() + INTERVAL '7 days'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    target_user_id UUID,
    notification_title TEXT,
    notification_message TEXT,
    notification_type TEXT DEFAULT 'info',
    action_url TEXT DEFAULT NULL,
    expires_in_hours INTEGER DEFAULT 24
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, title, message, type, action_url, expires_at
    ) VALUES (
        target_user_id, 
        notification_title, 
        notification_message, 
        notification_type::notification_type,
        action_url,
        NOW() + (expires_in_hours || ' hours')::INTERVAL
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to broadcast notification to multiple users
CREATE OR REPLACE FUNCTION broadcast_notification(
    user_ids UUID[],
    notification_title TEXT,
    notification_message TEXT,
    notification_type TEXT DEFAULT 'info',
    action_url TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    user_id UUID;
    count INTEGER := 0;
BEGIN
    FOREACH user_id IN ARRAY user_ids LOOP
        PERFORM create_notification(
            user_id, 
            notification_title, 
            notification_message, 
            notification_type, 
            action_url
        );
        count := count + 1;
    END LOOP;
    
    RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get exam statistics
CREATE OR REPLACE FUNCTION get_exam_statistics(exam_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_attempts', COUNT(*),
        'completed_attempts', COUNT(*) FILTER (WHERE is_completed = true),
        'average_score', ROUND(AVG(score), 2),
        'highest_score', MAX(score),
        'lowest_score', MIN(score),
        'average_time', ROUND(AVG(time_taken), 2)
    ) INTO result
    FROM exam_attempts 
    WHERE exam_id = exam_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate AI exam questions (placeholder for OpenAI integration)
CREATE OR REPLACE FUNCTION generate_exam_questions(
    source_document_ids UUID[],
    question_count INTEGER DEFAULT 10,
    difficulty_level TEXT DEFAULT 'medium'
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    doc_content TEXT;
BEGIN
    -- This is a placeholder function
    -- In a real implementation, this would call OpenAI API
    -- For now, return sample questions
    
    SELECT json_build_object(
        'questions', json_build_array(
            json_build_object(
                'id', 1,
                'type', 'multiple_choice',
                'question', 'Sample AI generated question?',
                'options', json_build_array('Option A', 'Option B', 'Option C', 'Option D'),
                'correct_answer', 0,
                'points', 10
            )
        ),
        'metadata', json_build_object(
            'generated_at', NOW(),
            'source_documents', source_document_ids,
            'difficulty', difficulty_level,
            'total_questions', question_count
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update content view count
CREATE OR REPLACE FUNCTION increment_content_views(content_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE content 
    SET view_count = view_count + 1 
    WHERE id = content_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete expired notifications
    DELETE FROM notifications 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old analytics data (older than 6 months)
    DELETE FROM analytics 
    WHERE created_at < NOW() - INTERVAL '6 months';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;