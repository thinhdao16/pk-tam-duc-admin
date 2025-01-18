import React, { useState } from "react";
import axios from "axios";
import { CiTrash } from "react-icons/ci";
import { message, Spin } from "antd";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar/Index";

function CreateProject() {

    const [sidebarToggle] = useOutletContext();


    const [images, setImages] = useState([]);
    const [landArea, setLandArea] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();

    const [costConstruction, setCostConstruction] = useState()
    const [location, setLocation] = useState()
    const [totalArea, setTotalArea] = useState()
    const [typeConstruction, setTypeConstruction] = useState()
    const [year, setYear] = useState()
    const [types, setTypes] = useState()
    const [loading, setLoading] = useState(false)
    const [lanConstruction, setLanConstruction] = useState()
    const handleCreateXdndProject = async () => {
        try {
            if (!landArea || !title || !description || !costConstruction || !location || !totalArea || !typeConstruction || !year || !types || images.length === 0) {
                message.error("Hãy điển đầy đủ thông tin")
                return;
            }
            if (images.length > 10) {
                message.error("Làm ơn chọn dưới 10 ảnh")
                return
            }
            setLoading(true)

            const arrayImg = images?.map((imgs) => imgs?.file)

            // Tạo một đối tượng FormData
            const formData = new FormData();

            formData.append('landArea', landArea);
            formData.append('title', title);
            formData.append('description', description);

            formData.append('costConstruction', costConstruction);
            formData.append('location', location);
            formData.append('totalArea', totalArea);
            formData.append('landConstruction', lanConstruction);
            formData.append('typeConstruction', typeConstruction);
            formData.append('year', year);
            formData.append('type', types);
            for (let i = 0; i < arrayImg.length; i++) {
                formData.append('img', arrayImg[i]);
            }

            const response = await axios.post('https://be-phong-kham.vercel.app/createXdndProject', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Đặt header 'Content-Type' là 'multipart/form-data' cho FormData
                }
            });

            // Xử lý kết quả từ API nếu cần
            console.log(response.data);
            setLoading(false)
            message.success('Dự án đã được tạo thành công!');
        } catch (error) {
            // Xử lý lỗi nếu request thất bại
            console.error('Error creating project:', error);
            setLoading(false)
            message.error('Đã xảy ra lỗi khi tạo dự án.', error?.message);
        }
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            id: URL.createObjectURL(file),
            file: file,
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);
    };
    const handleRemoveImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
    };

    return (
        <>
            <Navbar toggle={sidebarToggle} />

            <Spin spinning={loading} fullscreen />

            <main className="h-full">

                {/* Main Content */}
                <div className="mainCard">
                    <div className="border w-full border-gray-200 bg-white pt-4 pb-20 px-6 rounded-md">
                        <div className="flex flex-col gap-4">
                            {/* Form Default */}
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
                            <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Diện tích đất
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setLandArea(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Chi phí thi công
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setCostConstruction(e.target.value)}

                                />
                            </div>    <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Địa điểm
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setLocation(e.target.value)}

                                />
                            </div>    <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Tổng diện tích sàn
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setTotalArea(e.target.value)}

                                />
                            </div>
                            <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Diện tích xây dựng
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setLanConstruction(e.target.value)}

                                />
                            </div>
                            <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Loại công trình
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setTypeConstruction(e.target.value)}

                                />
                            </div>    <div>
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Năm thiết kế
                                </label>
                                <input
                                    id="defaultInput"
                                    type="text"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                    onChange={(e) => setYear(e.target.value)}

                                />
                            </div>
                            <div class="">
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Loại mẫu nhà
                                </label>
                                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={types}
                                    onChange={(e) => setTypes(e.target.value)}
                                >
                                    <option value="" selected>Chọn loại dự án</option>
                                    <option value="gardenHouse">Nhà vườn đẹp</option>
                                    <option value="townHouse">Nhà Phố đẹp</option>
                                    <option value="villa">Biệt thự đẹp</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                                    Thêm hình ảnh
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
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



                            <div className="mt-6 flex flex-row gap-4">
                                <button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                                    onClick={handleCreateXdndProject}
                                >
                                    Tạo dự án
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CreateProject;
