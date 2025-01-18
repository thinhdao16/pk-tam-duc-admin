import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import axios from "axios";
import { message, Modal, Popconfirm, Spin } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import Navbar from "../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const buttons = [
    { id: "post", label: "Bài viết" },
    { id: "action", label: "Hoạt động" },
    { id: "knowledge", label: "Kiến thức sức khỏe" },
    { id: "event", label: "Sự kiện" },
];

function Construction() {
    const [sidebarToggle] = useOutletContext();

    const [dataHandbook, setDataHandbook] = useState([])
    const [dataItem, setDataItem] = useState()
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [reload, setReload] = useState(0)
    const [loading, setLoading] = useState(false)
    const [formFields, setFormFields] = useState({
        title: '',
        description: '',
        types: '',
        script: '',
    });
    const [activeButton, setActiveButton] = useState("post");
    const handleOpenEdit = (data) => {
        setDataItem(data)
        setOpen(true)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên
        if (!file) return; // Thoát nếu không có file nào được chọn

        const newImage = {
            id: Date.now(), // Tạo id duy nhất (có thể dùng uuid nếu cần)
            preview: URL.createObjectURL(file), // URL để preview ảnh
            file: file, // Lưu file thực
        };

        setImages(newImage); // Cập nhật state với đối tượng ảnh
    };


    const handleRemoveImage = () => {
        setImages([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    const handleInputChangeScript = (name, value) => {
        setFormFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };
    const handleEdit = async () => {
        try {
            setLoading(true)
            const formData = new FormData();
            const imgFormData = images?.file || images
            formData.append('img', imgFormData)
            formData.append("title", formFields?.title)
            formData.append("description", formFields?.description)
            formData.append("type", formFields?.types)
            formData.append("script", formFields?.script)
            const uploadResponse = await axios.put(
                `http://localhost:5000/edit-handbook/${dataItem?._id}`,
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            );
            message.success(uploadResponse?.data?.message)
            setOpen(false)
            setReload((prev) => prev + 1)
            setLoading(false)
        } catch (error) {
            console.error('Error editing project:', error);
            setLoading(false)
        }
    };

    const handleDelete = async (data) => {
        try {
            setLoading(true)
            const response = await axios.delete(`http://localhost:5000/delete-handbook/${data}`);
            if (response.status === 200) {
                setReload((prev) => prev + 1);
                setLoading(false)
                message.success('Item deleted successfully');
            } else {
                console.error('Failed to delete item', response.status);
                setLoading(false)
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setLoading(false)

        }
    };

    const handleClick = async (id) => {
        setActiveButton(id);
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:5000/get-handbook', {
                type: id
            });
            setDataHandbook(response.data.data);
            setLoading(false)
        } catch (error) {
            console.error(`Error fetching data for ${id}:`, error);
            setLoading(false)
        }
    };
    useEffect(() => {
        if (open) {
            setFormFields({
                title: dataItem?.title || '',
                description: dataItem?.description || '',
                types: dataItem?.type || '',
                script: dataItem?.script || ''
            });
            setImages(dataItem?.img);
        }
    }, [open, dataItem]);

    useEffect(() => {
        // Hàm để gọi API
        const fetchData = async () => {
            setLoading(true)
            try {
                // Thay thế URL_API bằng URL API thực tế của bạn
                const response = await axios.post('http://localhost:5000/get-handbook', {
                    type: activeButton
                });

                setDataHandbook(response.data.data);
                setLoading(false)
            } catch (error) {
                console.error('Axios error:', error);
                setLoading(false)

            }
        };

        fetchData();
    }, [reload]);
    return (
        <>
            <Navbar toggle={sidebarToggle} />

            <Spin spinning={loading} fullscreen />
            <div className="flex flex-wrap items-center justify-center gap-4  ">
                {buttons.map((button) => (
                    <button
                        key={button.id}
                        onClick={() => handleClick(button.id)}
                        className={`rounded-xl px-8 py-2 font-semibold transition-colors mt-5 ${activeButton === button.id
                            ? "bg-emerald-600 text-white"
                            : "border border-emerald-600 bg-white text-emerald-600 hover:border-0 hover:bg-emerald-600 hover:text-white"
                            }`}
                    >
                        {button.label}
                    </button>
                ))}
            </div>
            <main className="h-full">
                {/* Welcome Header */}
                <div className="mainCard">
                    <div className="border w-full border-gray-200 bg-white pt-4 pb-20 px-6 rounded-md">

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {
                                dataHandbook?.map((data, index) => (
                                    <div key={index} className="rounded-2xl shadow-lg relative ">
                                        <Popconfirm
                                            title="Delete the task"
                                            description="Are you sure to delete this task?"
                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            onConfirm={() => handleDelete(data?._id)}
                                        >
                                            <button className="h-7 w-7 rounded-full p-1 absolute top-2 right-2 bg-white flex items-center justify-center"

                                            >
                                                <CiTrash />
                                            </button>
                                        </Popconfirm>

                                        <button className=" rounded-lg text-xs p-1 absolute top-2 left-2 bg-white flex items-center justify-center"
                                            onClick={() => handleOpenEdit(data)}
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <img src={data?.img} alt="" className="rounded-t-2xl h-72 w-full object-cover" />
                                        <div className="p-4 flex flex-col gap-2">
                                            <span className="font-semibold">
                                                {data?.title}
                                            </span>
                                            <div className="flex gap-3 flex-wrap">
                                                <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                                                    {data?.description}
                                                </div>

                                            </div>
                                            <span>
                                                {data?.description}
                                            </span>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <Modal
                    title="Chỉnh sửa bảng tin "
                    centered
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    width={1000}
                    height={800}
                    footer={null}
                >
                    <Spin spinning={loading} tip="Loading...">
                        <div className="flex flex-col gap-4">
                            {/* Form Default */}
                            <div>
                                <label htmlFor="title" className="text-sm text-gray-600">
                                    Tiêu đề
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formFields?.title}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={handleInputChange}
                                />
                            </div>  <div>
                                <label htmlFor="description" className="text-sm text-gray-600">
                                    Nội dung
                                </label>
                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={formFields?.description}

                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={handleInputChange}
                                />
                            </div>


                            <div class="">
                                <label htmlFor="types" className="text-sm text-gray-600">
                                    Loại dự án
                                </label>
                                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="types"
                                    value={formFields?.types}
                                    onChange={handleInputChange}
                                >
                                    <option value="" selected>Chọn loại dự án</option>
                                    <option value="design">Thiết kế</option>
                                    <option value="fengShui">Phong thủy</option>
                                    <option value="costCaculation">Tính toán chi phí</option>
                                    <option value="share">Chia sẻ</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                {(images?.preview === undefined || images?.length === 0) && (
                                    <>
                                        <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                            Hình ảnh hiện tại
                                        </label>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                            <div key={images} className="image-wrapper relative">
                                                <img src={images || images?.preview} alt="Uploaded Preview" className="shadow-lg rounded-lg" />
                                                <button className="absolute top-2 right-4 rounded-full bg-white w-7 h-7 shadow-2xl flex items-center justify-center " onClick={() => handleRemoveImage()}><CiTrash /></button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Hình ảnh mới
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                {images?.preview?.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4">
                                    <div key={images} className="image-wrapper relative">
                                        <img src={images?.preview} alt="Uploaded Preview" className="shadow-lg rounded-lg" />
                                        <button className="absolute top-2 right-4 rounded-full bg-white w-7 h-7 flex items-center justify-center shadow-2xl  " onClick={() => handleRemoveImage()}><CiTrash /></button>
                                    </div>
                                </div>}
                            </div>

                            <Editor
                                name="script"
                                apiKey="iur6gq9lbswln4yu8vfox2ry8w48u37ay2dj65n0o6qzz9rd"
                                value={formFields?.script}
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
                                                        const response = await fetch('http://localhost:5000/postImg', {
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
                                onEditorChange={(newContent) => handleInputChangeScript("script", newContent)}
                            />

                            <div className="mt-6 flex flex-row gap-4">
                                <button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                                    onClick={() => handleEdit()}
                                >
                                    Sửa dự án
                                </button>

                            </div>
                        </div>
                    </Spin>
                </Modal>

            </main>
        </>
    );
}

export default Construction;
