import React from "react";
import SideNavigation from "./../components/SideNavigation";
import ProfileCard from './../components/ProfileCard';
import { useEffect } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { useRouter } from 'next/router';

function Profile() {

  const supabase = useSupabaseClient()
  const [posts,setPosts] =useState([])
  const session = useSession();
const router = useRouter();

  const getPosts = async () => {
    const {data} = await supabase.from('posts').select('id , content , created_at , photos , profiles(id,avatar,name)').is('parentId',null).eq('author',router?.query?.id).order('created_at',{ascending: false});
  //console.log(data)
    setPosts(data)
    
  }
  useEffect( ()=> {
    if(router?.query?.id){
    getPosts()
    }

  }, [router,getPosts])
  

  return (
    <div className="bg-slate-50 h-screen flex   overflow-y-auto scrollbar-hide">
      <SideNavigation />
      <ProfileCard posts = {posts}/>
    </div>
  );
}

export default Profile;
