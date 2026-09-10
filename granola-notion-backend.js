const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

app.use(express.json());

// Environment variables (set in Vercel dashboard)
const GRANOLA_API_KEY = process.env.GRANOLA_API_KEY;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // Meeting Notes DB ID
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

/**
 * Main webhook endpoint: receives Granola webhook when note is created
 */
app.post('/api/granola-webhook', async (req, res) => {
  try {
    console.log('Webhook received:', req.body);

    // Granola webhook payload structure
    const { note_id, workspace_id } = req.body;

    if (!note_id) {
      return res.status(400).json({ error: 'No note_id in webhook' });
    }

    // Step 1: Fetch full note from Granola
    const noteData = await
