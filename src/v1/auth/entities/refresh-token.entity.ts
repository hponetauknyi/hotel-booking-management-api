import { AuditEntity } from 'src/common/entities/audit.entity';
import { Admin } from 'src/v1/admin/entities/admin.entity';
import { User } from 'src/v1/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken extends AuditEntity {
  @Column()
  token!: string;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;

  @Column({ nullable: true })
  adminId!: string;

  @ManyToOne(() => Admin, (admin) => admin.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin!: Relation<Admin>;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @Column({ default: false })
  isRevoked!: boolean;
}
