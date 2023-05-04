import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { schema, Schema } from "src/utils/rules";
import Input from "src/components/Input";
import authApi from "src/apis/auth.api";
import { axiosUnprocessableEntityError } from "src/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import { useContext } from "react";
import { AppContext } from "src/contexts/app.context";
import Button from "src/components/Button";
import { omit, Omit } from "lodash";
import { string } from "yup";
import path from "src/constants/path";

type FormData = Pick<Schema, "email" | "password" | "password_confirm">;
const registerSchema = schema.pick(["password", "email", "password_confirm"]);

export default function Register() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } =
    useContext(AppContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) =>
      authApi.registerAccount(body as { email: string; password: string }),
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["password_confirm"]);
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        navigate("/");
      },

      onError: (error) => {
        if (
          axiosUnprocessableEntityError<
            ErrorResponse<Omit<FormData, "password_confirm">>
          >(error)
        ) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, "password_confirm">, {
                message:
                  formError[key as keyof Omit<FormData, "password_confirm">],
                type: "Server",
              });
            });
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   });
          // }

          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   });
          // }
        }
      },
    });
  });

  return (
    <div className="bg-orange">
      <div className="container ">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-20 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form
              className="rounded bg-white p-[30px] shadow-sm"
              onSubmit={onSubmit}
              noValidate
            >
              <div className="text-[1.25rem]">Đăng ký</div>
              <Input
                className="mt-8"
                type="email"
                placeholder="Email"
                name="email"
                register={register}
                errorMessage={errors.email?.message}
                autoComplete="on"
              />

              <Input
                className="mt-2"
                type="password"
                placeholder="Password"
                name="password"
                register={register}
                classNameEye="absolute right-[7px] top-[12px] h-5 w-5 cursor-pointer"
                errorMessage={errors.password?.message}
                autoComplete="on"
              />

              <Input
                className="mt-2"
                type="password"
                placeholder="Confirm Password"
                name="password_confirm"
                classNameEye="absolute right-[7px] top-[12px] h-5 w-5 cursor-pointer"
                register={register}
                errorMessage={errors.password_confirm?.message}
                autoComplete="on"
              />

              <div className="mt-2">
                <Button
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  className="flex w-full items-center justify-center rounded-sm bg-orange py-4 px-2 text-center text-white"
                >
                  Đăng ký
                </Button>
              </div>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center">
                  <span className=" text-black/[0.26]">
                    Bạn đã có tài khoản?
                  </span>
                  <Link to={path.login}>
                    <span className="pl-1 text-orange hover:cursor-pointer">
                      Đăng nhập
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
