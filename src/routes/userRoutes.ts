import express, { Request, Response } from 'express';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydatabase.db');

const router = express.Router();

// @route   POST api/users
// @desc    Creates a new user
// @access  Public
router.post('/', (req: Request, res: Response) => {
  // Assuming the request body contains the necessary user data (username, email, password)
  const { username, email, password } = req.body;

  // Insert the new user record into the "users" table
  const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`;
  db.run(insertQuery, [username, email, password], (err: Error | null) => {
    if (err) {
      console.error('Error creating the user:', err.message);
      return res.status(500).json({ error: 'Error creating the user.' });
    }

    return res.status(201).json({ message: 'User created successfully.' });
  });
});

// @route   GET api/users
// @desc    Gets all users
// @access  Public
router.get('/', (req: Request, res: Response) => {
  // Retrieve all users from the "users" table
  const selectQuery = 'SELECT * FROM users;';
  db.all(selectQuery, (err: Error | null, rows: any[]) => {
    if (err) {
      console.error('Error retrieving users:', err.message);
      return res.status(500).json({ error: 'Error retrieving users.' });
    }

    return res.status(200).json(rows);
  });
});

// @route   GET api/users/:id
// @desc    Gets a user by ID
// @access  Public
router.get('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;

  // Check if the provided ID is a valid integer
  if (!Number.isInteger(Number(userId))) {
    return res.status(400).json({ error: 'Invalid user ID. Must be a valid integer.' });
  }

  // Retrieve the user from the "users" table
  const selectQuery = 'SELECT * FROM users WHERE id = ?;';
  db.get(selectQuery, userId, (err: Error | null, row: any) => {
    if (err) {
      console.error('Error retrieving user:', err.message);
      return res.status(500).json({ error: 'Error retrieving user.' });
    }

    if (!row) {
      // User with the specified ID was not found
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json(row);
  });
});


  // @route   DELETE api/users/:id
  // @desc    Deletes a user at an id
  // @access  Public
  router.delete('/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
  
    // Check if the provided ID is a valid integer
    if (!Number.isInteger(Number(userId))) {
      return res.status(400).json({ error: 'Invalid user ID. Must be a valid integer.' });
    }
    const deleteQuery = 'DELETE FROM users WHERE id = ?;';
    db.run(deleteQuery, userId, function (err: Error | null, context: any) {
      if (err) {
        console.error('Error deleting user:', err.message);
        return res.status(500).json({ error: 'Error deleting user.' });
      }
  
      // Check if any rows were affected (user with the specified ID was found and deleted)
      if (context?.changes === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully.' });
    });
  });

    // @route   POST api/users/:id
    // @desc    Updates a user at an id
    // @access  Public
    router.post('/:id', (req: Request, res: Response) => {
      const userId = req.params.id;
    
      // Check if the provided ID is a valid integer
      if (!Number.isInteger(Number(userId))) {
        return res.status(400).json({ error: 'Invalid user ID. Must be a valid integer.' });
      }
    
      // Retrieve the updated user data from the request body
      const { username, email, password } = req.body;
    
      // Update the user in the "users" table
      const updateQuery = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?;';
      db.run(updateQuery, [username, email, password, userId], function (err: Error | null, context: any) {
        if (err) {
          console.error('Error updating user:', err.message);
          return res.status(500).json({ error: 'Error updating user.' });
        }
    
        // Check if any rows were affected (user with the specified ID was found and updated)
        if (context?.changes === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }
    
        return res.status(200).json({ message: 'User updated successfully.' });
      });
    });
    
export default router;
