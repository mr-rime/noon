import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    stages: [
        { duration: "30s", target: 50 },
        { duration: "1m", target: 50 },
        { duration: "30s", target: 200 },
        { duration: "2m", target: 200 },
        { duration: "30s", target: 0 },
    ],
};

const url = "http://127.0.0.1:8000/graphql";

const query = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        email
      }
    }
  }
`;

const variables = {
    email: "oms51857@gmail.com",
    password: "oms51857@gmail.com",
};

export default function () {
    const headers = {
        "Content-Type": "application/json",
    };

    const payload = JSON.stringify({
        query,
        variables,
    });

    let res = http.post(url, payload, { headers });

    console.log("STATUS:", res.status);
    console.log("BODY:", res.body);

    check(res, {
        "status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
