import { ResultUnit } from 'src/types/UnitTypes';
import { ServiceModel } from 'src/models/Service.model';

export default function getResultUnit(
  ServiceModel: any,
  Unit: any,
): ResultUnit {
  let services = ServiceModel;
//   let servicesValues = Object.create(services);
  services = services?.map((value: any) => ({
    id: parseInt(value.id),
    name: value.name,
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
    // services,
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
    services,
    images,
    // unitCategory,
  };

  return resultUnit;
}
