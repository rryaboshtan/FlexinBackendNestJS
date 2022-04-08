import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

import { UnitModel } from 'src/models/Unit.model';

interface ProfileCreationAttrs {
   password: string;
   // last_login: Date;
  //  first_name: string;
  //  last_name: string;
  //  middle_name: string;
   email: string;
  //  phone: string;
  //  telegram: string;
  //  viber: string;
  //  country: string;
  //  city: string;
  //  street: string;
  //  house: string;
   is_active: boolean;
  //  is_superuser: boolean;
  //  is_staff: boolean;
  //  date_joined: Date;
}

@Table({ tableName: 'main_app_profile' })
export class ProfileModel extends Model<ProfileModel, ProfileCreationAttrs> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.DATE, defaultValue: Date.now() })
  last_login: Date;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  first_name: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  last_name: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  middle_name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  phone: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  telegram: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  viber: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  country: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  city: string;

  @Column({ type: DataType.STRING })
  street: string;

  @Column({ type: DataType.STRING, defaultValue: '1' })
  house: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_superuser: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_staff: boolean;

  @Column({ type: DataType.DATE, defaultValue: Date.now() })
  date_joined: Date;

  @HasMany(() => UnitModel, {
    onDelete: 'cascade',
  })
  units: UnitModel[];
}