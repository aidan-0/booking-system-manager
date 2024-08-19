"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { Doctors } from "@/constants";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

export enum FormFieldType {
	INPUT = "input",
	TEXTAREA = "textarea",
	PHONE = "phone",
	CHECKBOX = "checkbox",
	DATE_PICKER = "datePicker",
	SELECT = "select",
	SKELETON = "skeleton",
	PHONE_INPUT = "phoneInput",
}

const AppointmentForm = ({
	userId,
	patientId,
	type,
	appointment,
	setOpen
}: {
	userId: string;
	patientId: string;
	type: "create" | "cancel" | "schedule";
	appointment?: Appointment;
	setOpen?: (open: boolean) => void;
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
    const AppointmentFormValidation = getAppointmentSchema(type);


	// Define a form using the `useForm` hook.
	const form = useForm<z.infer<typeof AppointmentFormValidation>>({
		resolver: zodResolver(AppointmentFormValidation),
		defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            schedule: appointment ? new Date(appointment.schedule) : new Date(),
            reason: appointment ? appointment.reason: '',
            note: appointment ? appointment.note : '',
			cancellationReason: appointment?.cancellationReason ?? '',
		},
	});

	// Define a function to handle form submission.
	async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
		setIsLoading(true);

        let status;

        switch(type) {
            case 'cancel':
                status = 'cancelled';
                break;
            case 'schedule':
                status = 'scheduled';
                break;
            default:
                status = 'pending';
                break;
        }


		try {
            if(type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                }
                const appointment = await createAppointment(appointmentData)

                if(appointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            } else {
				const appointmentToUpdate = {
					userId,
					appointmentId: appointment?.$id!,
					appointment: {
						primaryPhysician: values?.primaryPhysician,
						schedule: new Date(values?.schedule),
						status: status as Status,
						cancellationReason: values?.cancellationReason,
					},
					type
				}

				const updatedAppointment = await updateAppointment(appointmentToUpdate)

				if(updatedAppointment) {
					setOpen && setOpen(false)
					form.reset();
				}
			}

		} catch (error) {
			console.log(error);
		}
	}

    let buttonLabel;

    switch(type) {
        case 'create':
            buttonLabel = 'Request Appointment';
            break;
        case 'cancel':
            buttonLabel = 'Cancel Appointment';
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment';
            break;

        default:
            break;
    }

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 flex-1"
			>

				{type === 'create' && <section className="mb-12 space-y-4">
					<h1 className="header">New Appointment</h1>
					<p className="text-dark-700">Request a new appointment</p>
				</section>}
				

				{type !== "cancel" && (
					<>
						{/* Dr Select */}
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.SELECT}
							name="primaryPhysician"
							label="Doctor"
							placeholder="Select your doctor"
						>
							{Doctors.map((doctor) => (
								<SelectItem
									key={doctor.name}
									value={doctor.name}
								>
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

						{/* Select Time */}
						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="schedule"
							label="Appointment Date"
							showTimeSelect
							dateFormat="dd/MM/yyyy h:mm aa"
						/>

						<div className="flex flex-col gap-6 xl:flex-row">
							<CustomFormField
								control={form.control}
								fieldType={FormFieldType.TEXTAREA}
								name="reason"
								label="Reason for appointment"
								placeholder="Enter reason for appointment"
							/>

							<CustomFormField
								control={form.control}
								fieldType={FormFieldType.TEXTAREA}
								name="note"
								label="Notes"
								placeholder="Enter notes"
							/>
						</div>
					</>
				)}

				{type === "cancel" && (
					<CustomFormField
						control={form.control}
						fieldType={FormFieldType.TEXTAREA}
						name="cancellationReason"
						label="Reason for cancellation"
						placeholder="Enter reason for cancellation"
					/>
				)}

				<SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
			</form>
		</Form>
	);
};

export default AppointmentForm;
