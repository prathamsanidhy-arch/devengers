const { folders, documents } = require('../data');
const crypto = require('crypto');

const getDefaultFolders = () => [
  'Identity', 'Transport', 'Revenue', 'Education', 'Healthcare', 'Finance', 'Property', 'Certificates', 'Other'
];

const getFolders = (req, res) => {
  const myFolders = folders.filter(f => f.userId === req.user._id);
  res.json({ success: true, data: { defaultFolders: getDefaultFolders(), customFolders: myFolders } });
};

const createFolder = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Folder name is required' });

  if (getDefaultFolders().includes(name) || folders.some(f => f.userId === req.user._id && f.name === name)) {
    return res.status(400).json({ success: false, message: 'Folder name already exists' });
  }

  const newFolder = {
    id: crypto.randomUUID(),
    userId: req.user._id,
    name,
    createdAt: new Date().toISOString()
  };
  
  folders.push(newFolder);
  res.status(201).json({ success: true, data: newFolder });
};

const updateFolder = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Folder name is required' });

  const folder = folders.find(f => f.id === id && f.userId === req.user._id);
  if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

  if (getDefaultFolders().includes(name) || folders.some(f => f.userId === req.user._id && f.name === name && f.id !== id)) {
    return res.status(400).json({ success: false, message: 'Folder name already exists' });
  }

  const oldName = folder.name;
  folder.name = name;

  // Update documents inside this folder
  documents.forEach(doc => {
    if (doc.userId === req.user._id && doc.folder === oldName) {
      doc.folder = name;
    }
  });

  res.json({ success: true, data: folder });
};

const deleteFolder = (req, res) => {
  const { id } = req.params;
  const folderIndex = folders.findIndex(f => f.id === id && f.userId === req.user._id);
  if (folderIndex === -1) return res.status(404).json({ success: false, message: 'Folder not found' });

  const folderName = folders[folderIndex].name;
  
  // Move documents back to 'All Documents' / null folder
  documents.forEach(doc => {
    if (doc.userId === req.user._id && doc.folder === folderName) {
      doc.folder = 'Other';
    }
  });

  folders.splice(folderIndex, 1);
  res.json({ success: true, message: 'Folder deleted' });
};

module.exports = {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder
};
