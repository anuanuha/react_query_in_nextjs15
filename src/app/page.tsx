"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
}

async function createPost(newPost: Omit<Post, 'id'>): Promise<Post> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

async function updatePost(updatedPost: Post): Promise<Post> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedPost),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

async function deletePost(postId: number): Promise<void> {
  await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: 'DELETE',
  });
}

export default function Home() {
  const queryClient = useQueryClient();

  // Fetch posts using useQuery
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // Handle post creation using useMutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // Handle post update using useMutation
  const editMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // Handle post deletion using useMutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // States for managing new post input
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  if (isLoading) return <h1 className="text-xl text-gray-600">Loading...</h1>;
  if (isError) return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100 font-sans">
      
      {/* Form to create new post */}
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create a New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Content"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => createMutation.mutate(newPost)}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? "Adding..." : "Add Post"}
        </button>
      </div>
      
      {/* Display posts */}
      <div className="w-full max-w-3xl space-y-6">
        {data?.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
            <p className="text-gray-600">{post.body}</p>

            <div className="mt-4 flex gap-4">
              {/* Update post */}
              <button
                onClick={() => editMutation.mutate({ ...post, title: "Updated Title", body: "Updated content." })}
                disabled={editMutation.isLoading}
                className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 disabled:bg-gray-400"
              >
                {editMutation.isLoading ? "Updating..." : "Update Post"}
              </button>

              {/* Delete post */}
              <button
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isLoading}
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 disabled:bg-gray-400"
              >
                {deleteMutation.isLoading ? "Deleting..." : "Delete Post"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
