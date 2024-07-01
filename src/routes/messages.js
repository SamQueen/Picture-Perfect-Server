const express = require('express');
const router = express.Router();
const { getMessagesByConversation, getMessagesBetweenUsers } = require('../db/messageQueries');

// get the latest message of each conversation
router.get('/messagesByConversation' , async (req, res) => {
  const userId = req.query.userId;    
  
  try {
    const messages = await getMessagesByConversation(userId);

    if (messages.status === 'error') {
      console.log('Error getting messages: ' + err);
      res.status(500).json({ message: err });
    }

    res.status(200).json({ message: 'success', messages: messages.data});
  } catch (err) {
    console.log('Error getting messages by conversation: ' + err);
    res.status(500).json({ message: err });
  }
});

// get all of the messages between two users
router.get('/messages' , async (req, res) => {
  const userId = req.query.userId;
  const otherUserId = req.query.otherUserId;
  
  try {
    const messages = await getMessagesBetweenUsers(userId, otherUserId);

    if (messages.status === 'error') {
      console.log('Error getting messages: ' + err);
      res.status(500).json({ message: err });
    }

    res.status(200).json({ message: 'success', messages: messages.data});
  } catch (err) {
    console.log('Error getting messages: ' + err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;