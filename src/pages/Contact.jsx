import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar/Index";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { message } from "antd";

function Contact() {

  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)

  const [sidebarToggle] = useOutletContext();
  const [formFields, setFormFields] = useState({
    address: '',
    phone: '',
    linkWeb: '',
    mst: '',
    script: '',
  });

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
      formData.append("address", formFields?.address)
      formData.append("phone", formFields?.phone)
      formData.append("linkWeb", formFields?.linkWeb)
      formData.append("mst", formFields?.mst)
      formData.append("script", formFields?.script)
      const uploadResponse = await axios.put(
        `http://localhost:5000/edit-handbook`,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      );
      message.success(uploadResponse?.data?.message)
      setReload((prev) => prev + 1)
      setLoading(false)
    } catch (error) {
      console.error('Error editing project:', error);
      setLoading(false)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.post('http://localhost:5000/get-contact');
        const data = response.data.data[0]
        setFormFields({
          address: data?.address || '',
          phone: data?.phone || '',
          linkWeb: data?.linkWeb || '',
          mst: data?.mst || '',
          script: data?.script || ''
        })
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
      <main className="h-full">
        <div className="mainCard">
          <div className="flex flex-col gap-4">
            {/* Form Default */}
            <div>
              <label htmlFor="address" className="text-sm text-gray-600">
                Địa chỉ
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formFields?.address}
                className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                placeholder="Default Input"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm text-gray-600">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formFields?.phone}
                className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                placeholder="Default Input"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="linkWeb" className="text-sm text-gray-600">
                Địa chỉ website
              </label>
              <input
                id="linkWeb"
                type="text"
                name="linkWeb"
                value={formFields?.linkWeb}
                className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                placeholder="Default Input"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="mst" className="text-sm text-gray-600">
                Mã số thuế
              </label>
              <input
                id="mst"
                type="text"
                name="mst"
                value={formFields?.mst}
                className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                placeholder="Default Input"
                onChange={handleInputChange}
              />
            </div>
            <label htmlFor="mst" className="text-sm text-gray-600">
              Thêm các thông tin khác
            </label>
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
                Sửa liên hệ
              </button>

            </div>
          </div>
        </div>
      </main>
      {/* <Spin spinning={loading} fullscreen /> */}

    </>
  )
}

export default Contact;
