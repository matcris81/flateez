import { Router } from 'express';
import { User } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName, phone, bio, avatar, renterProfile } = req.body;
    
    const updateData: any = {
      firstName,
      lastName,
      phone,
      bio,
      avatar
    };

    // Only update renterProfile if user is a renter
    const user = await User.findById(req.userId);
    if (user?.userType === 'renter' && renterProfile) {
      updateData.renterProfile = renterProfile;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
