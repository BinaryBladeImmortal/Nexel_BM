import { Op } from 'sequelize';

// Utility function to build Sequelize search query
export const buildSearchQuery = (options) => {
  const {
    search,
    filters = {},
    dateRange = {},
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;

  let where = {};

  // Text search (simplified for SQLite - searches in name/title/description)
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  // Apply filters
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      where[key] = filters[key];
    }
  });

  // Date range
  if (dateRange.start || dateRange.end) {
    where.createdAt = {};
    if (dateRange.start) {
      where.createdAt[Op.gte] = new Date(dateRange.start);
    }
    if (dateRange.end) {
      where.createdAt[Op.lte] = new Date(dateRange.end);
    }
  }

  // Build sort options for Sequelize
  const order = [[sortBy, sortOrder === 1 || sortOrder === 'asc' ? 'ASC' : 'DESC']];

  return { where, order };
};

// Pagination middleware for Sequelize
export const paginateResults = async (model, req, queryOptions = {}) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { where, order } = buildSearchQuery({
    search: req.query.search,
    filters: queryOptions.filters,
    dateRange: {
      start: req.query.startDate,
      end: req.query.endDate
    },
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder === 'asc' ? 1 : -1
  });

  // Execute query with pagination (Sequelize)
  const { count: total, rows: items } = await model.findAndCountAll({
    where,
    order,
    limit,
    offset,
    // Sequelize doesn't have populate, use include for associations if needed
    // include: queryOptions.include || []
  });

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
};

// Advanced search middleware
export const advancedSearch = (model, queryOptions = {}) => async (req, res, next) => {
  try {
    const results = await paginateResults(model, req, queryOptions);
    res.searchResults = results;
    next();
  } catch (error) {
    next(error);
  }
};