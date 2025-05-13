import { DataSource } from 'typeorm'
import { User } from './models/user.js'

const AppDataSource = new DataSource({
  type: 'postgres',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  host: process.env.DB_HOST ?? 'localhost',
  username: process.env.DB_USER ?? 'postgres',
  database: process.env.DB_NAME ?? 'auth',
  password: process.env.DB_PASSWORD ?? 'postgres',
  synchronize: false,
  logging: true,
  entities: [User],
  migrations: ['dist/apps/auth/src/db/migrations/*.js'],
})

const InitializeDataBase = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize()
      console.log('Data Source has been initialized!')
    } catch (err) {
      console.error('Error during Data Source initialization', err)
      throw err
    }
  } else {
    console.log('Data Source already initialized.')
  }
  return AppDataSource
}
export default AppDataSource
export { InitializeDataBase }
