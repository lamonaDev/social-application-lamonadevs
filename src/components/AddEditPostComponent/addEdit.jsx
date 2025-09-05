import { Button, Textarea } from "@heroui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MainUserContext } from "../../context/UserAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddEditePost({  onPostAdded, isEdit, postId, onSubmit }) {
  const { userState } = useContext(MainUserContext);
  const [isShow, setIsShow] = useState(false);
  const [body, setBody] = useState("");
  const [img, setImg] = useState("");
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      body && formData.append("body", body);
      img && formData.append("image", img);
      const response = await axios.post("https://linked-posts.routemisr.com/posts", formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.message === "success") {
        toast.success("Post added successfully");
        setImg("");
        setBody("");
        setIsShow(false);
        // getAllPosts()
        if (onPostAdded) onPostAdded(); // Trigger parent callback
        queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate posts query
      }
    },
    onError: (error) => {
      toast.error(`Error adding post: ${error.response?.data?.message || error.message}`);
    },
  });

  // Mutation for editing a post
  const editMutation = useMutation({
    mutationFn: async () => {
      const formDataToEdit = new FormData();
      body && formDataToEdit.append("body", body);
      img && formDataToEdit.append("image", img);
      const response = await axios.put(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        formDataToEdit,
        { headers: { token: userState } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.message === "success") {
        toast.success("Post edited successfully!");
        setImg("");
        setBody("");
        setIsShow(false);
        // getAllPosts(); // Optional: Call parent function
        if (onPostAdded) onPostAdded(); // Trigger parent callback
        queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate posts query
        queryClient.invalidateQueries({ queryKey: ["post", postId] }); // Invalidate specific post
      }
    },
    onError: (error) => {
      toast.error(`Error editing post: ${error.response?.data?.message || error.message}`);
    },
  });

  function handleUploadImage(e) {
    setImg(e.target.files[0]);
  }

  return (
    <div className="my-3 bg-gray-50 p-2 rounded-xl max-w-[600px] mx-auto">
      {isShow || isEdit ? (
        <div>
          <Textarea
            isClearable
            className=""
            label="Description"
            placeholder="What is in Your mind?"
            variant="bordered"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onClear={() => console.log("textarea cleared")}
          />
          {img && (
            <img
              src={URL.createObjectURL(img)}
              className="h-40 w-full rounded-2xl object-cover"
              alt=""
            />
          )}
          <div className="flex justify-between items-center">
            <div className="rounded-md border border-gray-100 bg-white p-4">
              <label htmlFor="upload" className="flex flex-col items-center gap-2 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 fill-white stroke-indigo-500"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadImage(e)}
              />
            </div>

            {isEdit ? (
              <Button
                color="success"
                variant="flat"
                onClick={() => editMutation.mutate()}
                isLoading={editMutation.isLoading}
              >
                Done
              </Button>
            ) : (
              <div className="buttons">
                <Button
                  size="sm"
                  variant="bordered"
                  className="mx-2"
                  onClick={() => {
                    setIsShow(false);
                    setImg("");
                    setBody("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => addMutation.mutate()}
                  isDisabled={!body.trim()}
                  isLoading={addMutation.isLoading}
                >
                  Post
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="p-2 rounded-xl cursor-pointer"
          onClick={() => setIsShow(true)}
        >
          What is in Your mind?
        </div>
      )}
    </div>
  );
}