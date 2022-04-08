import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { UnitModel } from './Unit.model';
// import { UnitModel } from './Unit.model';

interface UnitCategoryCreationAttrs {
  name: string;
  parent: bigint;
  level: number;
  // path: string;
}

@Table({ tableName: 'main_app_category' })
export class UnitCategoryModel extends Model<
  UnitCategoryModel,
  UnitCategoryCreationAttrs
> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.BIGINT })
  parent: bigint;


  // @HasOne(() => UnitModel, {
  //   onDelete: 'cascade',
  //   // as: 'category',
  // })
  // unit: UnitModel;

  @Column({ type: DataType.INTEGER })
  level: number;
}
