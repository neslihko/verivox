# Getting started

If you have just cloned this project, install all necessary dependencies:

### `npm install`

Then, the local DB needs to be initialized. To do that, run the command:

### `npm run prisma:initialize`

This will create a pre-populated DB (SQLite) using Prisma.
After that is done, you can initialize the backend server (Fastify).
To do that, run the command:

### `npm run dev`

That will start the backend server on [http://localhost:3001](http://localhost:3001).

# Available endpoints

These are endpoints for users and for tasks that are available for usage (considering the base URL preceding them to be`http://localhost:3001`:

### **GET**

| **ENDPOINT**                                              	 | **RETURN TYPE** 	 | **DESCRIPTION**                                    	           |
|-------------------------------------------------------------|-------------------|----------------------------------------------------------------|
| /                                                         	 | UserAccount     	 | Retrieves the user account data                              	 |
| /profiles                                                 	 | Profile[]       	 | Retrieves the profiles of a user account                     	 |
| /profiles/:profileId                                      	 | Profile         	 | Retrieves the profile with id `:profileId`              	      |
| /profiles/:profileId/addresses                            	 | Address[]       	 | Retrieves the addresses of a profile                           |
| /profiles/:profileId/persons                              	 | Person[]        	 | Retrieves the persons of a profile                             |
| /profiles/:profileId/paymentMethods                       	 | PaymentMethod[] 	 | Retrieves the payment methods of a profile                     |
| /profiles/:profileId/addresses/:addressId                 	 | Address         	 | Retrieves the address with id `:addressId`              	      |
| /profiles/:profileId/persons/:personId                    	 | Person          	 | Retrieves the person with id `:personId`                	      |
| /profiles/:profileId/paymentMethods/:paymentMethodId      	 | PaymentMethod   	 | Retrieves the payment method with id `:paymentMethodId` 	      |
| /profiles/:profileId/addresses/:addressId/meters          	 | Meter[]         	 | Retrieves the meters of an address                             |
| /profiles/:profileId/addresses/:addressId/meters/:meterId 	 | Meter           	 | Retrieves the meter with id `meterId`                   	      |

### **POST**

| **ENDPOINT**                                              	 | **RETURN TYPE** 	 | **DESCRIPTION**                                    	                 |
|-------------------------------------------------------------|-------------------|----------------------------------------------------------------------|
| /profiles                                                 	 | Profile       	   | Creates a new profile and returns it                     	           |
| /profiles/:profileId/addresses                            	 | Address       	   | Creates a new address and returns it                            	    |
| /profiles/:profileId/persons                              	 | Person        	   | Creates a new person and returns it                            	     |
| /profiles/:profileId/paymentMethods                       	 | PaymentMethod 	   | Creates a new payment method and returns it                        	 |
| /profiles/:profileId/addresses/:addressId/meters          	 | Meter         	   | Creates a new payment method and returns it                          |

### **PUT**

| **ENDPOINT**                                              	 | **RETURN TYPE** 	 | **DESCRIPTION**                                    	                    |
|-------------------------------------------------------------|-------------------|-------------------------------------------------------------------------|
| /profiles/:profileId                                      	 | Profile         	 | Updates the profile with id `:profileId` and returns it                 |
| /profiles/:profileId/addresses/:addressId                 	 | Address         	 | Updates the address with id `:addressId` and returns it                 |
| /profiles/:profileId/persons/:personId                    	 | Person          	 | Updates the person with id `:personId` and returns it                	  |
| /profiles/:profileId/paymentMethods/:paymentMethodId      	 | PaymentMethod   	 | Updates the payment method with id `:paymentMethodId` and returns it 	  |
| /profiles/:profileId/addresses/:addressId/meters/:meterId 	 | Meter           	 | Updates the meter with id `:meterId` and returns it                   	 |

### **DELETE**

| **ENDPOINT**                                              	 | **RETURN TYPE** 	 | **DESCRIPTION**                                    	                                  |
|-------------------------------------------------------------|-------------------|---------------------------------------------------------------------------------------|
| /profiles/:profileId                                      	 | Profile         	 | Deletes the profile with id `:profileId` and returns the deleted element              |
| /profiles/:profileId/addresses/:addressId                 	 | Address         	 | Deletes the address with id `:addressId` and returns the deleted element              |
| /profiles/:profileId/persons/:personId                    	 | Person          	 | Deletes the person with id `:personId` and returns the deleted element                |
| /profiles/:profileId/paymentMethods/:paymentMethodId      	 | PaymentMethod   	 | Deletes the payment method with id `:paymentMethodId` and returns the deleted element |
| /profiles/:profileId/addresses/:addressId/meters/:meterId 	 | Meter           	 | Deletes the meter with id `:meterId` and returns the deleted element                  |

# Resetting the DB

Changes using the endpoints above are persisted, locally, as a DB.
If you wish to reset the data with the initial randomized seeding, run the command::

### `npm run prisma:reset`

A quick command to both reset the DB and restart the backend is available as well:

### `npm run dev:restart`

#### NOTE: the reset and the restart commands will fail if the DB was not yet initialized with `npm run prisma:initialize`!

# Extra information

This server utilizes the fastify-autoload plugin to create endpoints.
This means that the folder structure in `modules` defines the endpoints themselves,
where folder names starting with an underscore (such as `_id`) indicate that it should
be treated as a dynamic path parameter.

E.g, if the folder structure is `profiles/_profileId`, this means that all endpoints registered in
fastify instances registered in this specific folder would live under that exact url, for example,
`profiles/1`, `profiles/abc`, `profiles/123-abc`, and so on.
