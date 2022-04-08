import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { ServiceModel } from 'src/models/Service.model';
import { UnitModel } from 'src/models/Unit.model';

interface UnitServicesCreationAttrs {
  unit_id: number;
  service_id: number;
}

@Table({ tableName: 'main_app_unit_services' })
export class UnitServicesModel extends Model<
  UnitServicesModel,
  UnitServicesCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => UnitModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  unit_id: number;

  @ForeignKey(() => ServiceModel )
  @Column({ type: DataType.INTEGER, allowNull: false })
  service_id: number;

  @BelongsTo(() => UnitModel, { as: 'owner' })
  unit: UnitModel;
}
