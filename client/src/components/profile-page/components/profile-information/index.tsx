import { ContactInformation } from "./components/contact-information";
import { PersonalInformation } from "./components/personal-information";

export function ProfileInformation() {
    return (
        <section className="w-full">
            <h1 className="font-bold text-[28px]">
                Profile
            </h1>
            <p className="text-[#7e859b] text-[1rem]">
                View & Update Your Personal and Contact Information
            </p>

            <section className="mt-5 ">
                <ContactInformation />
                <PersonalInformation />
            </section>
        </section>
    )
}
