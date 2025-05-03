import authClient from '../clients/auth.client'
import { Request, Response } from 'express'
export async function sayHello(req: Request, res: Response): Promise<void> {
  try {
    const result = await authClient.sayHello({ name: req.body.name ?? 'Guest' })
    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to communicate with auth service',
      details: error.message
    })
  }
}
