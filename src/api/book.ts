import { BookType } from "@/types";
import request from "@/utils/request";
import qs from "qs";
// 从 BookType 中挑选出部分属性（name、category 和 author）的组合，同时还包括了可选属性 current、pageSize 和 all。
export const getBookList = (
  params: Partial<Pick<BookType, "name" | "category" | "author">> & {
    current?: number;
    pageSize?: number;
    all?: boolean;
  }
) => {
  return request.get(`/api/books?${qs.stringify(params)}`);
};

export const bookUpdate = (id: string, params: BookType) => {
  return request.put(`/api/books/${id}`, params);
};

export const bookAdd = (params: BookType) => {
  return request.post("/api/books", params);
};

export const getBookDetail = (id: string) => {
  return request.get(`/api/books/${id}`);
};

export const bookDelete = (id: string) => {
  return request.delete(`/api/books/${id}`);
};
