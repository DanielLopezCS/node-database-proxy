import express, { Request, Response } from 'express';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydatabase.db');

const router = express.Router();

// @route   POST api/posts
// @desc    Creates a new post
// @access  Public
router.post('/', (req: Request, res: Response) => {
  // Assuming the request body contains the necessary post data (title, body)
  const { title, body } = req.body;

  // Insert the new post record into the "posts" table
  const insertQuery = `INSERT INTO posts (title, body) VALUES (?, ?);`;
  db.run(insertQuery, [title, body], (err: Error | null) => {
    if (err) {
      console.error('Error creating the post:', err.message);
      return res.status(500).json({ error: 'Error creating the post.' });
    }

    return res.status(201).json({ message: 'Post created successfully.' });
  });
});

// @route   GET api/posts
// @desc    Gets all posts
// @access  Public
router.get('/', (req: Request, res: Response) => {
  // Retrieve all posts from the "posts" table
  const selectQuery = 'SELECT * FROM posts;';
  db.all(selectQuery, (err: Error | null, rows: any[]) => {
    if (err) {
      console.error('Error retrieving posts:', err.message);
      return res.status(500).json({ error: 'Error retrieving posts.' });
    }

    return res.status(200).json(rows);
  });
});

// @route   DELETE api/posts/:id
// @desc    Deletes a post at an id
// @access  Public
router.delete('/:id', (req: Request, res: Response) => {
  const postId = req.params.id;

  // Check if the provided ID is a valid integer
  if (!Number.isInteger(Number(postId))) {
    return res.status(400).json({ error: 'Invalid post ID. Must be a valid integer.' });
  }

  const deleteQuery = 'DELETE FROM posts WHERE id = ?;';
  db.run(deleteQuery, postId, function (err: Error | null, context: any) {
    if (err) {
      console.error('Error deleting post:', err.message);
      return res.status(500).json({ error: 'Error deleting post.' });
    }

    // Check if any rows were affected (post with the specified ID was found and deleted)
    if (context?.changes === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    return res.status(200).json({ message: 'Post deleted successfully.' });
  });
});

// @route   POST api/posts/:id
// @desc    Updates a post at an id
// @access  Public
router.post('/:id', (req: Request, res: Response) => {
  const postId = req.params.id;

  // Check if the provided ID is a valid integer
  if (!Number.isInteger(Number(postId))) {
    return res.status(400).json({ error: 'Invalid post ID. Must be a valid integer.' });
  }

  // Retrieve the updated post data from the request body
  const { title, body } = req.body;

  // Update the post in the "posts" table
  const updateQuery = 'UPDATE posts SET title = ?, body = ? WHERE id = ?;';
  db.run(updateQuery, [title, body, postId], function (err: Error | null, context: any) {
    if (err) {
      console.error('Error updating post:', err.message);
      return res.status(500).json({ error: 'Error updating post.' });
    }

    // Check if any rows were affected (post with the specified ID was found and updated)
    if (context?.changes === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    return res.status(200).json({ message: 'Post updated successfully.' });
  });
});

export default router;
