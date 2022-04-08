import { ResultUnit } from 'src/types/UnitTypes';
import { ServiceModel } from 'src/models/Service.model';

export default function getResultUnit(
  ServiceModel: ServiceModel,
  Unit: any,
): ResultUnit {
  let services = ServiceModel;
  let servicesValues = Object.create(services);
  servicesValues = servicesValues.map((value: any) => ({
    id: parseInt(value.dataValues.id),
    name: value.dataValues.name,
  }));

  const {
    id,
    name,
    description,
    owner_id,
    registration_number,
    first_name,
    last_name,
    middle_name,
    lng,
    lat,
    poster,
    // category,
    phone,
    country,
    city,
    street,
    house,
    price,
    images,
    unitCategory,
  } = Unit;

  // const resultUnit = {...Unit, owner: Unit.owner_id, services: servicesValues}
  const resultUnit = {
    id,
    name,
    description,
    owner: owner_id,
    registration_number,
    first_name,
    last_name,
    middle_name,
    lng,
    lat,
    poster,
    category: unitCategory,
    phone,
    country,
    city,
    street,
    house,
    price,
    services: servicesValues,
    images,
    // unitCategory,
  };

  return resultUnit;
}
