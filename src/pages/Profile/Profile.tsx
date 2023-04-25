import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import userApi from "src/apis/user.api";
import Input from "src/components/Input";
import InputNumber from "src/components/InputNumber";
import { UserSchema, userSchema } from "src/utils/rules";
import DateSelect from "../User/components/DateSelect";

type FormData = Pick<
  UserSchema,
  "address" | "avatar" | "date_of_birth" | "name" | "phone"
>;

const profileSchema = userSchema.pick([
  "name",
  "avatar",
  "phone",
  "date_of_birth",
  "address",
]);

export default function Profile() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      avatar: "",
      date_of_birth: new Date(1990, 0, 1),
    },
    resolver: yupResolver(profileSchema),
  });

  const updateProfileMutation = useMutation(userApi.updateProfile);

  const { data: profileData } = useQuery({
    queryKey: ["profiles"],
    queryFn: userApi.getProfile,
  });

  const profile = profileData?.data.data;

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name);
      setValue("phone", profile.phone);
      setValue("address", profile.address);
      setValue("avatar", profile.avatar);
      setValue(
        "date_of_birth",
        profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : new Date(1990, 0, 1)
      );
    }
  }, [profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log("check data: ", data);
    // await updateProfileMutation.mutateAsync({

    // })
  });

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

      <form
        className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
        onSubmit={onSubmit}
      >
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className=" flex flex-wrap ">
            <div className="truncate pr-5 pt-3 capitalize sm:w-[20%] sm:pr-0 sm:text-right">
              Email:
            </div>
            <div className="w-[80%] sm:pl-5">
              <div className="pt-3 text-gray-700">{profile?.email}</div>
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
                placeholder="Tên"
                name="name"
                register={register}
                errorMessage={errors.name?.message}
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Số điện thoại:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <InputNumber
                    classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    placeholder="Số điện thoại"
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
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
                placeholder="Địa chỉ"
                name="address"
                register={register}
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name="date_of_birth"
            render={({ field }) => (
              <DateSelect
                errorMessage={errors.date_of_birth?.message}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />

          <div className=" mt-2 flex flex-col flex-wrap md:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="mt-3 flex w-full md:mt-0 md:w-[80%] md:justify-center md:pl-5">
              <button
                className="mt-3 flex h-12 w-full items-center justify-center rounded-sm 
                bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90 md:w-[150px] "
                type="submit"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:w-72 md:items-center md:border-l  md:border-l-gray-300 md:py-8">
          <div className="mb-6 flex flex-col items-center md:mb-0">
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
              type="button"
            >
              Chọn Ảnh
            </button>

            <div className="mt-3 text-gray-400">
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
