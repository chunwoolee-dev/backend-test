import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ comment: '고유 아이디' })
  id: number;

  @Column({ length: 50, comment: '사용자 이름' })
  name: string;

  @Column({ unique: true, comment: '사용자 email' })
  email: string;

  @Column({ comment: 'hash된 비밀번호' })
  password?: string;

  @CreateDateColumn({ comment: '아이디 생성일' })
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, salt);
  }
}
