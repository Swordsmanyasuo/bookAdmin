import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, TablePaginationConfig, Tag, Tooltip, message } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from './index.module.css'
import dayjs from "dayjs";
import { categoryDelete, getCategoryList } from "@/api/category";
import { BookQueryType, BookType, CategoryQueryType } from "@/types";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Content from "@/components/Content";

const LEVEL = {
  ONE: 1,
  TWO: 2,
};

export const LEVEL_OPTION = [
  { label: "级别1", value: LEVEL.ONE },
  { label: "级别2", value: LEVEL.TWO },
];

export default function Home() {

  const COLUMNS = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 300,
    },
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      ellipsis: true,
      width: 200,
      render: (text: number) => (
        <Tag color={text === 1 ? "green" : "cyan"}>{`级别${text}`}</Tag>
      ),
    },
    {
      title: "所属分类",
      dataIndex: "parent",
      key: "parent",
      ellipsis: true,
      width: 200,
      render: (text: { name: string }) => {
        return text?.name ?? "-";
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
  ];


  const [form] = Form.useForm()
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  })
  const [list, setList] = useState<BookType[]>([]);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    (search?: CategoryQueryType) => {
      const { name, level } = search || {};

      getCategoryList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        level,
        name
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

  const handleSearchFinish = (values: BookQueryType) => {
    fetchData(values)

  }
  const handleSearchReset = () => {
    form.resetFields()
  }
  const handleBookEdit = (id: string) => {
    router.push(`/category/edit/${id}`)
  }

  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      icon: <ExclamationCircleFilled />,
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await categoryDelete(id);
        message.success("删除成功");
        fetchData(form.getFieldsValue());
      },
    });
  };


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
    <Content title="分类列表" operation={
      <Button type="primary" onClick={() => {
        router.push("/category/edit/id")
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
            <Form.Item name="level" label="级别">
              <Select
                allowClear
                placeholder="请选择"
                options={LEVEL_OPTION}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="分类">
              <Select
                allowClear
                placeholder="请输入"
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                  { value: 'disabled', label: 'Disabled', disabled: true },
                ]}
              />
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
