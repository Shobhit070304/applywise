import { Request, Response, NextFunction } from 'express';
import { Job } from '../models/job.model';

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, jobType, experienceLevel, location, status, minSalary, maxSalary } = req.query;
    const { sortBy = 'createdAt', order = 'desc' } = req.query;

    const pageNum = Math.max(1, Number(req.query.page || 1));
    const limitNum = Math.min(100, Number(req.query.limit || 10));
    const skip = (pageNum - 1) * limitNum;

    const queryObj: any = { status: status || 'active' };

    if (search) {
      const escapedSearch = (search as string).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      queryObj.title = { $regex: new RegExp(escapedSearch, 'i') };
    }

    if (location) {
      queryObj.location = { $regex: new RegExp(location as string, 'i') };
    }

    if (experienceLevel) {
      queryObj.experienceLevel = experienceLevel as string;
    }

    if (jobType) {
      queryObj.jobType = { $regex: new RegExp(`^${(jobType as string).trim()}$`, 'i') };
    }

    if (minSalary) {
      queryObj['salary.min'] = { $gte: Number(minSalary) };
    }

    if (maxSalary) {
      queryObj['salary.max'] = { $lte: Number(maxSalary) };
    }

    const sortField = sortBy as string;
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortField]: sortOrder };

    const totalJobs = await Job.countDocuments(queryObj);
    const jobs = await Job.find(queryObj)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    const totalPages = Math.ceil(totalJobs / limitNum);
    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalJobs,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ error: 'Not Found', message: 'Job not found' });
      return;
    }
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      res.status(404).json({ error: 'Not Found', message: 'Job not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Not Found', message: 'Job not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
