import Agent from '../models/Agent.js';

// Get all agents
export const getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().select('-password');
    res.status(200).json(agents);
  } catch (error) {
    next(error);
  }
};

// Get agent by ID
export const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.status(200).json(agent);
  } catch (error) {
    next(error);
  }
};

// Create new agent
export const createAgent = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if agent with email already exists
    const existingAgent = await Agent.findOne({ email });
    
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    const agent = new Agent({
      name,
      email,
      mobile,
      password,
    });

    await agent.save();

    // Don't send password back in response
    const agentResponse = {
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
    };

    res.status(201).json(agentResponse);
  } catch (error) {
    next(error);
  }
};

// Update agent
export const updateAgent = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Find agent
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if updating email and if it's already taken
    if (email && email !== agent.email) {
      const existingAgent = await Agent.findOne({ email });
      
      if (existingAgent) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Update fields
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;
    if (password) agent.password = password;

    await agent.save();

    // Don't send password back in response
    const agentResponse = {
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
    };

    res.status(200).json(agentResponse);
  } catch (error) {
    next(error);
  }
};

// Delete agent
export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get agent count
export const getAgentCount = async (req, res, next) => {
  try {
    const count = await Agent.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};