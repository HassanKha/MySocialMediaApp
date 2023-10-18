import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";
import Login from "./Login";
import SideNavigation from "./../components/SideNavigation";
import InputPost from "./../components/InputPost";
import Posts from "./../components/Posts";
import { useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import {UserContext} from "../context/Usercontext"
export default function Home() {
  const session = useSession();
const supabase = useSupabaseClient()
const [posts,setPosts] =useState([])
const [profiles,setProfiles] =useState([])

const getPosts = async () => {
  const {data} = await supabase.from('posts').select('id , content , created_at , photos , profiles(id,avatar,name)').is('parentId',null).order('created_at',{ascending: false});
console.log(data)
  setPosts(data)
  
}

const getProfiles = async () => {
  const {data} = await supabase.from('profiles').select();
//console.log(data, "hey")

setProfiles(data)
  
}

useEffect( ()=> {
  if (!session?.user?.id) {
    return ;
  }
  getProfiles()

}, [session?.user?.id])

useEffect( ()=> {
  getPosts()
  //getProfiles()
}, [])


  if (!session) {
    return <Login />;
  }

  return (
    <main className="bg-slate-50 h-screen flex  justify-between overflow-y-auto scrollbar-hide">
      <UserContext.Provider value={{profiles}}>
      {/* sideNavigation */}
      <SideNavigation />
      <div className="flex flex-col flex-grow">
        {/* inputPost */}
        <InputPost getPosts={getPosts} />
        {/* posts */}
        <Posts posts={posts}  />
      </div>
      </UserContext.Provider>
    </main>
  );
}
