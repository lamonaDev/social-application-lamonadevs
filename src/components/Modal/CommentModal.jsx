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
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CommentModal({ postId }) {
    const { userState } = useContext(MainUserContext);
    const { register, handleSubmit, formState: { errors }, } = useForm({ defaultValues: { content: "" }, });
    const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
        const response = await axios.post("https://linked-posts.routemisr.com/comments",
        { content: formData.content, post: postId , },
        {
            headers: {
                "Content-Type": "application/json",
                token: userState,
            },
        }
    );
    return response?.data;
    },
    onSuccess: () => { toast.success("Comment added successfully!");},
    onError: (error) => {
        toast.error( `Error adding comment: ${ error.response?.data?.message || error.message }` );
        },
    });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
    <>
        <Button onPress={onOpen} variant="flat" color="primary">Add Comment</Button>
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
                <ModalHeader className="flex flex-col gap-1">Add a comment</ModalHeader>
                <ModalBody>
                <form onSubmit={handleSubmit((data) => mutate(data) )}>
                <Input
                    color="primary"
                        variant="flat"
                            label="Comment"
                            type="text"
                                {...register("content", { required: "Comment is required", })}
                                id="commentInput"
                        isInvalid={!!errors.content}
                    errorMessage={errors.content?.message}
                />
                <ModalFooter className="flex flex-row justify-end py-3 px-0">
                    <Button
                        type="submit"
                            color="success"
                            variant="flat"
                        isLoading={isLoading}
                    >
                    Add
                    </Button>
                    <Button color="danger" variant="flat" onPress={onClose}>Cancel</Button>
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
