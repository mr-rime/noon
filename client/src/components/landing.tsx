import { useMutation, useQuery } from "@apollo/client"
import { GET_USERS } from "../graphql/user"
import { LOGIN } from "../graphql/auth";
import { SlideableImages } from "./slideable-images";
import { Product } from "./prodcut";

export function Landing() {
    const { data: users } = useQuery(GET_USERS)
    const [,] = useMutation(LOGIN);
    console.log(users)
    console.log('renders')

    return (
        <div className="flex flex-col justify-center w-full min-h-screen">
            {/* Optional Login Button */}
            {/* 
            <button 
                onClick={() => login({ variables: { email: "fsares4sdfasdf@gmail.com", password: "ahmed12345" } })} 
                className="cursor-pointer"
            >
                login
            </button> 
            */}

            <div className="w-full flex items-center justify-center px-4 mt-10 transition-all duration-300 ease-in-out overflow-x-hidden">
                <SlideableImages />
            </div>

            <div className="m-5">
                <Product />
            </div>
        </div>
    )
}
