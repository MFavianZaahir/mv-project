"use server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { axiosConfig } from "../helper/token";
import { encrypt } from "../helper/bcrypt";
import { uploadImage, deleteImage } from "./imageUpload";

interface updateUser {
	username: string;
	gender: string;
	region: string;
	phone_number: string;
	birth_date: Date;
}

interface registerUser {
	username: string;
	email: string;
	password: string;
}

export const getUser = async () => {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas`,
			axiosConfig
		);
		return response.data;
	} catch (error) {
		throw new Error(`Error fetching data from Directus: ${error}`);
	}
};

export const findUserById = async (id: string) => {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas?filter[_and][0][id][_eq]=${id}`,
			axiosConfig
		);
		return response.data.data[0];
	} catch (error) {
		throw new Error(`Error fetching data from Directus: ${error}`);
	}
};

export const findUserByUsername = async (username: string) => {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas?filter[_and][0][id][_eq]=${username}`,
			axiosConfig
		);
		return response.data.data;
	} catch (error) {
		throw new Error(`Error fetching data from Directus: ${error}`);
	}
};

export const findUserByEmail = async (email: string) => {
	try {
		const findURL = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas?filter[_and][0][email][_eq]=${email}`;
		const response = await axios.get(findURL, axiosConfig);
		return response.data.data[0];
	} catch (error) {
		return { success: false, message: `error finding user ${error}` };
	}
};

export const registerUser = async (data: registerUser) => {
	try {
		const hashedPass = await encrypt(data.password);
		const postURL = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas`;
		await axios.post(
			postURL,
			{ password: hashedPass, username: data.username, email: data.email },
			axiosConfig
		);
		revalidatePath("/", "layout");
		return { success: true, message: `register success` };
	} catch (error) {
		return { success: false, message: `register failed ${error}` };
	}
};

export const updateUser = async ({
	id,
	data,
}: {
	id: string;
	data: updateUser;
}) => {
	try {
		const postURL = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas/${id}`;

		await axios.patch(
			postURL,
			{
				username: data.username,
				region: data.region,
				gender: data.gender,
				phone_number: data.phone_number,
				birth_date: data.birth_date,
			},
			axiosConfig
		);
		revalidatePath("/", "layout");
		return { success: true, message: `Update success` };
	} catch (error) {
		return { success: false, message: `Update failed ${error}` };
	}
};

export const updateUserPicture = async ({
	id,
	formData,
	oldPictureId,
}: {
	id: string;
	formData: FormData;
	oldPictureId?: string;
}) => {
	try {
		if (oldPictureId) {
			const isImageDeleted = await deleteImage(oldPictureId);
			if (isImageDeleted.success === false) {
				return { success: false, message: `Update failed` };
			}
		}

		const imageId = await uploadImage(formData.get("image"));

		const postURL = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/user_kel_bagas/${id}`;
		await axios.patch(
			postURL,
			{
				profile_picture: imageId.id,
			},
			axiosConfig
		);
		revalidatePath("/", "layout");
		return { success: true, message: `Update success` };
	} catch (error) {
		return { success: false, message: `Update failed ${error}` };
	}
};

export const getUserCompany = async (idUser: string) => {
	try {
		const getURL = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/corporations?filter[_and][0][contact_person][_eq]=${idUser}`;
		const response = await axios.get(getURL, axiosConfig);
		return response.data.data[0];
	} catch (error) {
		return {
			success: false,
			message: `error fetching user's company ${error}`,
		};
	}
};
