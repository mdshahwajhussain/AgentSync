import Agent from '../models/Agent.js';
import Distribution from '../models/Distribution.js';
import ListItem from '../models/ListItem.js';

// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalAgents = await Agent.countDocuments();
    const totalLists = await Distribution.countDocuments();
    const totalItems = await ListItem.countDocuments();
    
    // Get distribution status
    const distributedItems = await ListItem.countDocuments({ assignedTo: { $exists: true, $ne: null } });
    const pendingItems = totalItems - distributedItems;
    
    const stats = {
      totalAgents,
      totalLists,
      totalItems,
      distributionStatus: {
        distributed: distributedItems,
        pending: pendingItems
      }
    };
    
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};