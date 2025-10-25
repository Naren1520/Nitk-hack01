-- Insert sample departments and courses
INSERT INTO profiles (id, email, first_name, last_name, role, department, student_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@campuslink.edu', 'System', 'Administrator', 'admin', 'Administration', NULL),
    ('550e8400-e29b-41d4-a716-446655440002', 'dr.smith@campuslink.edu', 'John', 'Smith', 'faculty', 'Computer Science', NULL),
    ('550e8400-e29b-41d4-a716-446655440003', 'jane.doe@student.campuslink.edu', 'Jane', 'Doe', 'student', 'Computer Science', 'CS2024001'),
    ('550e8400-e29b-41d4-a716-446655440004', 'mike.wilson@student.campuslink.edu', 'Mike', 'Wilson', 'student', 'Computer Science', 'CS2024002');

-- Insert sample content
INSERT INTO content (title, description, content_type, content_data, department, target_audience, created_by, is_featured) VALUES
    ('Welcome to Campus Link', 'Official welcome message to new students', 'announcement', 
     '{"message": "Welcome to Campus Link! Your comprehensive college management platform."}', 
     'Administration', ARRAY['students'], '550e8400-e29b-41d4-a716-446655440001', true),
    
    ('Data Structures Course Material', 'Complete course materials for CS101', 'material',
     '{"syllabus": "Complete data structures curriculum", "resources": ["textbook", "assignments"]}',
     'Computer Science', ARRAY['students'], '550e8400-e29b-41d4-a716-446655440002', false),
     
    ('Midterm Exam Schedule', 'Updated schedule for all midterm examinations', 'announcement',
     '{"schedule": "Midterms start from March 15th"}',
     'Administration', ARRAY['students', 'faculty'], '550e8400-e29b-41d4-a716-446655440001', true);

-- Insert sample events
INSERT INTO events (title, description, event_type, location, start_time, end_time, organizer_id, is_public) VALUES
    ('Tech Fest 2024', 'Annual technology festival with competitions and workshops', 'Festival', 'Main Campus', 
     NOW() + INTERVAL '30 days', NOW() + INTERVAL '33 days', '550e8400-e29b-41d4-a716-446655440001', true),
    
    ('Data Science Workshop', 'Hands-on workshop on machine learning basics', 'Workshop', 'Lab Building A', 
     NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 3 hours', '550e8400-e29b-41d4-a716-446655440002', true),
     
    ('Student Council Elections', 'Annual student council election process', 'Election', 'Student Center', 
     NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 8 hours', '550e8400-e29b-41d4-a716-446655440001', true);

-- Insert sample exam
INSERT INTO exams (title, description, course_code, department, duration, status, scheduled_at, created_by, questions) VALUES
    ('Data Structures Midterm', 'Midterm examination for Data Structures course', 'CS101', 'Computer Science', 120, 'scheduled',
     NOW() + INTERVAL '10 days', '550e8400-e29b-41d4-a716-446655440002',
     '[
         {
             "id": 1,
             "type": "multiple_choice",
             "question": "What is the time complexity of searching in a balanced binary search tree?",
             "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
             "correct_answer": 1,
             "points": 10
         },
         {
             "id": 2,
             "type": "multiple_choice", 
             "question": "Which data structure follows Last-In-First-Out (LIFO) principle?",
             "options": ["Queue", "Stack", "Array", "Linked List"],
             "correct_answer": 1,
             "points": 10
         }
     ]'::jsonb);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'Welcome to Campus Link!', 'Your account has been successfully created. Explore all the features available.', 'success'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Upcoming Exam', 'You have a Data Structures midterm exam scheduled for next week.', 'info'),
    ('550e8400-e29b-41d4-a716-446655440004', 'New Assignment Posted', 'A new assignment has been posted for your Computer Science course.', 'info');

-- Insert sample documents
INSERT INTO documents (title, content, status, created_by, department, is_collaborative) VALUES
    ('Course Syllabus - Data Structures', 'Comprehensive syllabus covering all topics in data structures...', 'published', 
     '550e8400-e29b-41d4-a716-446655440002', 'Computer Science', false),
    
    ('Student Group Project Guidelines', 'Guidelines and requirements for group projects...', 'published',
     '550e8400-e29b-41d4-a716-446655440002', 'Computer Science', true),
     
    ('Shared Study Notes', 'Collaborative study notes for upcoming exams...', 'published',
     '550e8400-e29b-41d4-a716-446655440003', 'Computer Science', true);

-- Insert sample user settings
INSERT INTO user_settings (user_id, theme, font_size, notifications_enabled) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'dark', 'medium', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'light', 'large', true),
    ('550e8400-e29b-41d4-a716-446655440003', 'system', 'medium', true),
    ('550e8400-e29b-41d4-a716-446655440004', 'light', 'medium', true);