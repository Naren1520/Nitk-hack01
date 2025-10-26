import { uploadCollectionData, clearCollection } from '../firebase/admin';
import {
  TIMETABLE_DATA,
  UPCOMING_EVENTS,
  FACILITIES_DATA,
  MONTHLY_HIGHLIGHTS,
  CLUB_EVENTS,
} from '../data/mockData';

async function populateDatabase() {
  try {
    // Define collections to populate
    const collections = [
      { name: 'timetables', data: TIMETABLE_DATA },
      { name: 'events', data: UPCOMING_EVENTS },
      { name: 'facilities', data: FACILITIES_DATA },
      { name: 'highlights', data: MONTHLY_HIGHLIGHTS },
      { name: 'clubEvents', data: CLUB_EVENTS },
    ];

    // Clear and repopulate each collection
    for (const collection of collections) {
      console.log(`Processing collection: ${collection.name}`);
      
      // Clear existing data
      await clearCollection(collection.name);
      
      // Upload new data
      await uploadCollectionData(collection.name, collection.data);
      
      console.log(`Completed processing: ${collection.name}`);
    }

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

// Run the population script
populateDatabase();