import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';

import { ProfileModel } from 'src/models/Profile.model';
import { UnitImage } from './UnitImage.model';
import { ServiceModel } from './Service.model';
import { UnitServicesModel } from 'src/models/UnitServices.model';
import { UnitCategoryModel } from './UnitCategory.model';

interface UnitCreationAttrs {
  name: string;
  description: string;
  registration_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  lat: number;
  lng: number;
  phone: string;
  country: string;
  city: string;
  street: string;
  house: string;
  price: number;
  owner_id: number;
  poster: string;
  category: number;

  // owner: number;
  // services: ServiceModel[],
}

@Table({ tableName: 'main_app_unit' })
export class UnitModel extends Model<UnitModel, UnitCreationAttrs> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  registration_number: string;

  @Column({ type: DataType.STRING })
  first_name: string;

  @Column({ type: DataType.STRING })
  middle_name: string;

  @Column({ type: DataType.STRING })
  last_name: string;

  @Column({
    type: DataType.STRING,
    defaultValue:
      'https://storage.googleapis.com/nestjs_bucket/543d8c5e-fa71-4bff-bdbe-d122b538b572.jpg',
  })
  poster: string;

  @Column({ type: DataType.DOUBLE })
  lat: number;

  @Column({ type: DataType.DOUBLE })
  lng: number;

  @Column({ type: DataType.DOUBLE })
  phone: string;

  @ForeignKey(() => UnitCategoryModel)
  @Column({ type: DataType.INTEGER, defaultValue: 1, allowNull: true })
  category: number;

  @Column({ type: DataType.STRING })
  country: string;

  @BelongsTo(() => UnitCategoryModel)
  unitCategory: UnitCategoryModel;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING })
  street: string;

  @Column({ type: DataType.STRING })
  house: string;

  @Column({ type: DataType.DOUBLE })
  price: number;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  owner_id: number;

  @HasMany(() => UnitImage, {
    onDelete: 'cascade',
    as: 'images',
  })
  unitImages: UnitImage[];

  @BelongsTo(() => ProfileModel, { as: 'owner' })
  profile: ProfileModel;

  @HasMany(() => UnitServicesModel, {
    onDelete: 'cascade',
  })
  unitServicesModel: UnitServicesModel[];

  @BelongsToMany(() => ServiceModel, () => UnitServicesModel)
  ServiceModel: ServiceModel;
}
