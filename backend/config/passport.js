import passport from 'passport';
import { Strategy as Auth0Strategy } from 'passport-auth0';
import Admin from '../models/Admin.js';

// Configure Auth0 strategy
passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      try {
        
        // Extract email from Auth0 profile
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile.email;
        
        // Check if email is in admin whitelist
        const adminEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim());
        const isAdmin = adminEmails.includes(email);
        
        // Reject if not an authorized admin
        if (!isAdmin) {
          return done(null, false, { message: 'Unauthorized access' });
        }
        
        // Find existing admin or create new one
        let admin = await Admin.findOne({ email });
        
        if (!admin) {
          admin = await Admin.create({
            email: email,
            provider: 'auth0',
            providerId: profile.id,
            displayName: profile.displayName || profile.nickname || email,
            profilePicture: profile.picture || ''
          });
        }
        
        // Return admin user
        return done(null, admin);
        
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.findById(id);
    done(null, admin);
  } catch (error) {
    done(error, null);
  }
});

export default passport;