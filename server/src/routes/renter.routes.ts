import { Router } from 'express';
import { User } from '../models/User.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const renters = await User.find({ userType: 'renter' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(renters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renters' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const renter = await User.findOne({ 
      _id: req.params.id, 
      userType: 'renter' 
    }).select('-password');
    
    if (!renter) {
      return res.status(404).json({ error: 'Renter not found' });
    }

    res.json(renter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renter' });
  }
});

export default router;
