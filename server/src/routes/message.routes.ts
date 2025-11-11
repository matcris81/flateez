import { Router } from 'express';
import { Message } from '../models/Message.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }]
    })
      .populate('senderId', 'firstName lastName avatar')
      .populate('receiverId', 'firstName lastName avatar')
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { receiverId, propertyId, content } = req.body;
    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      propertyId,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, receiverId: req.userId },
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

export default router;
