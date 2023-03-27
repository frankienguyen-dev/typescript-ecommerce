import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import authApi from 'src/apis/auth.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import path from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { ErrorResponse } from 'src/types/utils.type';
import { Schema, schema } from 'src/utils/rules';
import { axiosUnprocessableEntityError } from 'src/utils/utils';

type FormData = Pick<Schema, 'password' | 'email'>;
const loginSchema = schema.pick(['password', 'email']);

export default function Login() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  });

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'password_confirm'>) => authApi.loginAccount(body)
  });

  const onSubmit = handleSubmit((data) => {
    console.log('check data login: ', data);
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        navigate('/');
      },

      onError: (error) => {
        if (axiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              });
            });
          }
        }
      }
    });
  });

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-20 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-[30px] shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-[1.25rem]'>Đăng nhập</div>
              <Input
                className='mt-8'
                type='email'
                placeholder='Email'
                name='email'
                register={register}
                errorMessage={errors.email?.message}
                autoComplete='on'
              />

              <Input
                className='mt-2'
                type='password'
                placeholder='Password'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
                autoComplete='on'
              />

              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center rounded-sm bg-orange py-4 px-2 text-center text-white'
                  isLoading={loginAccountMutation.isLoading}
                  disabled={loginAccountMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>

              <div className='mt-8  text-center '>
                <div className='flex items-center justify-center '>
                  <span className=' text-black/[0.26]'>Bạn mới biết đến Shopee?</span>
                  <Link to={path.register}>
                    <span className='pl-1 text-orange hover:cursor-pointer'>Đăng ký</span>
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
