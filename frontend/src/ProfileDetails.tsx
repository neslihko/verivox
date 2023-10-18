import React, { useEffect, useState } from 'react';
import { Person, PaymentMethod, Address } from './interfaces';
import { Link, useParams } from 'react-router-dom';

interface ProfileDetailsProps {
  profile: {
    id: string;
    name: string;
    persons: Person[];
    paymentMethods: PaymentMethod[];
    addresses: Address[];
  };
}


const ProfileDetails: React.FC<ProfileDetailsProps> = ({  }) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  const fetchAddresses = async () => {
    try {
      const backendUrl = decodeURIComponent(import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${id}/addresses`);
      const response = await fetch(backendUrl);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
     
      const backendUrl = decodeURIComponent(import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${id}/paymentMethods`);
      const response = await fetch(backendUrl);
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      } else {
        console.error('Failed to fetch payment methods');
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchPersons = async () => {
    try {
      const backendUrl = decodeURIComponent(import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${id}/persons`);
      const response = await fetch(backendUrl);
      if (response.ok) {
        const data = await response.json();
        setPersons(data);
      } else {
        console.error('Failed to fetch persons');
      }
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAddresses(), fetchPaymentMethods(), fetchPersons()]);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading profile details...</p>;
  }
  
 
 

  return (
    <div className="profile-details">
      <h2>Profile Details</h2>

      <div className="section">
        <h3>List of Persons:</h3>
        <ul>
          {persons &&
            persons.map((person) => (
              <li key={person.id}>
                <Link to={`/${person.profileId}/persons/${person.id}`}>
                  {`${person.salutation} ${person.lastName}`}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <div className="section">
        <h3>List of PaymentMethods:</h3>
        <ul>
          {paymentMethods &&
            paymentMethods.map((paymentMethod) => (
              <li key={paymentMethod.id}>
                <Link to={`/${paymentMethod.profileId}/paymentMethods/${paymentMethod.id}`}>
                  {paymentMethod.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <div className="section">
        <h3>List of Addresses:</h3>
        <ul>
          {addresses &&
            addresses.map((address) => (
              <li key={address.id}>
                <Link to={`/${address.profileId}/addresses/${address.id}`}>
                  {`${address.name}, ${address.street}, ${address.houseNumber}`}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <Link to={`/profile`}>
          Back to Home  
        </Link>
    </div>
  );
};

export default ProfileDetails;