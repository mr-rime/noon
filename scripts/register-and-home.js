import http from "k6/http";
import { check, sleep } from "k6";

// Config
export const options = {
  stages: [
    { duration: "30s", target: 100 },   // ramp up to 100 users
    { duration: "30s", target: 500 },   // ramp up to 500 users
    { duration: "30s", target: 1000 },  // ramp up to 1000 users
    { duration: "2m", target: 1000 },   // stay at 1000 users
    { duration: "30s", target: 0 },     // ramp down
  ],
};

const url = "http://localhost:8000/graphql";

// Register mutation
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

// Home query
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

// Random user generator
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

    // --- 1. Register ---
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

    // Optional log
    console.log("REGISTER RESPONSE:", registerRes.body);

    // --- 2. Get Home ---
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

    // --- Pause before next iteration ---
    sleep(Math.random() * 2);
}
