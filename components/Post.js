import React, { useContext, useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TimeAgo from "timeago-react";
import IconButton from "@mui/material/IconButton";
import { UserContext } from "../context/Usercontext";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {useSession} from "@supabase/auth-helpers-react"
function Post({ id, content, profile, created_at, photos }) {
  const { profiles } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [likes, setlikes] = useState([]);
  const [Dislike, setDislike] = useState(false);
  const [comment, setComment] = useState("");
  const [fetchcommented, setfetchcommented] = useState([]);
  const session = useSession();

  const Likeit = async () => {
    const mylike = await supabase
      .from("likes")
      .select()
      .eq("userId", session.user.id)
      .eq("postId", id);
    console.log(mylike.data.length, "length",mylike.data);


    if (mylike.data.length > 0) {
      const del = await supabase
        .from("likes")
        .delete()
        .eq("userId", session.user.id)
        .eq("postId", id);
      console.log(del, "del");
      GetLikes();
      setDislike(false);
      return;
    }

    const like = await supabase.from("likes").insert({
      postId: id,
      userId: session.user.id,
    });
    console.log(like, "liked");
    GetLikes();
    setDislike(true);
  };
  const GetLikes = async () => {
    const like = await supabase.from("likes").select().eq("postId", id);

    setlikes(like.data);
  };
  

  const INSERTCOMMENT = async (e) => {
    e.preventDefault();
   // console.log(comment);
    const Insert = await supabase.from("posts").insert({
      content: comment,
      author: MyProfile.id,
      parentId: id,
    });
   // console.log( Insert , 'insert')
    setComment("");
    GETCOMMENTS();
    
  };

  const GETCOMMENTS = async () => {
  
   const Comments =  await supabase.from("posts").select('id , content , created_at , photos , profiles(id,avatar,name)').eq('parentId',id);

   setfetchcommented(Comments.data)
   //console.log(Comments)
  };
  useEffect(() => {
    GetLikes();
    GETCOMMENTS();
  }, [likes, setlikes , GetLikes , GETCOMMENTS]);
  const MyProfile = profiles?.find((pro)=> pro.id === session.user.id)
  const Likedbyme = likes?.find((like) => like.userId === profile.id);
  
 // console.log(MyProfile , 'all')
  return (
    <div className="px-8 shadow-sm shadow-[#141413] py-3 rounded-md bg-white m-4 w-1/2 ">
      <div className="flex gap-2">
        <div className="flex items-center justify-center">
          <Avatar
            sx={{ height: "65px", width: "65px" }}
            src={profile.avatar}
            width={50}
            height={50}
          />
        </div>
        <div className="flex flex-col  justify-center">
          <h4 className="text-sm ">
            <Link href={"/profile/" + profile.id} className="text-sm font-bold">
              {profile.name}{" "}
            </Link>{" "}
            shared a post{" "}
          </h4>
          <h4 className="text-xs p-0">
            <TimeAgo datetime={created_at} />
          </h4>
        </div>
      </div>
      <div className="my-2 flex flex-col gap-2">
        <div className="py-2">
          <p>{content}</p>
        </div>
        {photos.length > 0 ? (
          <div className=" flex items-center justify-center rounded-md w-full  bg-white">
            {photos &&
              photos.map((photo) => (
                <div className="w-full" key={photo}>
                  <img
                    className="rounded-md object-cover "
                    // objectFit="cover"
                    // layout="fill"
                    key={photo}
                    src={photo}
                    alt={photo}
                  
                  />
                </div>
              ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-10 py-1 ">
        <IconButton
          onClick={Likeit}
          className={`flex items-center justify-center gap-2 ${
            Likedbyme ? "rounded-full bg-slate-50 shadow-black shadow-xl" : ""
          }  `}
        >
          <FavoriteBorderIcon />
          <h1>{likes?.length}</h1>
        </IconButton>
        <IconButton className="flex items-center justify-center gap-2">
          <ChatBubbleOutlineIcon />
          <h1>{fetchcommented.length}</h1>
        </IconButton>
        <IconButton className="flex items-center justify-center gap-2">
          <ShareOutlinedIcon />
          <h1>0</h1>
        </IconButton>
      </div>
      <form
        onSubmit={INSERTCOMMENT}
        className="flex py-2 gap-3 items-center w-full"
      >
        <div>
          <Avatar
            sx={{ height: "55px", width: "55px" }}
            src={profile?.avatar}
            width={40}
            height={40}
          />
        </div>
        <div className="w-full h-5 flex items-center">
          <input
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a Comment"
            className=" flex text-l  items-center overflow:auto resize-none w-full border-2 focus:outline-none rounded-full px-2 py-2"
          />
          <button type="submit" hidden />
        </div>
      </form>
      <div className="flex flex-col px-5 overflow-y-scroll border-t-2 py-1 w-full max-h-40 overflow-x-hidden ">
        {fetchcommented?.map((comment)=> (

<div key={comment.id} className="flex  items-center w-full py-2 px-1  border-2 rounded-2xl bg-slate-50 ">
<div>
  <Avatar
    sx={{ height: "40px", width: "40px" }}
    src={comment?.profiles?.avatar}
    width={20}
    height={20}
  />
</div>
<div className='flex flex-col items-center justify-center  p-1'>
<Link href={"/profile/" + comment?.profiles?.id} className="  text-xs pl-1 font-medium" >{comment?.profiles?.name}</Link>
<h4 className="text-[0.6rem] flex items-center justify-center p-0">
            <TimeAgo datetime={comment?.created_at} />
          </h4>
</div>

<div className="flex-grow h-5 flex items-center border-s-2 p-1 text-sm">
  <h1>{comment.content}</h1>
 
</div>
</div>

        ))}
     
      </div>
    </div>
  );
}

export default Post;
