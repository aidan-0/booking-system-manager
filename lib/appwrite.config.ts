import * as sdk from 'node-appwrite';

// destructuring environment variables
export const {
	PROJECT_ID,
	API_KEY,
	DATABASE_ID,
	PATIENT_COLLECTION_ID,
	DOCTOR_COLLECTION_ID,
	APPOINTMENT_COLLECTION_ID,
	NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;



console.log(`Endpoint: ${ENDPOINT!}, Project ID: ${PROJECT_ID!}, API Key: ${API_KEY}`);


const client = new sdk.Client();

// Exposes the Appwrite SDK's, functionalities, and everything else.
client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);
console.log(`Endpoint: ${ENDPOINT!}, Project ID: ${PROJECT_ID!}, API Key: ${API_KEY}`);
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);

console.log(`Endpoint: ${ENDPOINT!}, Project ID: ${PROJECT_ID!}, API Key: ${API_KEY}`);