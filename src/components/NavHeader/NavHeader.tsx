import React, { useContext } from "react";
import Popover from "../Popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppContext } from "src/contexts/app.context";
import { Link } from "react-router-dom";
import path from "src/constants/path";
import authApi from "src/apis/auth.api";
import { purchasesStatus } from "src/constants/purchase";

export default function NavHeader() {
  const queryClient = useQueryClient();
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } =
    useContext(AppContext);

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logoutAccount(),
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
      queryClient.removeQueries({
        queryKey: ["purchases", { status: purchasesStatus.inCart }],
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex justify-end">
      <Popover
        className="flex cursor-pointer items-center py-1 hover:text-white/70"
        renderPopover={
          <div
            className='relative top-0 left-[-50px] rounded-sm border border-gray-300
                   bg-white shadow-md after:absolute after:top-[-20px] after:right-[0px] after:h-[20px] after:w-[120px]
                     after:cursor-pointer after:bg-transparent after:content-[""]'
          >
            <div className="flex flex-col py-2 px-1">
              <button className="mr-28 py-2 px-3 text-left text-[0.9rem] hover:text-orange">
                Tiếng Việt
              </button>
              <button className="mt-2 mr-28 py-2 px-3 text-left text-[0.9rem] hover:text-orange">
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span className="mx-1 text-[0.8rem] ">Tiếng Việt</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </Popover>

      {isAuthenticated && (
        <Popover
          className=' relative ml-6 flex cursor-pointer items-center py-1 after:absolute after:top-[20px] 
            after:right-[-20px] after:h-[20px] after:w-[160px] after:cursor-pointer
            after:bg-transparent after:content-[""] hover:text-white/70 '
          renderPopover={
            <div className="rounded-sm border border-gray-300 shadow-md">
              <Link
                to={path.profile}
                className="block w-full bg-white py-3 px-4 text-left text-[0.9rem] hover:bg-slate-100 hover:text-cyan-500"
              >
                Tài khoản của tôi
              </Link>

              <Link
                to={path.home}
                className="block w-full bg-white py-3 px-4 text-left text-[0.9rem] hover:bg-slate-100 hover:text-cyan-500"
              >
                Đơn mua
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full bg-white py-3 px-4 text-left text-[0.9rem] hover:bg-slate-100 hover:text-cyan-500"
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div className="mr-2 h-6 w-6 flex-shrink-0">
            <img
              src="https://cf.shopee.vn/file/sg-11134004-23030-h944s18hilovdf_tn"
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div className="text-[0.8rem]">{profile?.email}</div>
        </Popover>
      )}

      {!isAuthenticated && (
        <div className="flex items-center">
          <Link
            to={path.register}
            className=" mx-4 text-[0.825rem] capitalize hover:text-white/70"
          >
            Đăng ký
          </Link>
          <div className="h-4 border-r-[1px] border-r-white/40 "></div>
          <Link
            to={path.login}
            className="mx-4 text-[0.825rem] capitalize hover:text-white/70"
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
