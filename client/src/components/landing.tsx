import { useMutation, useQuery } from "@apollo/client"
import { GET_USERS } from "../graphql/user"
import { LOGIN } from "../graphql/auth";
import { SlideableImages } from "./slideable-images";

export function Landing() {
    const { data: users } = useQuery(GET_USERS)
    const [login,] = useMutation(LOGIN);
    console.log(users)
    console.log('renders')
    return (
        <div>
            {/* <button onClick={() => login({ variables: { email: "fsares4sdfasdf@gmail.com", password: "ahmed12345" } })} className="cursor-pointer">login</button> */}
            <SlideableImages />
        </div>
    )
}
