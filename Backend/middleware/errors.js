export function notFound(req, res) { res.status(404).json({ message: 'Route not found' }); }
export function errorHandler(error, req, res, next) {
  if (error?.code === 11000) return res.status(409).json({ message: 'A record with these details already exists' });
  if (error?.name === 'ValidationError' || error?.name === 'ZodError') return res.status(400).json({ message: 'Please check the submitted information' });
  console.error(error);
  res.status(500).json({ message: 'An unexpected server error occurred' });
}
