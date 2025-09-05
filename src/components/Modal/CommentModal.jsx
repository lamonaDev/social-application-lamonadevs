import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@heroui/react";
import { useContext } from "react";
import { MainUserContext } from "../../context/UserAuth";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CommentModal({ postId, isEdit, commentId, onSuccess }) {
  const { userState } = useContext(MainUserContext);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { content: "" },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (!isEdit) {
        const response = await axios.post(
          "https://linked-posts.routemisr.com/comments",
          { content: formData.content, post: postId },
          {
            headers: {
              "Content-Type": "application/json",
              token: userState,
            },
          }
        );
        return response?.data;
      } else {
        if (!commentId) {
          toast.error("There is no comment id");
          return;
        }
        const editCommentResponse = await axios.put(
          `https://linked-posts.routemisr.com/comments/${commentId}`,
          { content: formData.content },
          {
            headers: {
              "Content-Type": "application/json",
              token: userState,
            },
          }
        );
        return editCommentResponse?.data;
      }
    },
    onSuccess: (data) => {
        toast.success(`${isEdit ? "Comment Edited Successfully!" : "Comment added successfully!"}`);
        if (onSuccess) onSuccess();
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error) => {
      toast.error(
        `Error ${isEdit ? "Editing" : "Adding"} comment: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        size={isEdit ? "sm" : "md"}
        color={isEdit ? "warning" : "primary"}
      >
        {isEdit ? "Edit" : "Add a Comment"}
      </Button>
      <Modal
        backdrop="blur"
        placement="center"
        isKeyboardDismissDisabled={true}
        className="mx-2.5"
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEdit ? "Edit Comment" : "Add a comment"}
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit((data) =>
                    mutation.mutate(data, {
                      onSettled: () => onClose(),
                    })
                  )}
                >
                  <Input
                    color="primary"
                    variant="flat"
                    label={isEdit ? "Edit Comment" : "Add Comment"}
                    type="text"
                    {...register("content", {
                      required: `Comment is required to ${isEdit ? "Edit" : "Add"}`,
                    })}
                    isClearable
                    id="commentInput"
                    isInvalid={!!errors.content}
                    errorMessage={errors.content?.message}
                  />
                  <ModalFooter className="flex flex-row justify-end py-3 px-0">
                    <Button
                      type="submit"
                      color="success"
                      variant="flat"
                      isLoading={mutation.isLoading}
                    >
                      {isEdit ? "Edit" : "Add"}
                    </Button>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}