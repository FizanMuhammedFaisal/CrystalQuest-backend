import { Request, Response, NextFunction } from 'express'
import { Response as ExpressGenericResponse } from 'express-serve-static-core'
declare global {
  namespace Express {
    interface Response {
      successMessage?: string
      originalJson?: (
        body?: any
      ) => ExpressGenericResponse<any, Record<string, any>>
      originalSend?: (
        body?: any
      ) => ExpressGenericResponse<any, Record<string, any>>
    }
  }
}

export const standardResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.originalJson = res.json
  res.originalSend = res.send

  // Override res.json for this request
  res.json = (data: any) => {
    if (res.headersSent || res.statusCode >= 400) {
      return res.originalJson!.call(res, data)
    }

    const statusCode =
      res.statusCode >= 200 && res.statusCode < 300 ? res.statusCode : 200
    res.status(statusCode)

    //standard responsess are setting
    const standardizedResponse = {
      success: true,
      message: res.successMessage ?? 'Operation successful',
      data: data,
    }
    return res.originalJson!.call(res, standardizedResponse)
  }

  res.send = (data: any) => {
    if (res.headersSent || res.statusCode >= 400) {
      return res.originalSend!.call(res, data)
    }

    if (typeof data === 'object' && data !== null) {
      const statusCode =
        res.statusCode >= 200 && res.statusCode < 300 ? res.statusCode : 200
      res.status(statusCode)

      const standardizedResponse = {
        success: true,
        message: res.successMessage ?? 'Operation successful',
        data: data,
      }

      return res.originalJson!.call(res, standardizedResponse)
    } else {
      return res.originalSend!.call(res, data)
    }
  }

  next()
}
