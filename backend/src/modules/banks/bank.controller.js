import bankService from './bank.service.js';

/**
 * GET /api/banks
 */
export async function getAllBanks(req, res, next) {
  try {
    const { search, bank, locality, page, limit } = req.query;

    const result = await bankService.getBankBranches({
      search,
      bank,
      locality,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.branches,
      pagination: result.pagination,
      sourceAttribution: 'Reserve Bank of India (RBI) Public Directory & Official Bank Locators',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/banks/:id
 */
export async function getBankById(req, res, next) {
  try {
    const { id } = req.params;
    const branch = await bankService.getBankBranchById(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Bank branch with identifier or IFSC '${id}' was not found in the verified Hosur banking directory.`,
          status: 404,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    next(error);
  }
}

export default { getAllBanks, getBankById };

