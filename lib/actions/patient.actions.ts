"use server";

import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
	try {
		const newUser = await users.create(
            // passed in this order to match the Appwrite docs interface
			ID.unique(),
			user.email,
			user.phone,
			undefined, // password
			user.name
		)
		console.log({ newUser });

		return parseStringify(newUser);


	} catch (error: any) {
		console.log('error')
		console.error(error);
		// Check if user already exists
		if (error && error?.code === 409) {
			const documents = await users.list([
				Query.equal('email', [user.email])
			])

			return documents?.users[0];
		}
	}
};
