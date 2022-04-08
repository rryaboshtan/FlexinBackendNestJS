import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UnitModel } from './Unit.model';
interface UnitImageCreationAttrs {
   image: string;
   is_primary: boolean;
   unit_id: number;
}

@Table({ tableName: 'main_app_unitimage' })
export class UnitImage extends Model<UnitImage, UnitImageCreationAttrs> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_primary: boolean;

  @ForeignKey(() => UnitModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  unit_id: number;

  @BelongsTo(() => UnitModel)
  unit: UnitModel;
}
