-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins and faculty can create notifications" ON notifications FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view published documents or their own" ON documents FOR SELECT USING (
    status = 'published' OR 
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM document_collaborators 
        WHERE document_id = id AND user_id = auth.uid()
    )
);
CREATE POLICY "Faculty and admins can create documents" ON documents FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Document creators can update their documents" ON documents FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM document_collaborators 
        WHERE document_id = id AND user_id = auth.uid() AND permission IN ('write', 'admin')
    )
);
CREATE POLICY "Document creators can delete their documents" ON documents FOR DELETE USING (created_by = auth.uid());

-- Document collaborators policies
CREATE POLICY "Collaborators can view document collaborations" ON document_collaborators FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM documents 
        WHERE id = document_id AND created_by = auth.uid()
    )
);
CREATE POLICY "Document creators can manage collaborators" ON document_collaborators FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM documents 
        WHERE id = document_id AND created_by = auth.uid()
    )
);
CREATE POLICY "Document creators can update collaborators" ON document_collaborators FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM documents 
        WHERE id = document_id AND created_by = auth.uid()
    )
);
CREATE POLICY "Document creators can remove collaborators" ON document_collaborators FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM documents 
        WHERE id = document_id AND created_by = auth.uid()
    )
);

-- Exams policies
CREATE POLICY "Students can view scheduled/active exams, faculty can view all" ON exams FOR SELECT USING (
    status IN ('scheduled', 'active') OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Faculty and admins can create exams" ON exams FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Exam creators can update their exams" ON exams FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Exam creators can delete their exams" ON exams FOR DELETE USING (created_by = auth.uid());

-- Exam attempts policies
CREATE POLICY "Students can view their own attempts, faculty can view all" ON exam_attempts FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Students can create their own exam attempts" ON exam_attempts FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update their own attempts" ON exam_attempts FOR UPDATE USING (student_id = auth.uid());

-- Content policies
CREATE POLICY "Users can view published content" ON content FOR SELECT USING (
    publish_date <= NOW() AND (expiry_date IS NULL OR expiry_date > NOW())
);
CREATE POLICY "Faculty and admins can create content" ON content FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Content creators can update their content" ON content FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Content creators can delete their content" ON content FOR DELETE USING (created_by = auth.uid());

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Alarms policies
CREATE POLICY "Users can manage their own alarms" ON alarms FOR ALL USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view public events" ON events FOR SELECT USING (is_public = true);
CREATE POLICY "Faculty and admins can create events" ON events FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Event organizers can update their events" ON events FOR UPDATE USING (organizer_id = auth.uid());
CREATE POLICY "Event organizers can delete their events" ON events FOR DELETE USING (organizer_id = auth.uid());

-- Event registrations policies
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own registrations" ON event_registrations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can cancel their own registrations" ON event_registrations FOR DELETE USING (user_id = auth.uid());

-- Analytics policies
CREATE POLICY "Users can create analytics data" ON analytics FOR INSERT WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "Admins can view all analytics" ON analytics FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Performance metrics policies
CREATE POLICY "Users can view their own metrics, faculty can view all" ON performance_metrics FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);
CREATE POLICY "Faculty and admins can create performance metrics" ON performance_metrics FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'faculty')
    )
);