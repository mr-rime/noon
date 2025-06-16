import { useQuery } from "@apollo/client";
import { Button } from "../../../ui/button";
import { ContactInformation } from "./components/contact-information";
import { PersonalInformation } from "./components/personal-information";
import { GET_USER } from "../../../../graphql/user";
import { userHash } from "../../../../constants/cookies";
import type { User } from "../../../../types";

export function ProfileInformation() {
    const { data, loading } = useQuery<{ getUser: { user: User } }>(GET_USER, { variables: { hash: userHash } })
    return (
        <section className="w-full h-screen">
            <h1 className="font-bold text-[28px]">
                Profile
            </h1>
            <p className="text-[#7e859b] text-[1rem]">
                View & Update Your Personal and Contact Information
            </p>

            <section className="mt-5 ">
                <ContactInformation user={data?.getUser.user} loading={loading} />
                <PersonalInformation user={data?.getUser.user} loading={loading} />
                <Button disabled className="w-full max-w-[300px] rounded-[8px] bg-[#7e859b] hover:bg-[#7e859b] h-[48px] text-[14px] px-[32px] uppercase text-[#cbcfd7] mt-5">
                    Update Profile
                </Button>
            </section>
        </section>
    )
}
