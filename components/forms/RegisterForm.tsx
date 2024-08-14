"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "@radix-ui/react-label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// Define a form using the `useForm` hook.
	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormDefaultValues,
			name: "",
			email: "",
			phone: "",
		},
	});

	// Define a function to handle form submission.
	async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
		setIsLoading(true);

		let formData;

		if(values.identificationDocument && values.identificationDocument.length > 0) {
			const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type });

			formData = new FormData();
			formData.append("blobFile", blobFile);
			formData.append('fileName', values.identificationDocument[0].name);
		}


		try {
			const patientData = {
				...values,
				userId: user.$id,
				birthDate: new Date(values.birthDate),
				identificationDocument: formData,
			}

			// @ts-ignore
			const patient = await registerPatient(patientData);

			if(patient) router.push(`/patients/${user.$id}/new-appointment`)
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-12 flex-1"
			>
				<section className="space-y-4">
					<h1 className="header">Welcome</h1>
					<p className="text-dark-700">
						Let us know more about yourself
					</p>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Personal Information</h2>
					</div>
				</section>

				{/* Name */}
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name="name"
					label="Full Name"
					placeholder="Enter your full name"
					iconSrc="/assets/icons/user.svg"
					iconAlt="User icon"
				/>

				<div className="flex flex-col gap-6 xl:flex-row">
					{/* Email */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.INPUT}
						name="email"
						label="Email"
						placeholder="Enter your email"
						iconSrc="/assets/icons/email.svg"
						iconAlt="Email icon"
					/>

					{/* Phone */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.PHONE_INPUT}
						name="phone"
						label="Phone"
						placeholder="401 234 567"
					/>
				</div>

				<div className="flex flex-cold gap-6 xl:flex-row">
					{/* Birthday */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.DATE_PICKER}
						name="birthDate"
						label="Date of Birth"
					/>

					{/* Gender */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.SKELETON}
						name="gender"
						label="Gender"
						renderSkeleton={(field) => (
							<FormControl>
								<RadioGroup
									className="flex h-11 gap-2 xl: justify-between"
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									{GenderOptions.map((option) => (
										<div
											key={option}
											className="radio-group"
										>
											<RadioGroupItem
												value={option}
												id={option}
											/>
											<Label
												htmlFor={option}
												className="cursor-pointer"
											>
												{option}
											</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
						)}
					/>
				</div>

				<div className="flex flex-cold gap-6 xl:flex-row">
					{/* Address */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.INPUT}
						name="address"
						label="Address"
						placeholder="Enter your address"
					/>

					{/* Occupation */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.INPUT}
						name="occupation"
						label="Occupation"
						placeholder="Enter your occupation"
					/>
				</div>

				<div className="flex flex-cold gap-6 xl:flex-row">
					{/* Email */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.INPUT}
						name="emergencyContactName"
						label="Emergency Contact Name"
						placeholder="Contact name"
					/>

					{/* Phone */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.PHONE_INPUT}
						name="emergencyContactNumber"
						label="Emergency Contact Number"
						placeholder="401 234 567"
					/>
				</div>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Medical Information</h2>
					</div>
				</section>

				{/* Primary Physician */}
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.SELECT}
					name="primaryPhysician"
					label="Primary Physician"
					placeholder="Select primary physician"
				>
					{Doctors.map((doctor) => (
						<SelectItem key={doctor.name} value={doctor.name}>
							<div className="flex cursor-pointer items-center gap-2">
								<Image
									src={doctor.image}
									alt={doctor.name}
									width={32}
									height={32}
									className="rounded-full border border-dark-500"
								/>
								<p>{doctor.name}</p>
							</div>
						</SelectItem>
					))}
				</CustomFormField>

				<div className="flex flex-cold gap-6 xl:flex-row">
					{/* Insurance Provider */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.INPUT}
						name="insuranceProvider"
						label="Insurance Provider"
						placeholder="Insurance Provider"
					/>

					{/* Insurance Policy Number */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.INPUT}
						name="insurancePolicyNumber"
						label="Insurance Policy Number"
						placeholder="ABC123456789"
					/>
				</div>

				<div className="flex flex-cold gap-6 xl:flex-row">
					{/* Allergies */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.TEXTAREA}
						name="allergies"
						label="Allergies (if any)"
						placeholder="List any allergies you have"
					/>

					{/* Current Medication */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.TEXTAREA}
						name="currentMedication"
						label="Current Medication (if any)"
						placeholder="Current Medication"
					/>
				</div>

				<div className="flex flex-cold gap-6 xl:flex-row">
					{/* Family Medical History */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.TEXTAREA}
						name="familyMedicalHistory"
						label="Family Medical History"
						placeholder="Family Medical History"
					/>

					{/* Past Medical History */}
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.TEXTAREA}
						name="pastMedicalHistory"
						label="Past Medical History"
						placeholder="Past Medical History"
					/>
				</div>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">
							Identification and Verification
						</h2>
					</div>
				</section>

				{/* Identification Type */}
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.SELECT}
					name="identificationType"
					label="Identification Type"
					placeholder="Select identification type"
				>
					{IdentificationTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</CustomFormField>

				{/* Identification Number */}
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name="identificationNumber"
					label="Identification Number"
					placeholder="ABC123456789"
				/>

				{/* Document Upload */}
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.SKELETON}
					name="identificationDocument"
					label="Identification Document"
					renderSkeleton={(field) => (
						<FormControl>
							<FileUploader
								files={field.value}
								onChange={field.onChange}
							/>
						</FormControl>
					)}
				/>

			{/* Consent and Privacy */}
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">
							Consent and Privacy
						</h2>
					</div>
				</section>

				<CustomFormField 
					fieldType={FormFieldType.CHECKBOX}	
					control={form.control}
					name="treatmentConsent"
					label="I consent to treatment"
				/>

				<CustomFormField 
					fieldType={FormFieldType.CHECKBOX}	
					control={form.control}
					name="disclosureConsent"
					label="I consent disclosure of information"
				/>

				<CustomFormField 
					fieldType={FormFieldType.CHECKBOX}	
					control={form.control}
					name="privacyConsent"
					label="I consent to privacy policy"
				/>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default RegisterForm;
