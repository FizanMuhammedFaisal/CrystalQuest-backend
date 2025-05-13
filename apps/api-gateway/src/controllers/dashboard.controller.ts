import { Request, Response } from 'express'
import { authService } from '../services/auth/auth.service.js'

export async function getPlayersFromAuth(req: Request, res: Response) {
  console.log('from the  dashbord service caling ehre')
  const { limit, page, search, sort, order } = req.query
  const parsedLimit = Number(limit)
  const parsedPage = Number(page)
  if (
    (isNaN(parsedLimit) ||
      isNaN(parsedPage) ||
      typeof search !== 'string' ||
      typeof sort !== 'string',
    typeof order !== 'string')
  ) {
    return res.status(400).json({
      message: 'Invalid query parameters',
    })
  }

  const players = await authService.getPlayers({
    limit: parsedLimit,
    page: parsedPage,
    search,
    sort,
    order,
  })
  console.log('players', players)
  if (!players) {
    return res.status(404).json({ message: 'Players not found' })
  }
  return res.status(200).json(players)
}
