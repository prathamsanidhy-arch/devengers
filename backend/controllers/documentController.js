const { documents } = require('../data');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const aiService = require('../services/aiService');
const { logAction, encryptMetadata, decryptMetadata, maskDocumentNumber } = require('../utils/securityUtils');

const uploadDocuments = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const uploadedDocs = [];
  
  for (const file of req.files) {
    let aiMetadata = null;
    try {
      aiMetadata = await aiService.analyzeVaultDocument(file.path, file.mimetype, file.originalname);
    } catch (e) {
      console.error("AI Analysis failed", e);
    }

    const assignedCategory = aiMetadata?.suggestedCategory || 'Other';
    const finalFolder = (req.body.folder && req.body.folder !== 'All Documents' && req.body.folder !== 'Other') ? req.body.folder : assignedCategory;

    const doc = {
      id: crypto.randomUUID(),
      userId: req.user._id,
      originalName: encryptMetadata(file.originalname), // Encrypt original name
      uuidName: file.filename, // UUID stored on disk
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      mimeType: file.mimetype,
      type: file.mimetype.includes('pdf') ? 'pdf' : 'image',
      category: assignedCategory,
      folder: finalFolder,
      uploadDate: new Date().toISOString(),
      lastViewed: null,
      lastDownloaded: null,
      isFavorite: false,
      aiSummary: aiMetadata ? encryptMetadata(JSON.stringify(aiMetadata)) : null // Encrypt AI Metadata
    };
    
    documents.push(doc);
    
    // Prepare unencrypted version to return immediately to frontend
    const returnDoc = { ...doc, originalName: file.originalname, aiSummary: aiMetadata, url: `/api/documents/${doc.id}/view` };
    if (aiMetadata && aiMetadata.documentNumber) {
      // Mask number for default return
      returnDoc.aiSummary.documentNumber = maskDocumentNumber(aiMetadata.documentType, aiMetadata.documentNumber);
    }
    uploadedDocs.push(returnDoc);
    
    logAction(req.user._id, 'UPLOAD_DOCUMENT', { docId: doc.id, folder: finalFolder, category: assignedCategory });
  }

  res.status(201).json({ success: true, data: uploadedDocs });
};

const getMyDocuments = (req, res) => {
  const myDocs = documents.filter(doc => doc.userId === req.user._id);
  
  // Decrypt and mask for list view
  const safeDocs = myDocs.map(doc => {
    let aiSummary = doc.aiSummary ? JSON.parse(decryptMetadata(doc.aiSummary)) : null;
    if (aiSummary && aiSummary.documentNumber) {
      aiSummary.documentNumber = maskDocumentNumber(aiSummary.documentType, aiSummary.documentNumber);
    }
    
    return {
      ...doc,
      originalName: decryptMetadata(doc.originalName),
      aiSummary,
      url: `/api/documents/${doc.id}/view`
    };
  });
  
  res.json({ success: true, data: safeDocs.reverse() });
};

const getDocumentDetails = (req, res) => {
  const { id } = req.params;
  const doc = documents.find(d => d.id === id && d.userId === req.user._id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
  
  logAction(req.user._id, 'VIEW_DETAILS_UNMASKED', { docId: id });

  let aiSummary = doc.aiSummary ? JSON.parse(decryptMetadata(doc.aiSummary)) : null;
  // Intentionally leaving documentNumber UNMASKED here because user is authenticated and explicitly requesting details inside preview
  
  res.json({
    success: true,
    data: {
      ...doc,
      originalName: decryptMetadata(doc.originalName),
      aiSummary,
      url: `/api/documents/${doc.id}/view`
    }
  });
};

const deleteDocument = (req, res) => {
  const { id } = req.params;
  const docIndex = documents.findIndex(doc => doc.id === id && doc.userId === req.user._id);
  
  if (docIndex === -1) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }
  
  const doc = documents[docIndex];
  const filePath = path.join(__dirname, '..', 'uploads', 'documents', doc.uuidName);
  
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting file:", err);
  });

  documents.splice(docIndex, 1);
  logAction(req.user._id, 'DELETE_DOCUMENT', { docId: id });
  res.json({ success: true, message: 'Document deleted successfully' });
};

const updateDocument = (req, res) => {
  const { id } = req.params;
  const { name, folder } = req.body;
  
  const doc = documents.find(d => d.id === id && d.userId === req.user._id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
  
  if (name !== undefined) {
    doc.originalName = encryptMetadata(name);
    logAction(req.user._id, 'RENAME_DOCUMENT', { docId: id });
  }
  if (folder !== undefined) {
    doc.folder = folder;
    logAction(req.user._id, 'MOVE_DOCUMENT', { docId: id, newFolder: folder });
  }
  
  res.json({ success: true, data: { ...doc, originalName: decryptMetadata(doc.originalName) } });
};

const toggleFavorite = (req, res) => {
  const { id } = req.params;
  const doc = documents.find(d => d.id === id && d.userId === req.user._id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
  
  doc.isFavorite = !doc.isFavorite;
  logAction(req.user._id, 'TOGGLE_FAVORITE', { docId: id, isFavorite: doc.isFavorite });
  res.json({ success: true, data: { isFavorite: doc.isFavorite } });
};

// Secure View
const viewDocument = (req, res) => {
  const { id } = req.params;
  const doc = documents.find(d => d.id === id && d.userId === req.user._id);
  
  if (!doc) {
    logAction(req.user._id, 'UNAUTHORIZED_VIEW_ATTEMPT', { docId: id });
    return res.status(404).send('Not found or unauthorized');
  }

  logAction(req.user._id, 'VIEW_DOCUMENT', { docId: id });
  doc.lastViewed = new Date().toISOString();
  
  const filePath = path.join(__dirname, '..', 'uploads', 'documents', doc.uuidName);
  res.setHeader('Content-Type', doc.mimeType);
  res.sendFile(filePath);
};

// Secure Download
const downloadDocument = (req, res) => {
  const { id } = req.params;
  const doc = documents.find(d => d.id === id && d.userId === req.user._id);
  
  if (!doc) {
    logAction(req.user._id, 'UNAUTHORIZED_DOWNLOAD_ATTEMPT', { docId: id });
    return res.status(404).send('Not found or unauthorized');
  }

  logAction(req.user._id, 'DOWNLOAD_DOCUMENT', { docId: id });
  doc.lastDownloaded = new Date().toISOString();
  
  const filePath = path.join(__dirname, '..', 'uploads', 'documents', doc.uuidName);
  const decryptedName = decryptMetadata(doc.originalName);
  res.download(filePath, decryptedName);
};

module.exports = {
  uploadDocuments,
  getMyDocuments,
  getDocumentDetails,
  updateDocument,
  toggleFavorite,
  deleteDocument,
  viewDocument,
  downloadDocument
};
