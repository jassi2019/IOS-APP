const { LastRead } = require('../../models');

const createV1 = async (req, res, next) => {
  try {
    const { topicId } = req.body;

    // Validate topicId
    if (!topicId) {
      return res.status(400).json({
        message: 'Validation error',
        error: 'topicId is required',
      });
    }

    // Validate user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Authentication error',
        error: 'User not authenticated',
      });
    }

    const userId = req.user.id;

    // Use upsert to create or update (more reliable than delete + create)
    const [doc, created] = await LastRead.upsert(
      { topicId, userId },
      {
        returning: true,
        conflictFields: ['userId'], // Update if userId already exists
      }
    );

    return res.status(created ? 201 : 200).json({
      message: created ? 'Last read created successfully' : 'Last read updated successfully',
      data: doc,
    });
  } catch (error) {
    console.error('LastRead API Error:', error);

    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        error: 'Last read already exists for this user',
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        error: 'Invalid topicId provided',
      });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.errors?.map((e) => e.message).join(', ') || 'Validation failed',
      });
    }

    // Log error for debugging
    console.error('Unexpected error in createV1:', error);

    // Return generic error
    return res.status(500).json({
      message: 'Server error',
      error: 'Failed to create last read record',
    });
  }
};

module.exports = createV1;
