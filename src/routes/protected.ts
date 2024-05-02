import express from 'express';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the dashboard.', user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
  });

  res.send('You have logged out');
});

export const protectedRoutes = router;
