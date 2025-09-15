const express = require('express');
const router = express.Router();
const {
  importAllData,
  exportAllData,
  clearAllData,
  getSampleData
} = require('../controllers/importExportController');

// GET /api/import-export/sample - Get sample data template
router.get('/sample', getSampleData);

// POST /api/import-export/import - Import all data from JSON
router.post('/import', importAllData);

// GET /api/import-export/export - Export all data as JSON
router.get('/export', exportAllData);

// DELETE /api/import-export/clear - Clear all data
router.delete('/clear', clearAllData);

module.exports = router;
