import { Request, Response } from 'express'

export async function getPlayers(req: Request, res: Response) {
  console.log('getPlayers')
  try {
    const response = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name:
        [
          'CrystalMaster99',
          'GalaxyHunter',
          'StarCollector',
          'CosmicGatherer',
          'NebulaNinja',
          'VoidWalker',
          'AstralHunter',
          'QuantumRaider',
          'StellarNomad',
          'GalacticPioneer',
          'CosmicVoyager',
          'StardustSeeker',
        ][i % 12] + (i > 11 ? `_${Math.floor(i / 12)}` : ''),
      crystals: Math.floor(Math.random() * 15000) + 1000,
      sessions: Math.floor(Math.random() * 400) + 100,
      lastActive: [
        'Just now',
        '5m ago',
        '30m ago',
        '1h ago',
        '2h ago',
        '3h ago',
        '4h ago',
        '5h ago',
        '12h ago',
        '1d ago',
        '2d ago',
      ][Math.floor(Math.random() * 11)],
    }))
    res.successMessage = 'Players retrieved successfully'
    return res.status(200).json(response)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      error: 'Failed to communicate with game service',
      details: message,
    })
  }
}
