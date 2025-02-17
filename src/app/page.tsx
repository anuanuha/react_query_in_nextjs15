"use client"

import { useQuery } from "@tanstack/react-query";

type Post = {
  userId:number;
  id:number;
  title:string;
  body:string;
}
async function fetchPosts():Promise<Post[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
}
export default function Home() {
  const {data, error, isLoading, isError}= useQuery({
    queryKey:["posts"],
    queryFn:fetchPosts
  })
  if(isLoading) return <h1>loading...</h1>
  if(isError) return <p>Error:{(error as Error).message}</p>
  return (
    <div className="flex justify-center items-center min-h-screen">
  <div className="w-full max-w-3xl space-y-6 mt-4">
    {data?.map((post) => (
      <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
        <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
        <p className="text-gray-600">{post.body}</p>
      </div>
    ))}
  </div>
</div>
  );
}
