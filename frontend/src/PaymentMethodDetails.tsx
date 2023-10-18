import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  name: string;
  isPrimary: boolean;
  iban: string;
  bic: string;
}

interface PaymentMethodDetailsProps {
  paymentMethod: PaymentMethod;
 
}

const PaymentMethodDetails: React.FC<PaymentMethodDetailsProps> = () => {
  const { profileId, paymentMethodId } = useParams<{ profileId: string; paymentMethodId: string }>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    // Fetch the person's details based on the ID
    const fetchPersonDetails = async () => {
      try {

        const backendUrl = import.meta.env.VITE_USER_ACCOUNT_BACKEND_URL+`/profiles/${profileId}/paymentMethods/${paymentMethodId}`;

       

        console.log('Backend URL:', backendUrl);

        const response = await fetch(backendUrl);  
        if (response.ok) {
          const data = await response.json();
          setPaymentMethod(data);  
        } else {
          console.error('Failed to fetch person details');
        }
      } catch (error) {
        console.error('Error fetching person details:', error);
      }
    };

    fetchPersonDetails();
  }, [profileId,paymentMethodId]); // Fetch whenever the ID changes

  return (
    
    <div className="payment-method-details">
    <h2>Payment Method Details</h2>{paymentMethod ? (
    <><div  className="section">
          <strong>Name:</strong> {paymentMethod.name}<br />
          <strong>IBAN:</strong> {paymentMethod.iban}<br />
          <strong>BIC:</strong> {paymentMethod.bic}<br />
          {paymentMethod.isPrimary && <strong>Primary Payment Method</strong>}
        </div><Link to={`/profile/${profileId}`}>
            Back to Profile Details
          </Link> </>)
    : (
    <p>Loading payment details...</p>
  )}</div>
  );
};
 
export default PaymentMethodDetails;
