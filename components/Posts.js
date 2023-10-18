import React from "react";
import Post from "./Post";

function Posts({ posts }) {
  console.log(posts, "posts");
  return (
    <div className="flex flex-col  items-center ">
      {posts?.map((post) => (
        <Post id={post.id} key={post.id} content={post.content} photos={post.photos} created_at={post.created_at} profile={post.profiles} />
      ))}
    </div>
  );
}

export default Posts;
