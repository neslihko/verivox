import { fakerDE } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const userAccountId = process.env.USER_ACCOUNT_ID!;

const generateRandomNumber = (minimum: number, maximum: number) => {
    const min = Math.ceil(minimum);
    const max = Math.floor(maximum);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateUserAccountData = () => ({
    id: userAccountId,
    email: fakerDE.internet.email()
});

const generateProfileData = () => ({
    name: fakerDE.internet.displayName()
});

const generatePersonData = () => ({
    firstName: fakerDE.person.firstName(),
    lastName: fakerDE.person.lastName(),
    birthdate: fakerDE.date.birthdate(),
    maritalStatus: fakerDE.helpers.arrayElement(['Married', 'Single', 'Divorced', 'Complicated']),
    phone: fakerDE.phone.number('+49###########'),
    mobilePhone: fakerDE.phone.number('+49###########'),
    occupation: fakerDE.helpers.arrayElement(['Employed', 'Freelancer', 'Company owner', 'Unemployed']),
    salutation: fakerDE.helpers.arrayElement([ 'Herr', 'Frau' ])
});

const generateAddressData = () => ({
    name: fakerDE.internet.userName(),
    street: fakerDE.location.street(),
    houseNumber: fakerDE.location.buildingNumber(),
    postalCode: fakerDE.location.zipCode(),
    locationId: fakerDE.location.city(),
    city: fakerDE.location.city(),
});

const generatePaymentMethodData = () => ({
    name: fakerDE.internet.userName(),
    iban: fakerDE.finance.iban({ countryCode: 'DE' }),
    bic: fakerDE.finance.bic()
});

const generateMeterData = () => ({
    name: fakerDE.internet.userName(),
    type: fakerDE.helpers.arrayElement([ 'Strom', 'Gas' ]),
    number: fakerDE.string.numeric({ length: 10 }),
    usage: fakerDE.number.int({ min: 0, max: 50000 }).toString()
});



const createNewUserAccount = async () => {
    return await prisma.userAccount.create({
        data: generateUserAccountData()
    });
}

const createNewProfile = async () => {
    return await prisma.profile.create({
        data: {
            ...generateProfileData(),
            userAccount: { connect: { id: userAccountId } }
        }
    })
}

type CreateNewPersonProps = { profileId: string };
const createNewPerson = async ({ profileId }: CreateNewPersonProps) => {
    return await prisma.person.create({
        data: {
            ...generatePersonData(),
            profile: { connect: { id: profileId } },
            userAccount: { connect: { id: userAccountId } },
        }
    })
}

type CreateNewPaymentMethodProps = { profileId: string };
const createNewPaymentMethod = async ({ profileId }: CreateNewPaymentMethodProps) => {
    return await prisma.paymentMethod.create({
        data: {
            ...generatePaymentMethodData(),
            profile: { connect: { id: profileId } },
            userAccount: { connect: { id: userAccountId } },
        }
    })
}

type CreateNewAddressProps = { profileId: string };
const createNewAddress = async ({ profileId }: CreateNewAddressProps) => {
    return await prisma.address.create({
        data: {
            ...generateAddressData(),
            profile: { connect: { id: profileId } },
            userAccount: { connect: { id: userAccountId } },
        }
    })
}

type CreateNewMeterProps = { profileId: string; addressId: string };
const createNewMeter = async ({ profileId, addressId }: CreateNewMeterProps) => {
    return await prisma.meter.create({
        data: {
            ...generateMeterData(),
            address: { connect: { id: addressId } },
            profile: { connect: { id: profileId } },
            userAccount: { connect: { id: userAccountId } },
        }
    })
}


const populateDbWithInitialData = async () => {
    console.log('Started seeding ...');

    const { id: userAccountId } = await createNewUserAccount();

    const numberOfProfiles = generateRandomNumber(1, 5);
    for (let profiles = 0; profiles < numberOfProfiles; profiles++) {
        const { id: profileId } = await createNewProfile()

        const numberOfPersons = generateRandomNumber(1, 5);
        for (let persons = 0; persons < numberOfPersons; persons++) {
            await createNewPerson({ profileId })
        }

        const numberOfPaymentMethods = generateRandomNumber(1, 5);
        for (let paymentMethods = 0; paymentMethods < numberOfPaymentMethods; paymentMethods++) {
            await createNewPaymentMethod({ profileId })
        }

        const numberOfAddresses = generateRandomNumber(1, 5);
        for (let addresses = 0; addresses < numberOfAddresses; addresses++) {
            const { id: addressId } = await createNewAddress({ profileId });

            const numberOfMeters = generateRandomNumber(0, 2);
            for (let meters = 0; meters < numberOfMeters; meters++) {
                await createNewMeter({ profileId, addressId });
            }
        }
    }

    const userAccount = await prisma.userAccount.findUnique({
        where: { id: userAccountId },
        include: {
            profiles: {
                include: {
                    persons: true,
                    paymentMethods: true,
                    addresses: {
                        include: {
                            meters: true
                        }
                    }
                }
            }
        }
    });

    if (userAccount) {
        const primaryProfileIndex = generateRandomNumber(0, userAccount.profiles.length - 1);
        const primaryProfile = userAccount.profiles[primaryProfileIndex];
        await prisma.profile.update({
            where: { id: primaryProfile.id },
            data: { isPrimary: true }
        });

        console.log(`Set profile ${primaryProfile.name} as primary`);
        console.log('');

        for (const profile of userAccount.profiles) {
            const primaryPersonIndex = generateRandomNumber(0, profile.persons.length - 1);
            const primaryPerson = profile.persons[primaryPersonIndex];
            if (primaryPerson) {
                await prisma.person.update({
                    where: { id: primaryPerson.id },
                    data: { isPrimary: true }
                });

                console.log(`Set person ${primaryPerson.firstName} from profile ${profile.name} as primary`);
            }

            const primaryAddressIndex = generateRandomNumber(0, profile.addresses.length - 1);
            const primaryAddress = profile.addresses[primaryAddressIndex];
            if (primaryAddress) {
                await prisma.address.update({
                    where: { id: primaryAddress.id },
                    data: { isPrimaryShipping: true, isPrimaryMailing: true, isPrimaryBilling: true }
                });

                console.log(`Set address ${primaryAddress.street + ' ' + primaryAddress.houseNumber} from profile ${profile.name} as primary`);
            }

            const primaryPaymentMethodIndex = generateRandomNumber(0, profile.paymentMethods.length - 1);
            const primaryPaymentMethod = profile.paymentMethods[primaryPaymentMethodIndex];
            if (primaryPaymentMethod) {
                await prisma.paymentMethod.update({
                    where: { id: primaryPaymentMethod.id },
                    data: { isPrimary: true }
                });

                console.log(`Set payment ${primaryPaymentMethod.iban} from profile ${profile.name} as primary`);
            }

            console.log('');
        }

        console.log(`Created userAccount with email: ${userAccount.email}`);
    }

    console.log('Seeding finished.');
};

const seed = async () => {
    try {
        await populateDbWithInitialData();
        await prisma.$disconnect();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
};

void seed();
