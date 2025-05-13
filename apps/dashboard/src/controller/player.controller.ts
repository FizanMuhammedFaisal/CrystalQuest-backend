//  `game/players?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}&search=${debouncedSearch}`

import { config } from 'dotenv'
import { Request, Response } from 'express'
config()
import axios from 'axios'
const API_GATEWAY_URL = process.env.API_GATEWAY_URL
const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
})
interface PaginationData {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}
export async function getPlayers(req: Request, res: Response) {
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
      details: {
        limit: parsedLimit,
        page: parsedPage,
        search,
        sort,
        order,
      },
    })
  }
  let players
  try {
    players = await apiClient.get(`/dashboard/players-from-auth`, {
      params: {
        limit: parsedLimit,
        page: parsedPage,
        search,
        sort,
        order,
      },
    })
  } catch (error) {
    console.error('Error fetching players:', error)
    return res.status(500).json({
      message: 'Error fetching players',
      details: error,
    })
  }

  console.log('players', players)
  if (!players) {
    return res.status(404).json({ message: 'Players not found' })
  }
  res.successMessage = 'Players fetched successfully'
  return res.status(200).json({
    players: [...players.data.data.players],
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      totalItems: players.data.data.total,
      totalPages: Math.ceil(players.data.data.total / parsedLimit),
    } as PaginationData,
  })
}
