export type UserAccount = {
    id: string;
    email: string;
    profiles?: Profile[];
};

export type Profile = {
    id: string;
    userAccountId: string;
    name: string;
    isPrimary: boolean;
    persons: Person[];
    addresses: Address[];
    paymentMethods: PaymentMethod[];
}

const salutations = [ 'Herr', 'Frau' ] as const;
type Salutation = typeof salutations[number];

const maritalStatuses = ['Married', 'Single', 'Divorced', 'Complicated'] as const;
type MaritalStatus = typeof maritalStatuses[number];

const occupations = ['Employed', 'Freelancer', 'Company owner', 'Unemployed'] as const;
type Occupation = typeof occupations[number];


export type Person = {
    id: string;
    profileId: string;
    userAccountId: string;
    salutation: Salutation;
    firstName: string;
    lastName: string;
    birthdate: string;
    maritalStatus: MaritalStatus;
    occupation: Occupation;
    mobilePhone: string;
    phone: string;
    isPrimary: boolean;
}

export type Address = {
    id: string;
    profileId: string;
    userAccountId: string;
    name: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    locationId: string;
    city: string;
    isPrimaryMailing: boolean;
    isPrimaryBilling: boolean;
    isPrimaryShipping: boolean;
    meters: Meter[];
}

export type PaymentMethod = {
    id: string;
    profileId: string;
    userAccountId: string;
    name: string;
    iban: string;
    bic: string;
    isPrimary: boolean;
}

const meterTypes = ['Strom', 'Gas'] as const;
type MeterType = typeof meterTypes[number];

export type Meter = {
    id: string;
    addressId: string;
    profileId: string;
    userAccountId: string;
    name: string;
    type: MeterType;
    number: string;
    usage: number;
}
