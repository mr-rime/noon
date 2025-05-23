import { useMutation, useQuery } from "@apollo/client"
import { GET_USERS } from "../graphql/user"
import { LOGIN } from "../graphql/auth";

export function Landing() {
    const { loading, error, data: users } = useQuery(GET_USERS)
    const [login, { data }] = useMutation(LOGIN);
    console.log(users)
    console.log('renders')
    return (
        <div>landing
            <button onClick={() => login({ variables: { email: "fsares4sdfasdf@gmail.com", password: "ahmed12345" } })} className="cursor-pointer">login</button>
        </div>
    )
}
