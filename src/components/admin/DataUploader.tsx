import React, { useState } from 'react';
import { Button } from '../ui/button';
import { uploadMockDataToFirestore, updateCollection } from '@/utils/firestoreUtils';
import { TIMETABLE_DATA, UPCOMING_EVENTS, FACILITIES_DATA, MONTHLY_HIGHLIGHTS, CLUB_EVENTS } from '../data/campusLifeData';

export default function DataUploader() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });

  const handleUploadAll = async () => {
    setLoading(true);
    try {
      const result = await uploadMockDataToFirestore();
      if (result.success) {
        setStatus({ message: result.message, type: 'success' });
      } else {
        setStatus({ message: result.error || 'Upload failed', type: 'error' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setStatus({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCollection = async (collectionName: string, data: any[]) => {
    setLoading(true);
    try {
      const result = await updateCollection(collectionName, data);
      if (result.success) {
        setStatus({ message: `${collectionName} uploaded successfully!`, type: 'success' });
      } else {
        setStatus({ message: result.error || 'Upload failed', type: 'error' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setStatus({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      
      <div className="grid gap-4">
        <Button
          onClick={handleUploadAll}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Uploading...' : 'Upload All Data to Firestore'}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={() => handleUploadCollection('timetables', TIMETABLE_DATA)}
            disabled={loading}
            variant="outline"
          >
            Upload Timetables
          </Button>

          <Button
            onClick={() => handleUploadCollection('events', UPCOMING_EVENTS)}
            disabled={loading}
            variant="outline"
          >
            Upload Events
          </Button>

          <Button
            onClick={() => handleUploadCollection('facilities', FACILITIES_DATA)}
            disabled={loading}
            variant="outline"
          >
            Upload Facilities
          </Button>

          <Button
            onClick={() => handleUploadCollection('monthlyHighlights', MONTHLY_HIGHLIGHTS)}
            disabled={loading}
            variant="outline"
          >
            Upload Monthly Highlights
          </Button>

          <Button
            onClick={() => handleUploadCollection('clubEvents', CLUB_EVENTS)}
            disabled={loading}
            variant="outline"
          >
            Upload Club Events
          </Button>
        </div>
      </div>

      {status.message && (
        <div
          className={`mt-4 p-4 rounded ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}