export default async function uploadUnitWithServices(
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
    // poster,
    ...rest
  } = unitDto;

  const services = [];
  // const servicesLength = Object.keys(rest).length / 2;
  console.log(
    'Math.floor(Object.keys(rest).length / 2)',
    Math.floor(Object.keys(rest).length / 2),
  );
  // const servicesLength = Math.floor(Object.keys(rest).length / 2);
  const servicesLength = Math.floor(Object.keys(rest).length / 2);

  for (let i = 0; i < servicesLength; i++) {
    services.push({
      name: rest[`services[${i}].name`],
    });
  }
  console.log('services = ', services);

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
    house,
    price,
    lat,
    lng,
    owner,
    category,
    // poster,
    services,
  };
  console.log('rest = ', rest);

  return newUnitDto;
}
