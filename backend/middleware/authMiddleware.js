// Middleware to check if user is authenticated admin
export const isAuthenticated = (req, res, next) => {
  
  // Check if user is logged in via passport
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Return unauthorized if not authenticated
  res.status(401).json({ 
    error: 'Unauthorized. Admin access required.' 
  });
};