import React from "react";
import Input from "src/components/Input";

export default function Profile() {
  return (
    <div className="rounded-sm bg-white px-4 pb-10 shadow md:px-7 md:pb-20">
      <div className="sm: border-b border-b-gray-200 py-6 text-center md:text-left">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Hồ sơ của tôi
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>

      <div className="md:flex-row mt-8 flex flex-col-reverse md:items-start">
        <form className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className=" flex flex-wrap ">
            <div className="truncate pr-5 sm:pr-0 pt-3 capitalize sm:w-[20%] sm:text-right">
              Email:
            </div>
            <div className="w-[80%] sm:pl-5">
              <div className="pt-3 text-gray-700">bi*********98@gmail.com</div>
            </div>
          </div>

          <div className=" mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Tên:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Số điện thoại:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Địa chỉ:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Ngày sinh:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <div className="flex justify-between gap-5">
                <select
                  className="h-10 w-[32%] rounded-sm border border-black/10 pl-2 hover:cursor-pointer
                 hover:border-orange"
                >
                  <option disabled>Ngày</option>
                </select>
                <select
                  className="h-10 w-[32%] rounded-sm border border-black/10 pl-2 hover:cursor-pointer
                 hover:border-orange"
                >
                  <option disabled>Tháng</option>
                </select>
                <select
                  className="h-10 w-[32%] rounded-sm border border-black/10 pl-2 hover:cursor-pointer
                 hover:border-orange"
                >
                  <option disabled>Năm</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-center md:w-72 md:items-center md:border-l  md:border-l-gray-300 md:py-8">
          <div className="flex flex-col mb-6 md:mb-0 items-center">
            <div className="my-5 h-24 w-24">
              <img
                src="https://cf.shopee.vn/file/sg-11134004-23030-h944s18hilovdf_tn"
                alt="avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <input className="hidden" type="file" accept=".jpg,.jpeg,.png" />
            <button
              className="flex h-10 items-center justify-end rounded-sm border 
            bg-white px-6 text-sm text-gray-600 shadow-sm"
            >
              Chọn Ảnh
            </button>

            <div className="mt-3 text-gray-400">
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
