import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { omit } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import userApi from "src/apis/user.api";
import Input from "src/components/Input";
import { ErrorResponse } from "src/types/utils.type";
import { UserSchema, userSchema } from "src/utils/rules";
import { axiosUnprocessableEntityError } from "src/utils/utils";

type FormData = Pick<
  UserSchema,
  "password" | "password_confirm" | "new_password"
>;

const passwordSchema = userSchema.pick([
  "password",
  "password_confirm",
  "new_password",
]);

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      new_password: "",
      password_confirm: "",
    },
    resolver: yupResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation(userApi.updateProfile);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(
        omit(data, ["password_comfirm"])
      );
      toast.success(res.data.message, { autoClose: 1000 });
      reset();
    } catch (error) {
      if (axiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: "Server",
            });
          });
        }
      }
    }
  });

  return (
    <div className="rounded-sm bg-white px-4 pb-10 shadow md:px-7 md:pb-20">
      <div className="sm: border-b border-b-gray-200 py-6 text-center md:text-left">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>

      <form className="mt-8 mr-auto max-w-2xl" onSubmit={onSubmit}>
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mật khẩu cũ:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Input
                className="relative"
                classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                placeholder="Mật khẩu cũ"
                name="password"
                register={register}
                type="password"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mật khẩu mới:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Input
                className="relative"
                classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                placeholder="Mật khẩu mới"
                name="new_password"
                type="password"
                register={register}
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Nhập lại mật khẩu:
            </div>
            <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">
              <Input
                className="relative"
                classNameInput="w-full rounded-sm border-[1px] border-gray-300 
              px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                placeholder="Nhập lại mật khẩu"
                name="password_confirm"
                type="password"
                register={register}
                errorMessage={errors.password_confirm?.message}
              />
            </div>
          </div>

          <div className=" mt-2 flex flex-col flex-wrap md:flex-row ">
            <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="mt-3 flex w-full md:mt-0 md:w-[80%] md:justify-center  md:pl-5">
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
      </form>
    </div>
  );
}
