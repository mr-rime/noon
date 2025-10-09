import http from "k6/http";
import { check, sleep } from "k6";

// Config
export const options = {
    stages: [
        { duration: "10s", target: 5 }, // ramp up
        { duration: "20s", target: 5 }, // stay
        { duration: "10s", target: 0 }, // ramp down
    ],
};

// GraphQL endpoint
const url = "http://localhost:8000/graphql";

// GraphQL mutation (register)
const query = `
  mutation Register($first_name: String!, $last_name: String, $email: String!, $password: String!) {
    register(first_name: $first_name, last_name: $last_name, email: $email, password: $password) {
      success
      message
      user {
        id
        email
        first_name
      }
    }
  }
`;

// Generate random user data
function randomUser() {
    const id = Math.floor(Math.random() * 1e6); // random int up to 999999
    return {
        first_name: "User" + id,
        last_name: "Test" + id,
        email: `user${id}@example.com`,
        password: "pass" + id,
    };
}

export default function () {
    const user = randomUser();

    const payload = JSON.stringify({
        query,
        variables: user,
    });

    const headers = {
        "Content-Type": "application/json",
    };

    let res = http.post(url, payload, { headers });

    // Log results
    console.log("STATUS:", res.status);
    console.log("BODY:", res.body);

    // Validate
    check(res, {
        "status is 200": (r) => r.status === 200,
        "register success": (r) => {
            try {
                return r.json("data.register.success") === true;
            } catch (e) {
                return false;
            }
        },
    });

    sleep(Math.random() * 2);
}
