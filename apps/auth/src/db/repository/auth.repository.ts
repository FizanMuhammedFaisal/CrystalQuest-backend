import { Repository } from 'typeorm'
import { User } from '../models/user'
import { Player } from '@backend/protos/auth/auth'
interface PlayerRes extends Player {
  total: number
}
export class UserRepository {
  private client: Repository<User>
  constructor(userRepository: Repository<User>) {
    this.client = userRepository
  }
  async createUser(
    username: string,
    email: string,
    password: string,
    role: string = 'user'
  ): Promise<User> {
    const newUser = this.client.create({
      username,
      email,
      password,
      role,
    })
    await this.client.save(newUser)
    return newUser
  }

  async findUserById(id: number): Promise<User | null> {
    return this.client.findOne({ where: { id } })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.client.findOne({ where: { email } })
  }
  async findUserWithPasswordByEmail(email: string): Promise<User | null> {
    return this.client.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    })
  }
  async findAllUsers(
    limit: number,
    search: string,
    sort: string = 'username',
    skip: number,
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<{ players: PlayerRes[]; total: number }> {
    try {
      console.log(order)
      const query = this.client.createQueryBuilder('user')

      if (search) {
        query.where('user.username LIKE :search', {
          search: `%${search}%`,
        })
      }

      query.orderBy(`user.${sort}`, order)

      query.skip(skip).take(limit)

      // Fetch players data
      const players = await query.getMany()

      // Get total count of players
      const total = await this.client
        .createQueryBuilder('user')
        .where('user.username LIKE :search', {
          search: `%${search}%`,
        })
        .getCount()

      return { players, total }
    } catch (err) {
      console.error('Error fetching users:', err)
      throw new Error('Failed to fetch users')
    }
  }
}
