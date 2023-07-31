import express from 'express';
import bodyParser from 'body-parser';
import { buildDatabaseSchema } from './databaseUtils';
import userRoutes from './routes/userRoutes'; 
import postsRoutes from './routes/postsRoutes';

const app = express();
app.use(bodyParser.json());

// Call the function to build the database schema on server startup
buildDatabaseSchema();

// Use the userRoutes for '/users' related routes
app.use('/users', userRoutes);
app.use('/posts', postsRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
