import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import Agent from '../models/Agent.js';
import ListItem from '../models/ListItem.js';
import Distribution from '../models/Distribution.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload and distribute list
export const uploadAndDistribute = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get agents
    const agents = await Agent.find();
    
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents available for distribution' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    // Create distribution record
    const distribution = new Distribution({
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      status: 'processing',
    });
    
    await distribution.save();

    // Process file based on extension
    let items = [];
    
    if (fileExt === '.csv') {
      items = await processCSV(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      items = await processExcel(filePath);
    } else {
      // Clean up file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    // Validate data
    if (!validateListItems(items)) {
      // Update distribution status
      distribution.status = 'failed';
      await distribution.save();
      
      // Clean up file
      fs.unlinkSync(filePath);
      
      return res.status(400).json({ message: 'Invalid data format. Required columns: FirstName, Phone, Notes' });
    }

    // Distribute items among agents
    await distributeItems(items, agents, distribution);

    // Update distribution status
    distribution.status = 'completed';
    distribution.totalItems = items.length;
    await distribution.save();

    // Clean up file
    fs.unlinkSync(filePath);

    res.status(200).json({ 
      message: 'File uploaded and distributed successfully',
      distribution: {
        id: distribution._id,
        fileName: distribution.originalFileName,
        totalItems: items.length
      }
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    next(error);
  }
};

// Process CSV file
const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Process Excel file
const processExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Validate list items
const validateListItems = (items) => {
  if (items.length === 0) return false;
  
  // Check first item for required fields
  const firstItem = items[0];
  
  // Check for different possible column name formats
  const hasFirstName = 
    'FirstName' in firstItem || 
    'First Name' in firstItem || 
    'firstName' in firstItem || 
    'first_name' in firstItem;
    
  const hasPhone = 
    'Phone' in firstItem || 
    'phone' in firstItem || 
    'PhoneNumber' in firstItem || 
    'phone_number' in firstItem;
    
  const hasNotes = 
    'Notes' in firstItem || 
    'notes' in firstItem || 
    'Note' in firstItem || 
    'note' in firstItem;
  
  return hasFirstName && hasPhone;  // Notes can be optional
};

// Distribute items among agents
const distributeItems = async (items, agents, distribution) => {
  const agentCount = agents.length;
  const itemsPerAgent = Math.floor(items.length / agentCount);
  const remainingItems = items.length % agentCount;
  
  let itemIndex = 0;
  const listItems = [];

  for (let i = 0; i < agentCount; i++) {
    const agent = agents[i];
    const assignedItemCount = i < remainingItems ? itemsPerAgent + 1 : itemsPerAgent;
    
    for (let j = 0; j < assignedItemCount && itemIndex < items.length; j++) {
      const item = items[itemIndex];
      
      // Normalize field names
      const firstName = 
        item.FirstName || 
        item['First Name'] || 
        item.firstName || 
        item.first_name || '';
        
      const phone = 
        item.Phone || 
        item.phone || 
        item.PhoneNumber || 
        item.phone_number || '';
        
      const notes = 
        item.Notes || 
        item.notes || 
        item.Note || 
        item.note || '';
      
      // Create list item
      const listItem = new ListItem({
        firstName,
        phone,
        notes,
        assignedTo: agent._id,
        distribution: distribution._id,
      });
      
      await listItem.save();
      
      // Add item to agent's assigned items
      agent.assignedItems.push(listItem._id);
      
      // Add item to distribution items
      distribution.items.push(listItem._id);
      
      listItems.push(listItem);
      itemIndex++;
    }
    
    // Save agent with updated assigned items
    await agent.save();
  }
  
  return listItems;
};

// Get list items for an agent
export const getAgentListItems = async (req, res, next) => {
  try {
    const { agentId } = req.params;
    
    const agent = await Agent.findById(agentId).select('-password');
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    const listItems = await ListItem.find({ assignedTo: agentId })
      .populate('distribution', 'fileName originalFileName')
      .sort({ createdAt: -1 });
    
    res.status(200).json(listItems);
  } catch (error) {
    next(error);
  }
};