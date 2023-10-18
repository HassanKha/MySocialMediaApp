import React from "react";
import Profile from "./../Profile";
import { useRouter } from "next/router";
function id() {
  const router = useRouter();
  console.log(router)
  return <Profile />;
}

export default id;
