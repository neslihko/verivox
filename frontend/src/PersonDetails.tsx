 

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
interface Person {
  id:string
  salutation: string;
  firstName: string;
  lastName: string;
  isPrimary: boolean;
  occupation: string;
  maritalStatus: string;
}

interface PersonDetailsProps {
  person: Person;
 
}
const PersonDetails: React.FC<PersonDetailsProps> = () => {
  const { profileId, personId } = useParams<{ profileId: string; personId: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  
  useEffect(() => {
    // Fetch the person's details based on the ID
    const fetchPersonDetails = async () => {
      try {

        const backendUrl = import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${profileId}/persons/${personId}`;

       

        console.log('Backend URL:', backendUrl);

        const response = await fetch(backendUrl); // Replace with your actual API endpoint
        if (response.ok) {
          const data = await response.json();
          setPerson(data); // Set the person's details in state
        } else {
          console.error('Failed to fetch person details');
        }
      } catch (error) {
        console.error('Error fetching person details:', error);
      }
    };

    fetchPersonDetails();
  }, [profileId,personId]); // Fetch whenever the ID changes

  return (
    <div  className="payment-method-details"> 
      <h2>Person Details</h2>
      {person ? (
        <div className="section">
          <p>ID: {person.id}</p>
          <p>Name: {`${person.salutation} ${person.firstName} ${person.lastName}`}</p>
          <p>Occupation: {person.occupation}</p>
          <p>Marital Status: {person.maritalStatus}</p>
          <p>Primary: {person.isPrimary ? 'Yes' : 'No'}</p>
          <Link to={`/profile/${profileId}`}>
            Back to Profile Details
          </Link>
        </div>

        
      ) : (
        <p>Loading person details...</p>
      )}
    </div>
  );
};
 
export default PersonDetails;
