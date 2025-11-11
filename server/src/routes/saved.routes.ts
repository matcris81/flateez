import { Router } from 'express';
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get saved properties
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'savedProperties',
      populate: {
        path: 'landlordId',
        select: 'firstName lastName email phone'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.savedProperties || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved properties' });
  }
});

// Save a property
router.post('/:propertyId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already saved
    if (user.savedProperties?.includes(propertyId as any)) {
      return res.status(400).json({ error: 'Property already saved' });
    }

    // Add to saved properties
    if (!user.savedProperties) {
      user.savedProperties = [];
    }
    user.savedProperties.push(propertyId as any);
    await user.save();

    res.json({ message: 'Property saved successfully', saved: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save property' });
  }
});

// Unsave a property
router.delete('/:propertyId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove from saved properties
    if (user.savedProperties) {
      user.savedProperties = user.savedProperties.filter(
        (id) => id.toString() !== propertyId
      );
      await user.save();
    }

    res.json({ message: 'Property removed from saved', saved: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove saved property' });
  }
});

// Check if property is saved
router.get('/check/:propertyId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSaved = user.savedProperties?.some(
      (id) => id.toString() === propertyId
    ) || false;

    res.json({ saved: isSaved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check saved status' });
  }
});

export default router;
