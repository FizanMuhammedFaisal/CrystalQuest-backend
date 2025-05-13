import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string
  @Column()
  username!: string
  @Column({ unique: true })
  email!: string
  @Column()
  password!: string
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  createdAt!: Date
  @Column({
    type: 'simple-enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role!: string
}
