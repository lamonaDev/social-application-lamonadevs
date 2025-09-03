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
export default function ModalComponent({useOfModal, post, KeyValue}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [backdrop, setBackdrop] = React.useState("opaque");
      const { userState } = useContext(MainUserContext);
        const [currentPost, setCurrentPost] = useState(null);
      const [modalPlacement, setModalPlacement] = useState("auto");
    const [isEdit, setIsEdit] = useState(false);
  const handleOpen = (backdrop) => {
      setBackdrop(backdrop);
      setModalPlacement("center");
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
  function toggleIsEdit() { return !isEdit }
  useEffect(() => {
    if (post?._id) {
      getCurrentPost(post?._id);
    }
  }, [post?._id]);
  return (
    <>
      <Button onPress={() => handleOpen("blur")} variant="flat" color="primary" size="md" className="mt-3 w-full">{ useOfModal }</Button>
      <Modal plcaement={modalPlacement} backdrop={backdrop} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{ useOfModal }</ModalHeader>
              <ModalBody>
                {
                  isEdit
                  ? <div className="w-full border-1 p-1 rounded-2xl"><AddEditePost/></div>
                    : <><Card post={currentPost} /></>
                }
              </ModalBody>
              <ModalFooter className="flex flex-row justify-evenly">
                <Button color="danger" variant="light" onPress={onClose} onClick={() => setIsEdit(toggleIsEdit())}>
                  Close
                </Button>
                <div className="actions flex flex-row gap-1.5">
                {
                  isEdit
                  ? 
                  <>
                    <Button color="success" onClick={() => setIsEdit(toggleIsEdit())}>Save Editing</Button>
                    <Button color="danger" onClick={() => setIsEdit(toggleIsEdit())}>Cancel Editing</Button>
                  </>
                  :
                  <>
                    <Button color="warning" onClick={() => setIsEdit(toggleIsEdit())}>Edit</Button>
                    <Button color="danger" onPress={onClose} onClick={() => { if (post?._id) { deleteCurrentPost(post?._id) } }}>Delete</Button>
                  </>
                }
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
