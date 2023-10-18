import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Meter } from './types';

interface Address {
  id: string;
  name: string;
  isPrimary: boolean;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  meter: [];
}

interface AddressDetailsProps {
  address: Address;
}




const AddressDetails: React.FC<AddressDetailsProps> = () => {
  const { profileId, addressId } = useParams<{ profileId: string; addressId: string }>();
  const [address, setAddress] = useState<Address | null>(null);
  const [meter, setMeter] = useState(0);
 
  useEffect(() => {
    // Fetch the person's details based on the ID
    const fetchAdressDetails = async () => {
      try {

        const backendUrl = import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${profileId}/addresses/${addressId}`;
 

        const response = await fetch(backendUrl);  
        if (response.ok) {
          const data = await response.json();
          setAddress(data);  
        } else {
          console.error('Failed to fetch adress details');
        }
      } catch (error) {
        console.error('Error fetching adress details:', error);
      }
    };

    const fetchMetersForAddress = async () => {
  
      const backendUrl = import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${profileId}/addresses/${addressId}/meters`;
    
      try {
        const response = await fetch(backendUrl);
        if (response.ok) {
          const data = await response.json();
          setMeter(data.length);  
        } else {
          console.error('Failed to fetch meter  ');
        }
      
      } catch (error) {
        console.error('Error fetching meters for the address:', error);
        return [];
      }
  
       
    };

    fetchAdressDetails();
    fetchMetersForAddress();  
  }, [profileId,addressId]); // Fetch whenever the ID changes

  
  
 
 

  return (
    <div  className="payment-method-details"> 
      <h2>Address Details</h2>{address ? (
 
      <> <div className="section"><div>{`Name: ${address.name}`}</div>
      <div>{`Primary: ${address.isPrimary ? 'Yes' : 'No'}`}</div>
      <div>{`Postal Code: ${address.postalCode}`}</div>
      <div>{`City: ${address.city}`}</div>
      <div>{`Street: ${address.street} ${address.houseNumber}`}</div>
      <div>{`Meter Count: ${ meter}`}</div>
      </div>
      <Link to={`/profile/${profileId}`}>
          Back to Profile Details
        </Link></> )
: (
<p>Loading adress details...</p>
)}</div>
);
};
 
export default AddressDetails;
