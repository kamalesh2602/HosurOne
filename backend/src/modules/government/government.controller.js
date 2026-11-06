import governmentService from './government.service.js';

/**
 * GET /api/government
 */
export async function getAllOffices(req, res, next) {
  try {
    const { search, category, locality, page, limit } = req.query;

    const result = await governmentService.getGovernmentOffices({
      search,
      category,
      locality,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.offices,
      pagination: result.pagination,
      sourceAttribution: 'Hosur City Municipal Corporation & Tamil Nadu Public Records',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/government/:id
 */
export async function getOfficeById(req, res, next) {
  try {
    const { id } = req.params;
    const office = await governmentService.getGovernmentOfficeById(id);

    if (!office) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Government office with identifier '${id}' was not found in the verified Hosur directory.`,
          status: 404,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: office,
    });
  } catch (error) {
    next(error);
  }
}

export default { getAllOffices, getOfficeById };
