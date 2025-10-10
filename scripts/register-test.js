import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    stages: [
        { duration: "10s", target: 5 },
        { duration: "20s", target: 5 },
        { duration: "10s", target: 0 },
    ],
};

const url = "http://localhost:8000/graphql";

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

function randomUser() {
    const id = Math.floor(Math.random() * 1e6);
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

    console.log("STATUS:", res.status);
    console.log("BODY:", res.body);

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
