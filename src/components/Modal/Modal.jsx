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
export default function ModalComponentForPostAction({useOfModal, post, KeyValue}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [backdrop, setBackdrop] = React.useState("opaque");
      const { userState } = useContext(MainUserContext);
        const [currentPost, setCurrentPost] = useState(null);
        // const [postEditBody, setPostEditBody] = useState("");
        // const [postEditImage, setPostEditImage] = useState("");
        const [id, setPostId] = useState("");
    const [isEdit, setIsEdit] = useState(false);
  const handleOpen = (backdrop) => {
      setBackdrop(backdrop);
      onOpen();
    };
  function getCurrentPost(postId) {
      axios.get(`https://linked-posts.routemisr.com/posts/${postId}`, { headers: { "Content-Type": "application/json", token: userState } })
        .then((res) => { setCurrentPost(res?.data?.post)})
  }
  function deleteCurrentPost(postId) {
    axios.delete(`https://linked-posts.routemisr.com/posts/${postId}`, { headers: { "Content-Type": "application/json", token: userState } })
    .then(() => toast.success("Post Deleted Successfully!"))
  }
  // function editPost(postId, postEditBody, postEditImage) {
  //   const formDataToEdit = new FormData();
  //   postEditBody && formDataToEdit.append(postEditBody);
  //   postEditImage && formDataToEdit.append(postEditImage);
  //   axios.put(`https://linked-posts.routemisr.com/posts/${postId}`, formDataToEdit ,{ headers: { token: userState}})
  // }
  function toggleIsEdit() { return !isEdit }  useEffect(() => {
    if (post?._id) {
      getCurrentPost(post?._id);
      setPostId(post?._id);
    }
  }, [post?._id]);
  return (
    <>
      <Button onPress={onOpen} variant="flat" color="primary" size="md" className="mt-3 w-full">{ useOfModal }</Button>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
      <Modal backdrop={"blur"} isOpen={isOpen} isKeyboardDismissDisabled={true} isDismissable={false} onOpenChange={onOpenChange}>
        <ModalContent className="max-h-[700px] overflow-scroll">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{ useOfModal }</ModalHeader>
            {/* <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0} delay={200}>
            </FadeContent> */}
            <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0} delay={300}>
              <ModalBody>
                {
                  isEdit
                  ? 
                    <div className="w-full border-1 p-1 rounded-2xl">
                      <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0}>
                        <AddEditePost isEdit={isEdit} postId={post?._id} />
                      </FadeContent>
                    </div>
                  :
                  <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0}>
                  <Card post={currentPost} from={"edit"}/>
                  </FadeContent>
                }
              </ModalBody>
            </FadeContent>
            <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0} delay={400}>
              <ModalFooter className="flex flex-row justify-between">
                <Button color="danger" variant="light" onPress={onClose} onClick={() => setIsEdit(false)}>
                  {isEdit ? "Cancel Edit" : "Close"}
                </Button>
                <div className="actions flex flex-row gap-1.5">
                {
                  isEdit
                  ? 
                  <>
                    {/* <Button color="success" onClick={() => setIsEdit(toggleIsEdit())}>Save Editing</Button>
                    <Button color="danger" onClick={() => setIsEdit(toggleIsEdit())}>Cancel Editing</Button> */}
                  </>
                  :
                  <>
                    <Button variant="flat" color="success" onClick={() => { setIsEdit(toggleIsEdit());}}>Edit</Button>
                    <Button variant="flat" color="danger" onPress={onClose} onClick={() => { if (post?._id) { deleteCurrentPost(post?._id) } }}>Delete</Button>
                  </>
                }
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
