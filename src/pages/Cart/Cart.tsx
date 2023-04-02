import { useMutation, useQuery } from '@tanstack/react-query';
import produce from 'immer';
import { extend, keyBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import purchaseApi from 'src/apis/purchase.api';
import Button from 'src/components/Button';
import QuantityController from 'src/components/QuantityController';
import path from 'src/constants/path';
import { purchasesStatus } from 'src/constants/purchase';
import { Purchase } from 'src/types/purchase.type';
import { formatCurrency, generateNameId } from 'src/utils/utils';

interface ExtendedPurchase extends Purchase {
  disabled: boolean;
  checked: boolean;
}

export default function Cart() {
  const [extendedPurchase, setExtendedPurchase] = useState<ExtendedPurchase[]>([]);

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchase({ status: purchasesStatus.inCart }),
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    },
  });

  const purchasesInCart = purchasesInCartData?.data.data;
  const isAllChecked = extendedPurchase.every((purchase) => purchase.checked);

  useEffect(() => {
    setExtendedPurchase((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id');
      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchaseObject[purchase._id]?.checked),
        })) || []
      );
    });
  }, [purchasesInCart]);

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
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

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
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
                            <img src={purchase.product.image} alt={purchase.product.name} />
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
                            ₫{formatCurrency(purchase.product.price_before_discount)}
                          </span>

                          <span className="ml-3 ">₫{formatCurrency(purchase.product.price)}</span>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <QuantityController
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          classNameWrapper="flex items-center"
                          onIncrease={(value) =>
                            handleQuantity(index, value, value <= purchase.product.quantity)
                          }
                          onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                          onType={handleTypeQuantity(index)}
                          onFocusOut={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value >= 1 &&
                                value <= purchase.product.quantity &&
                                value !== (purchasesInCart as Purchase[])[index].buy_count
                            )
                          }
                          disabled={purchase.disabled}
                        />
                      </div>

                      <div className="col-span-1">
                        <div className="flex items-center justify-center">
                          <span className="text-orange">
                            ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <div className="flex items-center justify-center">
                          <button className="bg-none text-black transition-colors hover:text-orange">
                            Xoá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <button onClick={handleCheckAll} className="mx-3 border-none bg-none">
              Chọn tất cả ({extendedPurchase.length})
            </button>
            <button className="mx-3 border-none bg-none">Xoá</button>
          </div>

          <div className="mt-5 flex flex-col items-center justify-center sm:ml-auto sm:mt-0 sm:flex-row">
            <div>
              <div className="flex items-center justify-center sm:flex-row sm:justify-end">
                <div>Tổng thanh toán ({extendedPurchase.length} sản phẩm):</div>
                <div className="ml-2 text-2xl text-orange">₫438000</div>
              </div>

              <div className="flex items-center justify-center text-sm sm:justify-end">
                <div className="text-gray-500">Tiết kiệm:</div>
                <div className="ml-6 text-orange">₫138000</div>
              </div>
            </div>

            <Button
              className="ml-4 mt-5 flex h-10 w-44 items-center justify-center 
              bg-orange text-sm uppercase text-white hover:bg-orange/80 sm:mt-0"
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
