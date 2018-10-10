const express = require('express');
const Assignment = require('../models/assignment');

const router = express.Router();

router.get('/download/:id', async (req, res) => {
  const assignment = await Assignment.findOne({ _id: req.params.id });
  if (!assignment) {
    return res.sendStatus(404);
  }
  const workbook = await assignment.exportEvaluations();
  res.attachment(`${assignment.name}.xlsx`);
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
});

module.exports = router;
