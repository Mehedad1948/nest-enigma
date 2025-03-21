import { MetaOption } from 'src/meta-options/meta-option.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postStatus } from './enums/postStatus.enum';
import { PostType } from './enums/postType.enum';
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

  //   To Do in RelationShips
  // @Column({ nullable: true })
  // tags?: string[];

  @OneToOne(() => MetaOption, { cascade: true, eager: true })
  @JoinColumn({})
  metaOptions?: MetaOption;
}
