import { Users } from 'lucide-react'
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';


interface personalInformationData {
    name: string;
    phone_number: string;
    email?: string
}

const Personal_Information: React.FC = () => {

    const { register, formState: { errors } } = useFormContext<personalInformationData>();
    
    const {t} = useTranslation();

    return (
        <section className="bg-white rounded-2xl flex flex-col justify-center p-8 gap-4 shadow-lg border border-gray-200 hover:shadow-2xl">
            <div className="flex gap-2 items-center justify-center">
                <Users />
                <h2 className="text-lg font-bold">{t("your_information")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:items-center gap-2 sm:flex-row sm:gap-4">
                <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                    <label>{t("full_name")} *</label>
                    <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        className="flex-1 border border-gray-300 px-3 py-2 bg-gray-50  text-gray-900 text-sm rounded-lg focus:border-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        {...register("name", {
                            required: "Full Name is Required..",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 cahrecters"
                            }
                        })}
                    />
                    {
                        errors.name && (
                            <p className='text-red-500 text-sm'>{errors.name.message}</p>
                        )
                    }
                </div>
                <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                    <label>{t("phone_number")} *</label>
                    <input
                        type="text"
                        placeholder="Enter Your Phone Number"
                        className="flex-1 border border-gray-300 px-3 py-2 bg-gray-50  text-gray-900 text-sm rounded-lg focus:border-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        {...register("phone_number", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^[+]?[\d\s\-()]{10,}$/,
                                message: "Please enter a valid phone number"
                            }
                        })}
                    />
                    {errors.phone_number && (
                        <p className="text-red-500 text-sm">{errors.phone_number.message}</p>
                    )}
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                    <label>{t("email_address")}</label>
                    <input
                        type="email"
                        placeholder="your.email@gmail.com"
                        className="flex-1 border border-gray-300 px-3 py-2 bg-gray-50  text-gray-900 text-sm rounded-lg focus:border-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        {...register("email", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email address"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>
            </div>
        </section>

    )
}

export default Personal_Information