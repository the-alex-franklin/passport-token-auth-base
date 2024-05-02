import './env';
import './passport/config';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { notProtectedRoutes } from './routes/not-protected';
import { isAuthenticated } from './middleware/isAuthenticated';
import { protectedRoutes } from './routes/protected';
import { errorMiddleware } from './middleware/error';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await mongoose.connect('mongodb://localhost:27017/passport-test-drive')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

app.use(passport.initialize());

app.use(notProtectedRoutes);
app.use(isAuthenticated);
app.use(protectedRoutes);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
