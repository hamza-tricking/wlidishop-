// Files are stored with a relative path (/files/<name>) so the API domain can change freely.
const toFile = (f) => ({
  path: `/files/${f.filename}`,
  url: `${process.env.API_URL || ''}/files/${f.filename}`,
  filename: f.filename,
  size: f.size,
  mimetype: f.mimetype,
});

exports.handleUpload = (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length === 0) return res.status(400).json({ message: 'No file selected' });
  const out = files.map(toFile);
  res.json(req.file ? out[0] : { files: out });
};
