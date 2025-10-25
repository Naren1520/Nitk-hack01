import { useState, useEffect } from 'react';
import { 
  announcementsApi, 
  coursesApi, 
  eventsApi, 
  complaintsApi,
  helpApi,
  lostFoundApi,
  achievementsApi,
  wifiApi,
  studyApi,
  facilitiesApi
} from '../services/mockApi';
import { 
  Announcement, 
  Course, 
  Event, 
  Complaint, 
  HelpQuestion, 
  LostFoundItem, 
  Achievement, 
  WiFiRequest, 
  StudySession, 
  Facility 
} from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

// Generic hook for data fetching
export function useDataFetch<T>(
  fetchFunction: () => Promise<{ data: T; status: string; message: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction();
      if (response.status === 'success') {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}

// Announcements hook
export function useAnnouncements() {
  const { data, loading, error, refetch } = useDataFetch(
    () => announcementsApi.getAnnouncements(),
    []
  );

  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'views' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await announcementsApi.createAnnouncement(announcement);
      if (response.status === 'success') {
        toast.success('Announcement created successfully');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to create announcement');
      return false;
    }
  };

  return {
    announcements: data?.data || [],
    loading,
    error,
    refetch,
    createAnnouncement
  };
}

// Courses hook
export function useCourses() {
  const { data, loading, error, refetch } = useDataFetch(
    () => coursesApi.getCourses(),
    []
  );

  const enrollInCourse = async (courseId: string) => {
    try {
      const response = await coursesApi.enrollInCourse('current-user-id', courseId);
      if (response.status === 'success') {
        toast.success('Successfully enrolled in course');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to enroll in course');
      return false;
    }
  };

  return {
    courses: data || [],
    loading,
    error,
    refetch,
    enrollInCourse
  };
}

// Events hook
export function useEvents() {
  const { data, loading, error, refetch } = useDataFetch(
    () => eventsApi.getEvents(),
    []
  );

  const registerForEvent = async (eventId: string) => {
    try {
      const response = await eventsApi.registerForEvent('current-user-id', eventId);
      if (response.status === 'success') {
        toast.success('Successfully registered for event');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to register for event');
      return false;
    }
  };

  return {
    events: data || [],
    loading,
    error,
    refetch,
    registerForEvent
  };
}

// Complaints hook
export function useComplaints() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDataFetch(
    () => complaintsApi.getComplaints(user?.id || ''),
    [user?.id]
  );

  const submitComplaint = async (complaint: Omit<Complaint, 'id' | 'status' | 'submitted_by' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please login to submit complaint');
      return false;
    }

    try {
      const response = await complaintsApi.submitComplaint({
        ...complaint,
        submitted_by: user.id
      });
      if (response.status === 'success') {
        toast.success('Complaint submitted successfully');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to submit complaint');
      return false;
    }
  };

  return {
    complaints: data || [],
    loading,
    error,
    refetch,
    submitComplaint
  };
}

// Help Questions hook
export function useHelpQuestions() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDataFetch(
    () => helpApi.getQuestions(),
    []
  );

  const submitQuestion = async (question: Omit<HelpQuestion, 'id' | 'is_solved' | 'views' | 'likes' | 'author_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please login to submit question');
      return false;
    }

    try {
      const response = await helpApi.submitQuestion({
        ...question,
        author_id: user.id
      });
      if (response.status === 'success') {
        toast.success('Question submitted successfully');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to submit question');
      return false;
    }
  };

  return {
    questions: data || [],
    loading,
    error,
    refetch,
    submitQuestion
  };
}

// Lost & Found hook
export function useLostFound() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDataFetch(
    () => lostFoundApi.getItems(),
    []
  );

  const reportItem = async (item: Omit<LostFoundItem, 'id' | 'status' | 'reported_by' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please login to report item');
      return false;
    }

    try {
      const response = await lostFoundApi.reportItem({
        ...item,
        reported_by: user.id
      });
      if (response.status === 'success') {
        toast.success('Item reported successfully');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to report item');
      return false;
    }
  };

  return {
    items: data || [],
    loading,
    error,
    refetch,
    reportItem
  };
}

// Achievements hook
export function useAchievements() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDataFetch(
    () => achievementsApi.getAchievements(),
    []
  );

  const submitAchievement = async (achievement: Omit<Achievement, 'id' | 'verified' | 'views' | 'likes' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Please login to submit achievement');
      return false;
    }

    try {
      const response = await achievementsApi.submitAchievement({
        ...achievement,
        user_id: user.id
      });
      if (response.status === 'success') {
        toast.success('Achievement submitted for review');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to submit achievement');
      return false;
    }
  };

  return {
    achievements: data || [],
    loading,
    error,
    refetch,
    submitAchievement
  };
}

// WiFi Requests hook
export function useWiFiRequests() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDataFetch(
    () => wifiApi.getRequests(user?.id || ''),
    [user?.id]
  );

  const submitRequest = async (request: Omit<WiFiRequest, 'id' | 'status' | 'requested_by' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please login to submit WiFi request');
      return false;
    }

    try {
      const response = await wifiApi.submitRequest({
        ...request,
        requested_by: user.id
      });
      if (response.status === 'success') {
        toast.success('WiFi request submitted successfully');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to submit WiFi request');
      return false;
    }
  };

  return {
    requests: data || [],
    loading,
    error,
    refetch,
    submitRequest
  };
}

// Study Sessions hook
export function useStudySessions() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDataFetch(
    () => studyApi.getSessions(user?.id || ''),
    [user?.id]
  );

  const createSession = async (session: Omit<StudySession, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('Please login to record study session');
      return false;
    }

    try {
      const response = await studyApi.createSession({
        ...session,
        user_id: user.id
      });
      if (response.status === 'success') {
        toast.success('Study session recorded');
        refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      toast.error('Failed to record study session');
      return false;
    }
  };

  return {
    sessions: data || [],
    loading,
    error,
    refetch,
    createSession
  };
}

// Facilities hook
export function useFacilities() {
  const { data, loading, error, refetch } = useDataFetch(
    () => facilitiesApi.getFacilities(),
    []
  );

  return {
    facilities: data || [],
    loading,
    error,
    refetch
  };
}

// Real-time data hook for live updates
export function useRealTimeData() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { lastUpdate };
}