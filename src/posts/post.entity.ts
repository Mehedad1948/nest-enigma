import { MetaOption } from 'src/meta-options/meta-option.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postStatus } from './enums/postStatus.enum';
import { PostType } from './enums/postType.enum';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512, nullable: false })
  title: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: PostType,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({ nullable: true })
  content?: string;

  @Column({ nullable: false })
  slug: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: postStatus,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({ nullable: true })
  schema?: string;

  @Column({ nullable: true, type: 'timestamp' })
  publishedOn: Date;

  @Column({ nullable: true })
  image?: string;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable()
  tags?: Tag[];

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
    eager: true,
  })
  // @JoinColumn({})
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;
}
