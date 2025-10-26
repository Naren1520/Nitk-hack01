import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, authorize } from '../middleware/auth';
import Event from '../models/Event';

const router = express.Router();

// Get all events
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const events = await Event.findAll({
      where: {
        isPublic: true
      },
      include: ['organizer']
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// Create new event
router.post(
  '/',
  [
    auth,
    authorize(['admin', 'faculty']),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('eventType').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
  ],
  async (req: any, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const event = await Event.create({
        ...req.body,
        organizerId: req.user.id
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Error creating event' });
    }
  }
);

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: ['organizer']
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event' });
  }
});

// Update event
router.put(
  '/:id',
  [
    auth,
    authorize(['admin', 'faculty']),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('startTime').optional().isISO8601(),
    body('endTime').optional().isISO8601(),
  ],
  async (req: any, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const event = await Event.findByPk(req.params.id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this event' });
      }

      await event.update(req.body);

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: 'Error updating event' });
    }
  }
);

// Delete event
router.delete('/:id', [auth, authorize(['admin', 'faculty'])], async (req: any, res: express.Response) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await event.destroy();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

export default router;