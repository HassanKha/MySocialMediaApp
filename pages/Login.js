import React , {useRef} from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@mui/material/Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

function Login() {

const supabase = useSupabaseClient();

//console.log(supabase.auth)
function loginWithGoogle() {

  supabase.auth.signInWithOAuth( {
    provider: 'google',
  })

}

  return (
    <div className="flex justify-center items-center h-screen bg-[#141413] ">
      <div className="bg-[#FFECD1] p-3 flex items-center justify-center ">
        <GoogleIcon className="mr-4" />
        <Button onClick={loginWithGoogle} className="text-[#141413]">Sign in with GOOGLE</Button>
      </div>
    </div>
  );
}

export default Login;
