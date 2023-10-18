export interface Person {
    id: string;
    salutation: string;
    lastName: string;
    profileId:string
  }
  
  export interface PaymentMethod {
    id: string;
    name: string;
    profileId:string
  }
  
  export interface Address {
    id: string;
    name: string;
    street: string;
    houseNumber: string;
    profileId:string
    meters: Meter[]; 
  }
  
  export interface Profile {
    id: string;
    name: string;
    persons: Person[];
    paymentMethods: PaymentMethod[];
    addresses: Address[];
    
  }

  export interface Meter {
    id: string;
    addressId: string;
    profileId: string;
    userAccountId: string;
    name: string;
    type: string;
    number: string;
    usage: string;
  }


 