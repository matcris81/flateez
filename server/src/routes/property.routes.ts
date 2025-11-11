import { Router } from 'express';
import { Property } from '../models/Property.js';
import { authenticate, requireLandlord, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, propertyType } = req.query;
    const filter: any = { available: true };

    if (city) filter['address.city'] = new RegExp(city as string, 'i');
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (propertyType) filter.propertyType = propertyType;

    const properties = await Property.find(filter)
      .populate('landlordId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId', 'firstName lastName email phone bio');
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

router.post('/', authenticate, requireLandlord, async (req: AuthRequest, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      landlordId: req.userId
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

router.put('/:id', authenticate, requireLandlord, async (req: AuthRequest, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, landlordId: req.userId },
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

router.delete('/:id', authenticate, requireLandlord, async (req: AuthRequest, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      landlordId: req.userId
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
