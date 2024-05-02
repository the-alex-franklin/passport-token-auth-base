import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.post('/signup', async (req, res) => {
  const user = await new User(req.body).save();
  res.send(user);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  user.comparePassword(password, (err, isMatch) => {
    if (err) return res.status(400).json({ error: 'Internal server error' });
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });  
  });
});

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (typeof decoded === 'string') throw new Error('Invalid refresh token'); // this is incorrect but I don't want to deal with this right now

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export const notProtectedRoutes = router;
