import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { CiTrash } from "react-icons/ci";
import axios from "axios";
import { Modal, Popconfirm, Spin } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import Navbar from "../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";

const buttons = [
  { id: "gardenHouse", label: "Nhà vườn đẹp" },
  { id: "townHouse", label: "Nhà phố đẹp" },
  { id: "villa", label: "Biệt thự đẹp" },
];

function Dashboard() {

  const { dataXdndDesign, setDataXdndDesign } = useAuthContext()

  const [sidebarToggle] = useOutletContext();


  const [dataItem, setDataItem] = useState()
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [dataItemImgs, setDataItemImgs] = useState([]);
  const [dataNewImgBack, setDataNewImgBack] = useState([]);
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formFields, setFormFields] = useState({
    title: '',
    description: '',
    costConstruction: '',
    location: '',
    totalArea: '',
    landConstruction: '',
    typeConstruction: '',
    year: '',
    types: '',
    landArea: ''
  });

  const [activeButton, setActiveButton] = useState("gardenHouse");

  const handleOpenEdit = (data) => {
    setDataItem(data)
    setOpen(true)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  const handleRemoveImage = (field, id) => {
    if (field === "new-img") {
      setImages(images.filter((image) => image.id !== id));
    }
    if (field === "old-img") {
      setDataItemImgs(dataItemImgs.filter((img) => img !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name)
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      let groupImg = [...dataNewImgBack, ...dataItemImgs];
      setLoading(true)

      if (images.length > 0) {
        const formData = new FormData();
        images.map((img) => formData.append('img', img.file));
        const uploadResponse = await axios.post(
          'https://fhomebe.onrender.com/createXdndProject',
          formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Đặt header 'Content-Type' là 'multipart/form-data' cho FormData
          }
        }
        );
        setDataNewImgBack(uploadResponse.data.data.postings.img);
        groupImg = [...groupImg, ...uploadResponse.data.data.postings.img];
      }
      const responseEdit = await axios.put(
        `https://fhomebe.onrender.com/edit-xdnd-project/${dataItem?._id}`,
        {
          title: formFields?.title,
          description: formFields?.description,
          landArea: formFields?.landArea,
          costConstruction: formFields?.costConstruction,
          location: formFields?.location,
          totalArea: formFields?.totalArea,
          typeConstruction: formFields?.typeConstruction,
          img: groupImg,
          year: formFields?.year,
          type: formFields?.types
        }
      );

      console.log(responseEdit);
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
      const response = await axios.delete(`https://fhomebe.onrender.com/delete-xdnd-project/${data}`);
      if (response.status === 200) {
        setReload((prev) => prev + 1);
        setLoading(false)
        console.log('Item deleted successfully');
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
      const response = await axios.post('https://fhomebe.onrender.com/getXdndProject', {
        type: id
      });
      setDataXdndDesign(response.data.data.postings);
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
        costConstruction: dataItem?.costConstruction || '',
        location: dataItem?.location || '',
        totalArea: dataItem?.totalArea || '',
        typeConstruction: dataItem?.typeConstruction || '',
        year: dataItem?.year || '',
        types: dataItem?.type || '',
        landArea: dataItem?.landArea || '',
      });
      setDataItemImgs(dataItem?.img);
    }
  }, [open, dataItem]);

  useEffect(() => {
    // Hàm để gọi API
    const fetchData = async () => {
      setLoading(true)
      try {
        // Thay thế URL_API bằng URL API thực tế của bạn
        const response = await axios.post('https://fhomebe.onrender.com/getXdndProject', {
          type: activeButton
        });

        setDataXdndDesign(response.data.data.postings);
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
            className={`rounded-xl px-8 py-2 font-semibold transition-colors mt-5 ${
              activeButton === button.id
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
                dataXdndDesign?.map((data) => (
                  <div className="rounded-2xl shadow-lg relative ">
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
                    <img src={data?.img[0]} alt="" className="rounded-t-2xl h-72 w-full object-cover" />
                    <div className="p-4 flex flex-col gap-2">
                      <span className="font-semibold">
                        {data?.title}
                      </span>
                      <div className="flex gap-3 flex-wrap">
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                          {data?.costConstruction}
                        </div>
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                          {data?.landArea}
                        </div>
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                          {data?.location}
                        </div>
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                          {data?.totalArea}
                        </div>
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                          {data?.typeConstruction}
                        </div>
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-600">
                          {data?.year}
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
          title="Modal 1000px width"
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
              <div>
                <label htmlFor="landArea" className="text-sm text-gray-600">
                  Diện tích đất
                </label>
                <input
                  id="landArea"
                  type="text"
                  name="landArea"
                  value={formFields?.landArea}

                  className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Default Input"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="costConstruction" className="text-sm text-gray-600">
                  Chi phí thi công
                </label>
                <input
                  id="costConstruction"
                  type="text"
                  name="costConstruction"
                  value={formFields?.costConstruction}

                  className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Default Input"
                  onChange={handleInputChange}

                />
              </div>    <div>
                <label htmlFor="location" className="text-sm text-gray-600">
                  Địa điểm
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formFields?.location}

                  className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Default Input"
                  onChange={handleInputChange}

                />
              </div>    <div>
                <label htmlFor="totalArea" className="text-sm text-gray-600">
                  Tổng diện tích sàn
                </label>
                <input
                  id="totalArea"
                  type="text"
                  name="totalArea"
                  value={formFields?.totalArea}

                  className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Default Input"
                  onChange={handleInputChange}

                />
              </div>
              <div>
                <label htmlFor="lanConstruction" className="text-sm text-gray-600">
                  Diện tích xây dựng
                </label>
                <input
                  id="lanConstruction"
                  type="text"
                  name="lanConstruction"
                  value={formFields?.landConstruction}
                  className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Default Input"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="typeConstruction" className="text-sm text-gray-600">
                  Loại công trình
                </label>
                <input
                  id="typeConstruction"
                  type="text"
                  name="typeConstruction"
                  value={formFields?.typeConstruction}

                  className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Default Input"
                  onChange={handleInputChange}

                />
              </div>    <div>
                <label htmlFor="year" className="text-sm text-gray-600">
                  Năm thiết kế
                </label>
                <input
                  id="year"
                  type="text"
                  name="year"
                  value={formFields?.year}

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
                  <option value="gardenHouse">Nhà vườn đẹp</option>
                  <option value="townHouse">Nhà phố đẹp</option>
                  <option value="villa">Biệt thự đẹp</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                  Hình ảnh hiện tại
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {dataItemImgs?.map((dataImg) => (
                    <div key={dataImg} className="image-wrapper relative">
                      <img src={dataImg} alt="Uploaded Preview" className="shadow-lg rounded-lg" />
                      <button className="absolute top-2 right-4 rounded-full bg-white w-7 h-7 shadow-2xl flex items-center justify-center " onClick={() => handleRemoveImage("old-img", dataImg)}><CiTrash /></button>
                    </div>
                  ))}
                </div>
                <label htmlFor="defaultInput" className="text-sm text-gray-600">
                  Hình ảnh mới
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
                      <button className="absolute top-2 right-4 rounded-full bg-white w-7 h-7 flex items-center justify-center shadow-2xl  " onClick={() => handleRemoveImage("new-img", image.id)}><CiTrash /></button>
                    </div>
                  ))}
                </div>
              </div>



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

export default Dashboard;
