import { useMutation, useQuery } from "@tanstack/react-query";
import produce, { current } from "immer";
import { extend, keyBy, result } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import purchaseApi from "src/apis/purchase.api";
import Button from "src/components/Button";
import QuantityController from "src/components/QuantityController";
import path from "src/constants/path";
import { purchasesStatus } from "src/constants/purchase";
import { AppContext } from "src/contexts/app.context";
import { Purchase } from "src/types/purchase.type";
import { formatCurrency, generateNameId } from "src/utils/utils";

export default function Cart() {
  const { isAuthenticated, extendedPurchase, setExtendedPurchase } =
    useContext(AppContext);

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["purchases", { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchase({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated,
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    },
  });

  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProduct,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message, {
        autoClose: 1000,
      });
    },
  });

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message, {
        autoClose: 1000,
      });
    },
  });

  const purchasesInCart = purchasesInCartData?.data.data;
  const isAllChecked = useMemo(
    () => extendedPurchase.every((purchase) => purchase.checked),
    [extendedPurchase]
  );
  const checkedPurchases = useMemo(
    () => extendedPurchase.filter((purchase) => purchase.checked),
    [extendedPurchase]
  );
  const checkedPurchasesCount = checkedPurchases.length;

  const totalPriceCheckedPurchases = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return (result + current.product.price) * current.buy_count;
      }, 0),
    [checkedPurchases]
  );

  const totalDiscountPriceCheckedPurchases = checkedPurchases.reduce(
    (result, current) => {
      return (
        (result +
          current.product.price_before_discount -
          current.product.price) *
        current.buy_count
      );
    },
    0
  );

  const location = useLocation();
  const choosenPurchaseIdFromLocation = (
    location.state as {
      purchaseId: string;
    } | null
  )?.purchaseId;

  useEffect(() => {
    setExtendedPurchase((prev) => {
      const extendedPurchasesObject = keyBy(prev, "_id");
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation =
            choosenPurchaseIdFromLocation === purchase._id;
          return {
            ...purchase,
            disabled: false,
            checked:
              isChoosenPurchaseFromLocation ||
              Boolean(extendedPurchasesObject[purchase._id]?.checked),
          };
        }) || []
      );
    });
  }, [purchasesInCart, choosenPurchaseIdFromLocation]);

  useEffect(() => {
    return () => {
      history.replaceState(null, "");
    };
  });

  const handleCheck =
    (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].checked = event.target.checked;
        })
      );
    };

  const handleCheckAll = () => {
    setExtendedPurchase((prev) => {
      return prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked,
      }));
    });
  };

  const handleQuantity = (
    purchaseIndex: number,
    value: number,
    enable: boolean
  ) => {
    if (enable) {
      const purchase = extendedPurchase[purchaseIndex];
      setExtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        })
      );
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value,
      });
    }
  };

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      })
    );
  };

  const handleDeletePurchase = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchase[purchaseIndex]._id;
    deletePurchasesMutation.mutate([purchaseId]);
  };

  const handleDeletePurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchasesMutation.mutate(purchaseIds);
  };

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count,
      }));
      buyProductMutation.mutate(body);
    }
  };

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        {extendedPurchase.length > 0 && (
          <div>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow ">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-orange"
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className="flex-grow text-black">Sản phẩm </div>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng</div>
                      <div className="col-span-1">Số tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>

                {extendedPurchase.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow">
                    {extendedPurchase?.map((purchase, index) => (
                      <div
                        className="mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200
                   bg-white py-5 px-4 text-center text-sm capitalize text-gray-500 shadow first:mt-0 "
                        key={purchase._id}
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-orange"
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>

                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id,
                                  })}`}
                                  className="h-20 w-20 flex-shrink-0"
                                >
                                  <img
                                    src={purchase.product.image}
                                    alt={purchase.product.name}
                                  />
                                </Link>

                                <div className="flex-grow px-2 pt-1 pb-2">
                                  <Link
                                    className="text-left line-clamp-2"
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id,
                                    })}`}
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className=" grid grid-cols-5 items-center justify-center">
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-450 line-through">
                                  ₫
                                  {formatCurrency(
                                    purchase.product.price_before_discount
                                  )}
                                </span>

                                <span className="ml-3 ">
                                  ₫{formatCurrency(purchase.product.price)}
                                </span>
                              </div>
                            </div>

                            <div className="col-span-1">
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper="flex items-center"
                                onIncrease={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value <= purchase.product.quantity
                                  )
                                }
                                onDecrease={(value) =>
                                  handleQuantity(index, value, value >= 1)
                                }
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !==
                                        (purchasesInCart as Purchase[])[index]
                                          .buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>

                            <div className="col-span-1">
                              <div className="flex items-center justify-center">
                                <span className="text-orange">
                                  ₫
                                  {formatCurrency(
                                    purchase.product.price * purchase.buy_count
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="col-span-1">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={handleDeletePurchase(index)}
                                  className="bg-none text-black transition-colors hover:text-orange"
                                >
                                  Xoá
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              className="sticky bottom-0 z-10 mt-10 flex flex-col  rounded-sm border border-gray-200 bg-white p-5
         shadow sm:flex-row sm:items-center"
            >
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex flex-shrink-0 items-center justify-center pr-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-orange"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button
                  onClick={handleCheckAll}
                  className="mx-3 border-none bg-none"
                >
                  Chọn tất cả ({extendedPurchase.length})
                </button>
                <button
                  onClick={handleDeletePurchases}
                  className="mx-3 border-none bg-none"
                >
                  Xoá
                </button>
              </div>

              <div className="mt-5 flex flex-col items-center justify-center sm:ml-auto sm:mt-0 sm:flex-row">
                <div>
                  <div className="flex items-center justify-center sm:flex-row sm:justify-end">
                    <div>
                      Tổng thanh toán ({checkedPurchasesCount} sản phẩm):
                    </div>
                    <div className="ml-2 text-2xl text-orange">
                      ₫{formatCurrency(totalPriceCheckedPurchases)}
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-sm sm:justify-end">
                    <div className="text-gray-500">Tiết kiệm:</div>
                    <div className="ml-6 text-orange">
                      ₫{formatCurrency(totalDiscountPriceCheckedPurchases)}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyProductMutation.isLoading}
                  className="ml-4 mt-5 flex h-10 w-44 items-center justify-center 
              bg-orange text-sm uppercase text-white hover:bg-orange/80 sm:mt-0"
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        )}

        {!(extendedPurchase.length > 0) && (
          <div className="py-20">
            <div className=" flex items-center justify-center pt-10">
              <img
                className="h-36 w-36"
                src="src/images/no-product.png"
                alt="no purchases"
              />
            </div>
            <div className="flex items-center justify-center">
              <span className="">Giỏ hàng của bạn còn trống</span>
            </div>
            <div className="flex items-center justify-center">
              <Link
                to={path.home}
                className="mt-5 flex h-10 w-44 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-orange/80"
              >
                MUA NGAY
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
