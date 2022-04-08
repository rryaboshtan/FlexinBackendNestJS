export default async function changeUnitWithServices(
  unitDto: any,
): Promise<any> {
  const {
    name,
    description,
    registration_number,
    first_name,
    last_name,
    middle_name,
    phone,
    country,
    city,
    street,
    house,
    price,
    lat,
    lng,
    owner,
      category,
    services,
    // poster,
    // ...rest
  } = unitDto;

  let servicesArray = JSON.parse(services);
  servicesArray = servicesArray.map((service: any) => ({ name: service.name }))

  const newUnitDto = {
    name,
    description,
    registration_number,
    first_name,
    last_name,
    middle_name,
    phone,
    country,
    city,
    street,
    price,
    house,
    lat,
    lng,
    owner,
    category,
    // poster,
    services: servicesArray,
  };
  console.log('newUnitDto.services = ', newUnitDto.services);
//   console.log('rest = ', rest);

  return newUnitDto;
}
