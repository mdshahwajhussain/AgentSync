import Distribution from '../models/Distribution.js';
import ListItem from '../models/ListItem.js';

// Get all distributions
export const getDistributions = async (req, res, next) => {
  try {
    const distributions = await Distribution.find()
      .sort({ createdAt: -1 })
      .select('fileName status totalItems createdAt');
    
    // Format response
    const formattedDistributions = distributions.map(dist => ({
      _id: dist._id,
      fileName: dist.fileName,
      status: dist.status,
      totalItems: dist.totalItems,
      date: dist.createdAt
    }));
    
    res.status(200).json(formattedDistributions);
  } catch (error) {
    next(error);
  }
};

// Get distribution by ID
export const getDistributionById = async (req, res, next) => {
  try {
    const distribution = await Distribution.findById(req.params.id);
    
    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    
    res.status(200).json(distribution);
  } catch (error) {
    next(error);
  }
};

// Get distribution details with items
export const getDistributionDetails = async (req, res, next) => {
  try {
    const distribution = await Distribution.findById(req.params.id);
    
    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    
    // Get items grouped by agent
    const items = await ListItem.find({ distribution: distribution._id })
      .populate('assignedTo', 'name email')
      .sort({ assignedTo: 1 });
    
    // Group items by agent
    const itemsByAgent = {};
    
    items.forEach(item => {
      const agentId = item.assignedTo?._id.toString();
      
      if (!itemsByAgent[agentId]) {
        itemsByAgent[agentId] = {
          agent: {
            id: agentId,
            name: item.assignedTo?.name,
            email: item.assignedTo?.email,
          },
          items: [],
        };
      }
      
      itemsByAgent[agentId].items.push({
        id: item._id,
        firstName: item.firstName,
        phone: item.phone,
        notes: item.notes,
      });
    });
    
    const result = {
      distribution: {
        id: distribution._id,
        fileName: distribution.originalFileName,
        status: distribution.status,
        totalItems: distribution.totalItems,
        date: distribution.createdAt,
      },
      agentDistribution: Object.values(itemsByAgent),
    };
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};