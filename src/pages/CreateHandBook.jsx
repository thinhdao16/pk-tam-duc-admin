import React, { useState } from "react";
import axios from "axios";
import { message, Spin } from "antd";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar/Index";
import { Editor } from '@tinymce/tinymce-react';
import { CiTrash } from "react-icons/ci";

function CreateHandbook() {

    const [sidebarToggle] = useOutletContext();


    const [title, setTitle] = useState();
    const [description, setDescription] = useState();

    const [types, setTypes] = useState()
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    console.log(images)
    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            const newImage = {
                id: URL.createObjectURL(file),
                file: file,
            };
            setImages([newImage]);
        }
    };
    
    const handleRemoveImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
    };
    const handleCreateXdndProject = async () => {
        try {
            if (!title || !description || !types === 0) {
                message.error("Hãy điển đầy đủ thông tin")
                return;
            }
            setLoading(true)
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('type', types);
            formData.append('img', images?.[0]?.file)
            formData.append('script', content)
            const response = await axios.post('https://be-phong-kham.vercel.app/create-handbook', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            setLoading(false)
            message.success('Dự án đã được tạo thành công!');
        } catch (error) {
            console.error('Error creating project:', error);
            setLoading(false)
            message.error('Đã xảy ra lỗi khi tạo dự án.', error?.message);
        }
    };

    return (
        <>
            <Navbar toggle={sidebarToggle} />

            <Spin spinning={loading} fullscreen />

            <main className="h-full">
                <div className="mainCard">
                    <div className="border w-full border-gray-200 bg-white pt-4 pb-20 px-6 rounded-md">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Tiêu đề
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>  <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Nội dung
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div class="">
                                <label htmlFor="defaultInput" className="text-sm text-gray-600 mb-1">
                                    Loại phong thủy
                                </label>
                                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={types}
                                    onChange={(e) => setTypes(e.target.value)}
                                >
                                    <option value="" selected>Chọn loại bảng tin</option>
                                    <option value="post">Bài viết</option>
                                    <option value="action">Hoạt động</option>
                                    <option value="knowledge">Kiến thức sức khỏe</option>
                                    <option value="share">Sự kiện</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Thêm hình ảnh
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="image-wrapper relative">
                                            <img src={image.id} alt="Uploaded Preview" className="shadow-lg rounded-lg" />
                                            <button className="absolute top-2 right-4 rounded-full bg-white w-7 h-7 flex items-center justify-center shadow-2xl " onClick={() => handleRemoveImage(image.id)}><CiTrash /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Soạn thảo bài viết</div>
                                <Editor
                                    apiKey="iur6gq9lbswln4yu8vfox2ry8w48u37ay2dj65n0o6qzz9rd"
                                    value={content}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount',
                                        ],
                                        toolbar:
                                            'undo redo | myImageUploadButton | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image',
                                        setup: (editor) => {
                                            editor.ui.registry.addButton('myImageUploadButton', {
                                                text: 'Upload Image',
                                                onAction: () => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = async (event) => {
                                                        const file = event.target.files[0];
                                                        const formData = new FormData();
                                                        formData.append('img', file);
                                                        try {
                                                            setLoading(true);
                                                            const response = await fetch('https://be-phong-kham.vercel.app/postImg', {
                                                                method: 'POST',
                                                                body: formData,
                                                            });
                                                            const data = await response.json();
                                                            editor.insertContent(
                                                                `<img src="${data?.data?.newImage?.img}" alt="Uploaded Image" />`
                                                            );
                                                        } catch (error) {
                                                            console.error('Error uploading image:', error);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    };
                                                    input.click();
                                                },
                                            });
                                        },
                                    }}
                                    onEditorChange={(newContent) => setContent(newContent)}
                                />

                                <button onClick={() => console.log(content)}>Lưu bài viết</button></div>
                            <div className="mt-6 flex flex-row gap-4">
                                <button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                                    onClick={handleCreateXdndProject}
                                >
                                    Tạo Bảng Tin
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CreateHandbook;
