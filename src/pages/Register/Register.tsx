import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Input from "src/components/Input";
import { schema, Schema } from "src/utils/rules";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import authApi from "src/apis/auth.api";
import omit from "lodash/omit";
import { isAxiosError } from "axios";
import { axiosUnprocessableEntityError } from "src/utils/utils";
import { ServerResponse } from "http";
import { ErrorResponse } from "src/types/utils.type";
import { AppContext } from "src/contexts/app.context";
import Button from "src/components/Button";
import path from "src/constants/path";

type formData = Pick<Schema, "email" | "password" | "password_confirm">;
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
  } = useForm<formData>({
    resolver: yupResolver(registerSchema),
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<formData, "password_confirm">) =>
      authApi.registerAccount(body),
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
            ErrorResponse<Omit<formData, "password_confirm">>
          >(error)
        ) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<formData, "password_confirm">, {
                message:
                  formError[key as keyof Omit<formData, "password_confirm">],
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
                errorMessage={errors.password?.message}
                autoComplete="on"
              />

              <Input
                className="mt-2"
                type="password"
                placeholder="Confirm Password"
                name="password_confirm"
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
