import { Model, Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { UnitModel } from 'src/models/Unit.model';
import { UnitServicesModel } from 'src/models/UnitServices.model';

interface ServiceCreationAttrs{
   name: string;
}

@Table({ tableName: 'main_app_service' })
export class ServiceModel extends Model<ServiceModel, ServiceCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => UnitModel, () => UnitServicesModel)
  unit: UnitModel;
}