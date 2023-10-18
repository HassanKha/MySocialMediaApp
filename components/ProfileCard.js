import React, { useState, useEffect , useRef } from "react";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "@supabase/auth-helpers-react";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Posts from './Posts';

function ProfileCard({posts}) {
  const [profile, setprofile] = useState(null);
  const [loading, setloading] = useState(true);
  const [loadingpic, setloadingpic] = useState(true);
  const [Editable, setEditable] = useState(false);
  const NAMEREF = useRef(null);
  const PLACEREF = useRef(null);
  const router = useRouter();
  const userId = router.query.id;
  const { pathname } = router;
  const session = useSession();
  const supabase = useSupabaseClient();
  const FetchCurrentProfile = async () => {
    const UserProfile = await supabase
      .from("profiles")
      .select()
      .eq("id", userId);
    console.log(UserProfile);
    setprofile(UserProfile.data[0]);
  };
  useEffect(() => {
    if (!userId) {
      return;
    }

    FetchCurrentProfile();
  }, [userId]);

  const ChangeProfileCover = async (e) => {
    console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) {
      const newName = Date.now() + file.name;
      setloading(false);
      const result = await supabase.storage
        .from("covers")
        .upload(newName, file);
      if (result.data) {
        const url =
          process.env.NEXT_PUBLIC_SUPABASE_URL +
          "/storage/v1/object/public/covers/" +
          newName;

        await supabase
          .from("profiles")
          .update({
            cover: url,
          })
          .eq("id", userId);
        setloading(true);
      }
    }

    FetchCurrentProfile();
  };

  const ChangeProfilePic = async (e) => {
    console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) {
      const newName = Date.now() + file.name;
      setloadingpic(false);
      const result = await supabase.storage
        .from("profilepics")
        .upload(newName, file);
      if (result.data) {
        const url =
          process.env.NEXT_PUBLIC_SUPABASE_URL +
          "/storage/v1/object/public/profilepics/" +
          newName;

        await supabase
          .from("profiles")
          .update({
            avatar: url,
          })
          .eq("id", userId);
        setloadingpic(true);
      }
    }

    FetchCurrentProfile();
  };

  const updateProfileInfo = async () => {

console.log(NAMEREF.current.value , PLACEREF.current.value)

await supabase.from("profiles").update({
  name : NAMEREF.current.value ,
  place : PLACEREF.current.value
}).eq('id', userId)

    setEditable(false)
    FetchCurrentProfile()
  }

  const ismyuser = userId === session?.user?.id;

  return (
    <div className=" shadow-sm shadow-[#141413] ml-10 mt-10 mr-10  w-screen h-[20rem]  ">
      <div className="relative bg-black h-1/2">
        <img
          className={`object-cover w-full h-full ${
            !loading ? "opacity-0.1 blur-sm" : ""
          }  `}
          src={profile?.cover}
        />
        {ismyuser && (
          <label
            onChange={FetchCurrentProfile}
            className="absolute bottom-0 right-0 cursor-pointer  shadow-lg shadow-black rounded-xl bg-white z-10 "
          >
            <AddPhotoAlternateRoundedIcon
              className="text-[3rem] rounded-xl  "
              color="primary"
            />
            <input type="file" onChange={ChangeProfileCover} hidden />
          </label>
        )}
      </div>
      <div className="flex flex-col h-1/2 w-full bg-white ">
        <div className="flex items-center justify-between gap-3  w-full p-1 ">
          <div className="relative flex  ml-20  justify-center items-center ">
            <Avatar
              sx={{ height: "100px", width: "100px" }}
              className={`${!loadingpic ? "opacity-0.1 blur-sm" : ""}  `}
              width={150}
              height={150}
              src={profile?.avatar}
            />
            {ismyuser && (
              <label
                onChange={FetchCurrentProfile}
                className="absolute bottom-0 right-0 flex items-center justify-center cursor-pointer shadow-lg bg-white shadow-black rounded-xl z-10 "
              >
                <AddPhotoAlternateRoundedIcon
                  className="text-[1.5rem] rounded-lg   "
                  color="primary"
                />
                <input type="file" onChange={ChangeProfilePic} hidden />
              </label>
            )}
          </div>
          <div className=" flex justify-between flex-grow">
            <div className="">
              {!Editable ?  (
                <>
                <h1 className="text-2xl font-medium">{profile?.name}</h1>
              <p className="text-sm">{profile?.place}</p>
              </>
              ) :( <div className="flex flex-col gap-1 p-1">
              <input type="text" placeholder="YOUR NEW NAME" ref={NAMEREF} className="outline-none  border-spacing-1 rounded-md shadow-xl  shadow-black"/>
              <input type="text" placeholder="YOUR NEW PLACE" ref={PLACEREF} className="outline-none border-spacing-1 rounded-md shadow-xl  shadow-black"/>
              </div>
              )
}
            </div>
            {ismyuser && !Editable && (
              <div>
                <Button onClick={() => setEditable(true)} className=" bg-white shadow-lg shadow-black">
                  Edit My Profile
                </Button>
              </div>
               
            )}
             {ismyuser && Editable && (
             
              <div className='flex gap-2 justify-center items-center'>
                <Button onClick={() => updateProfileInfo() } className=" bg-white shadow-lg shadow-black">
                  Save Profile
                </Button>
                <div>
              <Button onClick={() => setEditable(false)} className=" bg-white shadow-lg shadow-black">
                Cancel
              </Button>
            </div>
              </div>
              
           
            )}
          </div>
        </div>
        <div className=" ml-10 pb-3 pt-2 flex gap-2">
          <IconButton className=" flex gap-1">
            <PostAddOutlinedIcon />
            <p className="text-lg">Posts</p>
          </IconButton>
          <IconButton className=" flex gap-1">
            <Diversity1OutlinedIcon />
            <p className="text-lg">Friends</p>
          </IconButton>
          <IconButton className=" flex gap-1">
            <InfoOutlinedIcon />
            <p className="text-lg">About</p>
          </IconButton>
          <IconButton className=" flex gap-1">
            <PhotoSizeSelectActualOutlinedIcon />
            <p className="text-lg">Photos</p>
          </IconButton>
        </div>
        <Posts posts={posts}  />
      </div>
    </div>
  );
}

export default ProfileCard;
