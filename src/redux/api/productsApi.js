/**
 * RTK Query - FakeStoreAPI integration
 * Auto caching, loading, error states — baar baar loading nahi hogi
 */

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fakestoreapi.com',
  }),
  tagTypes: ['Products', 'Categories'],
  keepUnusedDataFor: 300, // cache 5 min
  endpoints: builder => ({
    getProducts: builder.query({
      query: (limit = 20) => `/products?limit=${limit}`,
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: id => `/products/${id}`,
      providesTags: (result, error, id) => [{type: 'Products', id}],
    }),
    getCategories: builder.query({
      query: () => '/products/categories',
      providesTags: ['Categories'],
    }),
    getProductsByCategory: builder.query({
      query: category => `/products/category/${category}`,
      providesTags: (result, error, category) => [
        {type: 'Products', id: category},
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
