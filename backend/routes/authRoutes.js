import express from 'express';
import passport from 'passport';

const router = express.Router();

// Initiate Auth0 login
router.get('/login', 
  passport.authenticate('auth0', { 
    scope: 'openid email profile' 
  })
);

// Auth0 callback handler
router.get('/callback',
  passport.authenticate('auth0', { 
    failureRedirect: process.env.CLIENT_URL + '/admin?error=unauthorized'
  }),
  (req, res) => {
    // Successful authentication, redirect to admin
    res.redirect(process.env.CLIENT_URL + '/admin');
  }
);

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        profilePicture: req.user.profilePicture
      }
    });
  }
  
  res.json({ authenticated: false });
});

// Logout admin
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    // Destroy session
    req.session.destroy(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
});

export default router;