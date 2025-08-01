import cookieSession from "cookie-session";

import { generateExpirationDate } from "../lib/date";

export const cookie_session = cookieSession({
  name: "admin_session",
  keys: [process.env.JWT_SECRET || "gclient_admin_keys"],
  secure: process.env.NODE_ENV === "production", //on localhost set to false
  httpOnly: true,
  // domain: "gclient.com",
  path: "/gclient/api",
  expires: generateExpirationDate(1, 0), //set to 1hour
  sameSite: "strict",
});

// errol and make payment before they can access coursees
// the learner register by themselfves
