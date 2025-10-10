import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    stages: [
        { duration: "30s", target: 100 },
        { duration: "30s", target: 500 },
        { duration: "30s", target: 1000 },
        { duration: "2m", target: 1000 },
        { duration: "30s", target: 0 },
    ],
};

const url = "http://localhost:8000/graphql";

const registerMutation = `
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

const getHomeQuery = `
  query GetHome($limit: Int, $offset: Int, $search: String) {
    getHome(limit: $limit, offset: $offset, search: $search) {
      success
      message
      home {
        recommendedForYou {
          id
          name
          price
          final_price
          currency
          stock
        }
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

    let registerRes = http.post(url, JSON.stringify({ query: registerMutation, variables: user }), { headers: { "Content-Type": "application/json" } });

    check(registerRes, {
        "register status 200": (r) => r.status === 200,
        "register success": (r) => {
            try {
                return r.json("data.register.success") === true;
            } catch {
                return false;
            }
        },
    });

    console.log("REGISTER RESPONSE:", registerRes.body);

    let homeRes = http.post(url, JSON.stringify({ query: getHomeQuery, variables: { limit: 10, offset: 0, search: "" } }), { headers: { "Content-Type": "application/json" } });

    check(homeRes, {
        "home status 200": (r) => r.status === 200,
        "home success": (r) => {
            try {
                return r.json("data.getHome.success") === true;
            } catch {
                return false;
            }
        },
    });

    console.log("HOME RESPONSE:", homeRes.body);

    sleep(Math.random() * 2);
}
