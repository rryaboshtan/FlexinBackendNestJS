export type ProfileUnits = {
  units: {
    id: bigint;
    name: string;
    description: string;
    owner: bigint;
    registration_number: any;
    first_name: string;
    last_name: string;
    middle_name: string;
    lng: number;
    lat: number;
    poster: string;
    category: number;
    phone: string;
    country: string;
    city: string;
    street: string;
    house: string;
    services: any;
    images: any;
  }[];
};

export type ResultUnit = {
  id: bigint;
  name: string;
  description: string;
  owner: bigint;
  registration_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  lng: number;
  lat: number;
  poster: string;
  category: number;
  phone: string;
  country: string;
  city: string;
  street: string;
  house: string;
  services: any;
  images: any;
};


export type CatalogUnits = {
  catalog: {
    id: bigint;
    name: string;
    description: string;
    owner: bigint;
    registration_number: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    lng: number;
    lat: number;
    poster: string;
    category: number;
    phone: string;
    country: string;
    city: string;
    street: string;
    house: string;
    services: any;
    images: any;
  }[];
};
