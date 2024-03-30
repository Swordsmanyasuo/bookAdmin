import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, TablePaginationConfig, Tooltip, message } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from './index.module.css'
import dayjs from "dayjs";
import { bookDelete, getBookList } from "@/api/book";
import { BookQueryType, BookType, CategoryType } from "@/types";
import Content from "@/components/Content";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getCategoryList } from "@/api/category";

const Option = Select.Option;
const COLUMNS = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover',
    width: 150,
    render: () => {
      return <img
        width={120}
        src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
        alt="cover"
      />
    }
  },
  {
    title: '作者',
    width: 120,
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '分类',
    width: 80,
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '描述',
    ellipsis: true,
    width: 200,
    dataIndex: 'description',
    key: 'description',
    render: (text: string) => {
      return <Tooltip title={text} placement="topLeft">
        {text}
      </Tooltip>
    }
  },
  {
    title: '库存',
    width: 80,
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: '创建时间',
    width: 130,
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text: string) => {
      return dayjs(text).format('YYYY-MM-DD')
    }
  },
]
export default function Home() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  })
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [list, setList] = useState<BookType[]>([]);
  const [total, setTotal] = useState(0);
  const fetchData = useCallback(
    (search?: BookQueryType) => {
      const { name, category, author } = search || {};
      getBookList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        name,
        category,
        author,
      }).then((res) => {
        setList(res.data);
        setTotal(res.total);
      });
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  useEffect(() => {
    (async function () {
      getCategoryList({ all: true }).then((res) => {
        setCategoryList(res.data);
      });
    })();
  }, []);


  const handleSearchFinish = (values: BookQueryType) => {
    fetchData(values)
  }
  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      icon: <ExclamationCircleFilled />,
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        try {
          await bookDelete(id);
          message.success("删除成功");
          fetchData(form.getFieldsValue());
        } catch (error) {
          console.error(error);
        }
      },
    });
  };
  const handleSearchReset = () => {
    form.resetFields()
  }
  const handleBookEdit = (id: string) => {
    router.push(`/book/edit/${id}`)
  }
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  }
  const columns = [
    ...COLUMNS,
    {
      title: '操作', key: 'action', render: (_: any, row: any) =>
        <>
          <Space>
            <Button type="link" onClick={() => {
              handleBookEdit(row._id as string)
            }}>编辑</Button>
            <Button
              type="link"
              danger
              block
              onClick={() => {
                handleDeleteModal(row._id as string);
              }}
            >
              删除
            </Button>
          </Space>
        </>

    }
  ]
  return <>
    <Content title="图书列表" operation={
      <Button type="primary" onClick={() => {
        router.push("/book/add")
      }}>增加</Button>
    }>
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: '', author: '', category: ""
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="分类">
              <Select placeholder="请选择" allowClear>
                {categoryList.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  清空
                </Button>
              </Space>
            </Form.Item>
          </Col>

        </Row>
      </Form>
      <div className={styles.tableWrap}>
        <Table
          dataSource={list}
          columns={columns}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            total: total,
            showTotal: () => `共 ${total} 条`,
          }}
          scroll={{ x: 1000 }} />
      </div>
    </Content>

  </>
}
