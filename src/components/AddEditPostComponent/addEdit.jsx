import { Button, Textarea } from "@heroui/react"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AddEditePost({ getAllPosts }) {
    const [isShow, setIsShow] = useState(false)
    const [body, setBody] = useState('')
    const [img, setImg] = useState('')
    function addPost() {
        const formData = new FormData()
        body && formData.append('body', body)
        img && formData.append('image', img)
        axios.post('https://linked-posts.routemisr.com/posts', formData, {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then((res) => {
            if (res.data.message === 'success') {
                // display toast msg
                toast.success('Post added successfully', {
                })
                setImg('')
                setBody('')
                setIsShow(false)
                getAllPosts()
            }
        })
    }
    function handleUploadImage(e) {
        setImg(e.target.files[0]);
    }

    return (
        <div className="my-3 bg-gray-50 p-2 rounded-xl">
            {
                isShow ? <div>
                    <Textarea
                        isClearable
                        className=''
                        label="Description"
                        placeholder=" What is in Your mind?"
                        variant="bordered"
                        value={body}
                        onChange={(e) => { setBody(e.target.value) }}
                        // eslint-disable-next-line no-console
                        onClear={() => console.log("textarea cleared")}
                    />
                    {img && <img src={URL.createObjectURL(img)} className="h-40 w-full" alt="" />
                    }
                    <div className="flex justify-between items-center">
                        <div class="rounded-md border border-gray-100 bg-white p-4">
                            <label for="upload" class="flex flex-col items-center gap-2 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-6 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {/* <span class="text-gray-600 font-medium">Upload file</span> */}
                            </label>
                            <input id="upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                handleUploadImage(e)
                            }} />
                        </div>


                        <div className="buttons">
                            <Button size="sm" variant="bordered" className="mx-2" onClick={() => {
                                setIsShow(false)
                                setImg('')
                                setBody('')
                            }}>Cancel</Button>
                            {console.log(Boolean(img))
                            }
                            <Button size="sm" color="primary" onClick={addPost} isDisabled={Boolean(!body.trim())}>Post</Button>
                        </div>
                    </div>

                </div>

                    : <div className=" p-2 rounded-xl cursor-pointer" onClick={() => {
                        setIsShow(true)
                    }}>

                        What is in Your mind?
                    </div>

            }


        </div>
    )
}