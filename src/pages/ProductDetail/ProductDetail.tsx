import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import productApi from 'src/apis/product.api';
import ProductRating from 'src/components/ProductRating';
import { Product as ProductType, productListConfig } from 'src/types/product.type';
import {
  formatCurrency,
  formatNumberToSocialStyle,
  getIdFromNameId,
  rateSale
} from 'src/utils/utils';
import Product from '../ProductList/components/Product';
import QuantityController from 'src/components/QuantityController';
import purchaseApi from 'src/apis/purchase.api';
import { Purchase } from 'src/types/purchase.type';
import { purchasesStatus } from 'src/constants/purchase';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1);
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const { data: productDetailData } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productApi.getProductsDetail(id as string)
  });
  const product = productDetailData?.data.data;
  const queryClient = useQueryClient();

  const queryConfig: productListConfig = { limit: '20', page: 1, category: product?.category._id };
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  });

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body)
  });

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState('');

  const imageRef = useRef<HTMLImageElement>(null);
  const currentImages = useMemo(
    () => (product ? product?.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  );

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType)?.images.length) {
      setCurrentIndexImages((prev) => {
        return [prev[0] + 1, prev[1] + 1];
      });
    }
  };

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => {
        return [prev[0] - 1, prev[1] + -1];
      });
    }
  };

  const chooseActive = (img: string) => {
    setActiveImage(img);
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const image = imageRef.current as HTMLImageElement;
    const { naturalHeight, naturalWidth } = image;
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta xử lý đc Bubble Event
    // const { offsetX, offsetY } = event.nativeEvent;

    //Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được Bubble Event
    const offsetX = event.pageX - (rect.x + window.scrollX);
    const offsetY = event.pageY - (rect.y + window.scrollY);
    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);
    image.style.width = naturalWidth + 'px';
    image.style.height = naturalHeight + 'px';
    image.style.maxWidth = 'unset';
    image.style.top = top + 'px';
    image.style.left = left + 'px';
  };

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style');
  };

  const handleBuyCount = (value: number) => {
    setBuyCount(value);
  };

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1000 }),
            queryClient.invalidateQueries({
              queryKey: ['purchases', { status: purchasesStatus.inCart }]
            });
        }
      }
    );
  };

  if (!product) return null;

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='rounded-md bg-white/30 p-6 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className=' relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className=' absolute top-0 left-0 h-full w-full   bg-white object-cover'
                  ref={imageRef}
                />
              </div>

              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={prev}
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = activeImage === img;
                  return (
                    <div
                      className='relative w-full pt-[100%]'
                      key={img}
                      onMouseEnter={() => chooseActive(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && (
                        <div className='absolute inset-0 cursor-pointer border-2 border-orange' />
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={next}
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className='col-span-7'>
              <h1 className='text-xl font-medium capitalize'>{product.name}</h1>

              <div className='mt-5 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-2 border-b border-b-orange text-orange'>
                    {product.rating}
                  </span>

                  <ProductRating
                    rating={product.rating}
                    activeClassName='fill-orange text-orange h-4 w-4'
                    notActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>

                <div className='mx-4 h-6 w-[1px] bg-gray-400'></div>

                <div>
                  <span>{formatNumberToSocialStyle(product.sold)} </span>
                  <span className='ml-1 text-sm text-gray-500'>Đã Bán</span>
                </div>
              </div>

              <div className='mt-8 flex items-center bg-gray-200 px-5 py-4'>
                <div className='text-gray-500 line-through'>
                  <span>₫</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>

                <div className='ml-3 text-3xl font-medium text-orange'>
                  <span>₫</span>
                  <span>{formatCurrency(product.price_before_discount)}</span>
                </div>

                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>

              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>

                <QuantityController
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />

                <div className='ml-6 text-sm text-gray-600'>{product.quantity} sản phẩm có sẵn</div>
              </div>

              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm 
                border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-6 w-6 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        x1='7.5'
                        x2='10.5'
                        y1={7}
                        y2={7}
                      />
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        x1={9}
                        x2={9}
                        y1='8.5'
                        y2='5.5'
                      />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>

                <button
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center 
                rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 rounded-md bg-white/30 p-6 shadow'>
          <div className='rounded  p-4 text-lg uppercase text-gray-600'>Chi tiết sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className='mt-8 '>
        <div className='container'>
          <div className='rounded-md bg-white/30 p-6 shadow'>
            <div className='uppercase text-gray-600'>Có thể bạn cũng thích</div>
            {productsData && (
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
