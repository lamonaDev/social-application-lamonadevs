import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import Card from "../Card/Card";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MainUserContext } from "../../context/UserAuth";
import toast from "react-hot-toast";
import AddEditePost from "../AddEditPostComponent/addEdit";
import FadeContent from "../ui/animation/BlurFadeContent/BlurFadeContent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ModalComponentForPostAction({
  useOfModal,
  post,
  KeyValue,
}) {
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose: onDisclosureClose,
  } = useDisclosure();
  const { userState } = useContext(MainUserContext);
  const [currentPost, setCurrentPost] = useState(null);
  const [id, setPostId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch post data with useQuery
  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", post?._id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://linked-posts.routemisr.com/posts/${post?._id}`,
          {
            headers: { "Content-Type": "application/json", token: userState },
          }
        );
        return response?.data?.post;
      } catch (error) {
        toast.error("Failed to fetch post details");
        throw error;
      }
    },
    initialData: post,
    enabled: !!post?._id && !!userState && isModalOpen, // Only fetch when modal is open
  });
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await axios.delete(`https://linked-posts.routemisr.com/posts/${postId}`, {
        headers: { "Content-Type": "application/json", token: userState },
      });
    },
    onSuccess: () => {
      toast.success("Post Deleted Successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      handleClose(); // Use our custom close function
    },
    onError: (error) => {
      toast.error(
        `Error deleting post: ${error.response?.data?.message || error.message}`
      );
    },
  });
  const editMutation = useMutation({
    mutationFn: async (formData) => {
      const formDataToEdit = new FormData();
      formData.body && formDataToEdit.append("body", formData.body);
      formData.image && formDataToEdit.append("image", formData.image);

      const response = await axios.put(
        `https://linked-posts.routemisr.com/posts/${post?._id}`,
        formDataToEdit,
        { headers: { token: userState } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post Edited Successfully!");
      queryClient.invalidateQueries({ queryKey: ["post", post?._id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      setIsEdit(false);
    },
    onError: (error) => {
      toast.error(
        `Error editing post: ${error.response?.data?.message || error.message}`
      );
    },
  });
  const handleOpen = () => {
    setIsModalOpen(true);
    onOpen();
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    onDisclosureClose();
  };
  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    } else {
      handleOpen();
    }
  };
  useEffect(() => {
    if (post?._id) {
      setPostId(post?._id);
      setCurrentPost(postData);
    }
  }, [post?._id, postData]);
  if (!post && !isPostLoading) {
    return (
      <Button
        variant="flat"
        color="primary"
        size="md"
        className="mt-3 w-full"
        isDisabled
      >
        {useOfModal}
      </Button>
    );
  }
  return (
    <>
      <Button
        onPress={handleOpen}
        variant="flat"
        color="primary"
        size="md"
        className="mt-3 w-full"
      >
        {useOfModal}
      </Button>
      <FadeContent
        blur={true}
        duration={1000}
        easing="ease-out"
        initialOpacity={0}
      >
        <Modal
          backdrop={"blur"}
          isOpen={isOpen}
          isKeyboardDismissDisabled={true}
          isDismissable={false}
          onOpenChange={handleOpenChange}
        >
          <ModalContent className="max-h-[700px] overflow-scroll">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {useOfModal}
                </ModalHeader>
                <FadeContent
                  blur={true}
                  duration={600}
                  easing="ease-out"
                  initialOpacity={0}
                  delay={300}
                >
                  <ModalBody>
                    {isPostLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <p>Loading post...</p>
                      </div>
                    ) : isEdit ? (
                      <div className="w-full border-1 p-1 rounded-2xl">
                        <FadeContent
                          blur={true}
                          duration={600}
                          easing="ease-out"
                          initialOpacity={0}
                        >
                          <AddEditePost
                            isEdit={isEdit}
                            postId={post?._id}
                            initialData={currentPost}
                            onSubmit={(formData) =>
                              editMutation.mutate(formData)
                            }
                            onCancel={() => setIsEdit(false)}
                          />
                        </FadeContent>
                      </div>
                    ) : (
                      <FadeContent
                        blur={true}
                        duration={600}
                        easing="ease-out"
                        initialOpacity={0}
                      >
                        {currentPost ? (
                          <Card post={currentPost} from={"edit"} />
                        ) : (
                          <div className="flex justify-center items-center py-8">
                            <p>Post not found</p>
                          </div>
                        )}
                      </FadeContent>
                    )}
                  </ModalBody>
                </FadeContent>
                <FadeContent
                  blur={true}
                  duration={600}
                  easing="ease-out"
                  initialOpacity={0}
                  delay={400}
                >
                  <ModalFooter className="flex flex-row justify-between">
                    <Button
                      color="danger"
                      variant="light"
                      onPress={handleClose}
                      onClick={() => setIsEdit(false)}
                    >
                      {isEdit ? "Cancel Edit" : "Close"}
                    </Button>
                    <div className="actions flex flex-row gap-1.5">
                      {isEdit ? (
                        <></>
                      ) : (
                        <>
                          <Button
                            variant="flat"
                            color="success"
                            onClick={() => setIsEdit(true)}
                            isDisabled={!currentPost}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="flat"
                            color="danger"
                            onClick={() => {
                              if (post?._id) deleteMutation.mutate(post?._id);
                            }}
                            isLoading={deleteMutation.isLoading}
                            isDisabled={!post?._id}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </ModalFooter>
                </FadeContent>
              </>
            )}
          </ModalContent>
        </Modal>
      </FadeContent>
    </>
  );
}
