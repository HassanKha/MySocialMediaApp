import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from "next/link";
import { useSession } from '@supabase/auth-helpers-react';
function SideNavigation() {

    const supsbase = useSupabaseClient();
    const session = useSession();
    const Logout = async () => {
       await supsbase.auth.signOut();
    }
  return (
    <div className="shadow-sm shadow-[#141413] text-[#141413] ml-10 bg-white items-center mt-10  sticky flex flex-col w-[12rem] h-[20rem] px-2 py-3 rounded-md ">
        <div className="flex w-full pb-3 ml-5    rounded-md ">
            <h1>Navigation</h1>
        </div>
      <Link href={"/"} className="flex w-full hover:bg-[#FFECD1]  p-2 m-2 rounded-md cursor-pointer hover:scale-125 delay-250 transition">
        <HomeIcon    className="mr-5" />
        <h1>Home</h1>
      </Link>
      <Link href={"/profile/" + session.user.id} className="flex w-full hover:bg-[#FFECD1]  p-2 m-2 rounded-md cursor-pointer hover:scale-125 delay-250 transition">
        <AccountBoxIcon   className="mr-5" />
        <h1>Profile</h1>
      </Link>
      <div className= "flex w-full hover:bg-[#FFECD1]  p-2 m-2 rounded-md cursor-pointer hover:scale-125 delay-250 transition">
        <TurnedInNotIcon   className="mr-5" />
        <h1>Saved Posts</h1>
      </div>
      <div  className="flex w-full hover:bg-[#FFECD1]  p-2 m-2 rounded-md cursor-pointer hover:scale-125 delay-250 transition">
        <NotificationsIcon  className="mr-5" />
        <h1>Notifications</h1>
      </div>
      <div onClick={Logout}  className="flex w-full hover:bg-[#FFECD1]  p-2 m-2 rounded-md cursor-pointer hover:scale-125 delay-250 transition ">
        <LogoutIcon className="mr-5" />
        <h1>LogOut</h1>
      </div>
    </div>
  );
}

export default SideNavigation;
