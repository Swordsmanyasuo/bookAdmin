// import { getCategoryList } from "@/api";
// import { bookAdd, bookUpdate } from "@/api/book";
// import { BookFormType, BookType, CategoryType } from "@/types";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./index.module.css";
import { BookType, CategoryType } from "@/types";
import { bookAdd } from "@/api/book";
import Content from "../Content";
import dayjs from "dayjs";
import { getCategoryList } from "@/api/category";
const Option = Select.Option;

export default function BookForm({ title }: { title: string }) {
  const router = useRouter();
  const [form] = Form.useForm();
  // const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [preview, setPreview] = useState();
  const [cover, setCover] = useState('');
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf();
    }
    await bookAdd(values)
    message.success('创建成功')
    router.push('/book')
  }
  const handlePreview = () => {
    setPreview(form.getFieldValue("cover"));
  };
  useEffect(() => {
    (async function () {
      getCategoryList({ all: true }).then((res) => {
        setCategoryList(res.data);
      });
    })();
  }, []);
  return <>
    <Content title={title}>
      <Form
        name="book"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 18 }}
        className={styles.form}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入名称",
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="作者"
          name="author"
          rules={[
            {
              required: true,
              message: "请输入作者",
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="分类"
          name="category"
          rules={[
            {
              required: true,
              message: "请选择图书分类",
            },
          ]}
        >
          <Select placeholder="请选择" allowClear>
            {categoryList.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="封面" name="cover">
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 65px)" }}
              value={cover}
              onChange={(e) => {
                setCover(e.target.value);
                form.setFieldValue("cover", e.target.value);
              }}
            />
            <Button type="primary" onClick={handlePreview}>
              预览
            </Button>
          </Input.Group>
        </Form.Item>
        {preview && (
          <Form.Item label=" " colon={false}>
            <Image width={200} height={200} alt="封面" src={preview} />
          </Form.Item>
        )}
        <Form.Item
          label="出版日期"
          name="publishAt"
          className={styles.publishAt}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label="库存" name="stock">
          <InputNumber />
        </Form.Item>
        <Form.Item label="描述" name="description">

        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
          >
            创建
          </Button>
        </Form.Item>
      </Form>
    </Content>
  </>;
}
