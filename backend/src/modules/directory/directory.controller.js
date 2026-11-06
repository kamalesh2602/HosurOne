import directoryService from './directory.service.js';

export async function getPlaces(req, res, next) {
  try {
    const result = await directoryService.getPlaces(req.query);
    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getHospitals(req, res, next) {
  try {
    const result = await directoryService.getHospitals(req.query);
    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAtms(req, res, next) {
  try {
    const result = await directoryService.getAtms(req.query);
    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContacts(req, res, next) {
  try {
    const result = await directoryService.getContacts(req.query);
    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getPlaces,
  getHospitals,
  getAtms,
  getContacts,
};

