const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  joinTripByShareSlug,
  addTripMember,
  listTripMembers,
  removeTripMember,
  createTripNote,
  listTripNotes,
  updateTripNote,
  deleteTripNote,
  createPackingItem,
  listPackingItems,
  updatePackingItem,
  deletePackingItem
} = require('../controllers/tripCollaborationController');

router.post('/join/:shareSlug', verifyToken, async (req, res) => {
  try {
    const result = await joinTripByShareSlug(req.params.shareSlug, req.userId);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/:tripId/members', verifyToken, async (req, res) => {
  try {
    const result = await listTripMembers(req.params.tripId, req.userId);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/:tripId/members', verifyToken, async (req, res) => {
  try {
    const result = await addTripMember(req.params.tripId, req.body, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(201).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.delete('/:tripId/members/:memberUserId', verifyToken, async (req, res) => {
  try {
    const result = await removeTripMember(req.params.tripId, req.params.memberUserId, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/:tripId/notes', verifyToken, async (req, res) => {
  try {
    const result = await listTripNotes(req.params.tripId, req.userId);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/:tripId/notes', verifyToken, async (req, res) => {
  try {
    const result = await createTripNote(req.params.tripId, req.body, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(201).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/notes/:noteId', verifyToken, async (req, res) => {
  try {
    const result = await updateTripNote(req.params.noteId, req.body, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.delete('/notes/:noteId', verifyToken, async (req, res) => {
  try {
    const result = await deleteTripNote(req.params.noteId, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/:tripId/packing-items', verifyToken, async (req, res) => {
  try {
    const result = await listPackingItems(req.params.tripId, req.userId);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/:tripId/packing-items', verifyToken, async (req, res) => {
  try {
    const result = await createPackingItem(req.params.tripId, req.body, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(201).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/packing-items/:itemId', verifyToken, async (req, res) => {
  try {
    const result = await updatePackingItem(req.params.itemId, req.body, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.delete('/packing-items/:itemId', verifyToken, async (req, res) => {
  try {
    const result = await deletePackingItem(req.params.itemId, req.userId);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
