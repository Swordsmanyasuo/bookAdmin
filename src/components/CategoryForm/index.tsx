
import {
  Button,
  Form,
  Image,
  Input,
  Select,
  message,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import styles from "./index.module.css";
import { BookType, CategoryType } from "@/types";
import Content from "../Content";
import dayjs from "dayjs";
import { LEVEL_OPTION } from "@/pages/category";
import { categoryAdd, getCategoryList } from "@/api/category";

export default function categoryForm({ title }: { title: string }) {
  const router = useRouter();
  const [form] = Form.useForm();
  // const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [preview, setPreview] = useState();
  const [cover, setCover] = useState('');
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf();
    }
    await categoryAdd(values)
    message.success('创建成功')
    router.push('/category')
  }
  const handlePreview = () => {
    setPreview(form.getFieldValue("cover"));
  };
  let [Level, setLevel] = useState(1)

  let fetchData = async () => {
    const res = await getCategoryList({ all: true, level: 1 })
    setLevelOneList(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const levelOneOptions: any = useMemo(() => {
    return levelOneList.map(item => {
      return {
        value: item._id,
        label: item.name
      }
    })
  }, [levelOneList])


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

        <Form.Item label="级别" name="level"
          rules={[
            {
              required: true,
              message: "请选择级别",
            },
          ]}
        >
          <Select
            allowClear
            placeholder="请选择"
            onChange={(value) => {
              setLevel(value)
            }}
            options={LEVEL_OPTION}
          ></Select>


        </Form.Item>
        {Level === 2 && <Form.Item label="所属级别" name="parent"
          rules={[
            {
              required: true,
              message: "请选择所属级别",
            },
          ]}
        >
          <Select
            allowClear
            placeholder="请选择"
            options={levelOneOptions}
          ></Select>
        </Form.Item>}

        {preview && (
          <Form.Item label=" " colon={false}>
            <Image width={200} height={200} alt="封面" src={preview} />
          </Form.Item>
        )}
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
