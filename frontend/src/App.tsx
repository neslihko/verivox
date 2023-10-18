import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Timer from './Timer';
import { Link, BrowserRouter as Router, Routes ,Route} from 'react-router-dom';
import ProfileDetails  from './ProfileDetails';
import { Profile } from './interfaces'; 
import './App.scss'; 
import PersonDetails from './PersonDetails';
import PaymentMethodDetails from './PaymentMethodDetails';
import AddressDetails from './AddressDetails';




interface UserAccountData {
  email: string;
  profiles: Profile[];
  paymentMethods: any[]; // Replace 'any' with the appropriate type
  persons: any[]; // Replace 'any' with the appropriate type
  addresses: any[]; // Replace 'any' with the appropriate type
  meters: any[]; // Replace 'any' with the appropriate type
}

const App: React.FC = () => {
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  const [userAccountData, setUserAccountData] = useState<UserAccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL;
        console.log('Backend URL:', backendUrl);
        const response = await fetch(backendUrl);
        const data = await response.json();
        setUserAccountData(data);
        setIsLoading(false);

         
        

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleRemoveProfile = async (profileId: string) => {
    try {
      setDeletingProfileId(profileId);
  
      // Make a DELETE request to remove the profile
      const backendUrl = import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${profileId}`;
      console.log('Backend URL:', backendUrl);

      const response = await fetch( backendUrl, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // If successful, update the UI or fetch the updated data
        console.log('Profile deleted successfully.');
        // You may fetch updated data here or update the UI accordingly
      } else {
        console.error('Error deleting profile:', response.statusText);
      }
  
      setDeletingProfileId(null);
    } catch (error) {
      setDeletingProfileId(null);
      console.error('Error removing profile:', error);
    }
  };
  
  
  const entityCounts = userAccountData
  ? {
      profileCount: userAccountData.profiles.length,
      paymentMethodCount: userAccountData.profiles.reduce(
        (count, profile) => count + (profile.paymentMethods ? profile.paymentMethods.length : 0),
        0
      ),
      personCount: userAccountData.profiles.reduce(
        (count, profile) => count + (profile.persons ? profile.persons.length : 0),
        0
      ),
      addressCount: userAccountData.profiles.reduce(
        (count, profile) => count + (profile.addresses ? profile.addresses.length : 0),
        0
      ),
      meterCount: userAccountData.profiles.reduce((count, profile) => {
        return (
          count +
          (profile.addresses
            ? profile.addresses.reduce((addressCount, address) => {
                return (
                  addressCount +
                  (address.meters ? address.meters.length : 0) // Add meters count for each address
                );
              }, 0)
            : 0)
        );
      }, 0),
    }
 
  : {
      profileCount: 0,
      paymentMethodCount: 0,
      personCount: 0,
      addressCount: 0,
      meterCount: 0,
    };

  return (
    <Router>

    <div  className="app-container">
      {isLoading ? (
        <><Loader /><Timer /></>
      ) : (
        <div className="loader-container">

          {/* Display user account data */}
          <div className="email">Email: {userAccountData?.email}</div>

        {/* Display information about the number of items */}
    <div className="entity-counts">
              <div>Profiles count: {entityCounts.profileCount}</div>
              <div>Payment Methods count: {entityCounts.paymentMethodCount}</div>
              <div>Persons count: {entityCounts.personCount}</div>
              <div>Addresses count: {entityCounts.addressCount}</div>
              <div>Meters count: {entityCounts.meterCount}</div>
            </div>
       {userAccountData?.profiles.map((profile: Profile) => (
  <div className="profile" key={profile.id}>
 <div>
      <Link to={`/profile/${profile.id}`}>{profile.name}</Link>
    </div>
    <button onClick={() => handleRemoveProfile(profile.id)} disabled={deletingProfileId === profile.id}>
  {deletingProfileId === profile.id ? 'Deleting...' : 'Remove Profile'}
</button>
  </div>
))}

 
<Routes>
              {/* Route to display ProfileDetails */}
              <Route path={`/profile/:id`} element={<ProfileDetails />} />

        

        <Route path=":profileId/persons/:personId" element={<PersonDetails />} />  

        <Route path=":profileId/paymentMethods/:paymentMethodId" element={<PaymentMethodDetails />} />
        <Route path=":profileId/addresses/:addressId" element={<AddressDetails />} />
    

            </Routes>
         
         
 
 

        </div>
      )}
    </div>
    </Router>
  );
};

export default App;