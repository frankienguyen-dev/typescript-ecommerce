import { Product, ProductList, productListConfig } from 'src/types/product.type';
import { SuccessResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const URL = 'products';

const productApi = {
  getProducts(params: productListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, { params });
  },

  getProductsDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`);
  }
};

export default productApi;
