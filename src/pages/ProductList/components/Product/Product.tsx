import React from 'react';
import { Link } from 'react-router-dom';
import ProductRating from 'src/components/ProductRating';
import path from 'src/constants/path';
import { Product as ProductType } from 'src/types/product.type';
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils';

interface Props {
  product: ProductType;
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div
        className='overflow-hidden rounded-sm bg-white shadow transition-transform 
      duration-100 hover:translate-y-[0.04rem] hover:shadow-sm'
      >
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 h-full w-full bg-white object-cover'
          />
        </div>

        <div className='overflow-hidden p-3'>
          <div className='min-h-[2.5rem] text-sm line-clamp-2'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-[12px] text-gray-500 line-through'>
              <span>₫</span>
              <span>{formatCurrency(product.price_before_discount)}</span>
            </div>

            <div className='text-md ml-1 truncate text-orange'>
              <span>₫</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>

          <div className='flex-start mt-3 flex items-center'>
            <ProductRating rating={product.rating} />

            <div className='ml-2 text-xs text-gray-600'>
              <span>Đã bán</span>
              <span className='ml-1'>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
