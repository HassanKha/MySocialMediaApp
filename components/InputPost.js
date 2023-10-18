import React, { useEffect, useState, useContext } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoodIcon from "@mui/icons-material/Mood";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useSession } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import { UserContext } from "./../context/Usercontext";
import  Image  from 'next/image';

function InputPost({ getPosts }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState("");
  const [uploads, setUploads] = useState([]);

  const { profiles } = useContext(UserContext);
  //console.log(profiles, "con");
  const selectcurrentuser = async () => {
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id);

    setProfile(data[0]);
    //console.log(data);
  };

  const onPost = async (e) => {
    e.preventDefault();
    const insertingPost = await supabase.from("posts").insert({
      author: session.user.id,
      content: content,
      photos: uploads
    });

   // console.log(insertingPost);
    getPosts();
    setContent("");
    setUploads([]);
  };

  const selectPhoto = async (e) => {
    const files = e.target.files;
    for (const file of files) {
     // console.log(file);
      const newName = Date.now() + file.name;
    const result = await supabase.storage.from('files').upload(newName,file);
    console.log(result);
    if(result.data){
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/files/' + newName;
        //console.log(file.name)
        setUploads(prevUploads =>[...prevUploads,url]);
       // console.log(uploads)
    }

    }
  };
//   https://coweuulizktfyvvrhhdb.supabase.co/storage/v1/object/public/files/1697381381635web.jpg
  useEffect(() => {
    selectcurrentuser();
  }, []);
 // console.log(uploads)
  return (
    <form className="flex sticky justify-center items-center flex-col  mt-10 p-3 shadow-sm shadow-[#141413] ">
      <div className="flex justify-center items-center h-full w-1/2">
        <Avatar
          src={profile && profile.avatar}
          width={50}
          height={50}
          className="mr-3 "
        />
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder={`What's on your mind , ${profile && profile.name} ?`}
          className="flex-grow  align-middle resize-none h-full focus:outline-none rounded-full pt-5 px-5"
        />
      </div>
      <div className="flex gap-1  rounded-md ">
      {
        uploads ?  uploads.map((upload)=> (

    <Image key={upload} src={upload} alt={upload} className="p-1 rounded-md " 
           width={50} height={50}/>

        )) : <div>Loading...</div>
      }
      </div>
      <div className="flex justify-between items-center p-1 w-1/2  ">
  
        <div className="flex  flex-grow    ">
          <label className="flex rounded-md justify-between items-center px-2 py-1  delay-250 transition hover:bg-[#FFECD1] ">
            <input onChange={selectPhoto} type="file" multiple className="hidden" />
            <PhotoSizeSelectActualOutlinedIcon />
            <h3 className="px-2 ">Photos</h3>
          </label>
          <div className="flex rounded-md justify-between items-center pr-2 py-1 delay-250 transition hover:bg-[#FFECD1]">
            <PeopleAltIcon className="ml-2" />
            <h3 className="px-2">People</h3>
          </div>
          <div className="flex rounded-md justify-between items-center  px-2 py-1  delay-250 transition hover:bg-[#FFECD1]">
            <LocationOnIcon />
            <h3 className="px-2">Check-in</h3>
          </div>
          <div className="flex rounded-md justify-between items-center px-2 py-1  delay-250 transition hover:bg-[#FFECD1] ">
            <MoodIcon />
            <h3 className="px-2 ">Mood</h3>
          </div>
        </div>
        <Button
          onClick={onPost}
          type="submit"
          className="p-1 text-black text-sm shadow-[#141413] bg-white shadow-sm hover:bg-[#FFECD1]"
        >
          POST
        </Button>
      </div>
    </form>
  );
}

export default InputPost;
