import { getBorrowDetail } from "@/api";
import { BorrowForm } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BorrowBook() {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    getBorrowDetail(router.query.id as string).then((res) => {
      setData(res.data);
    });
  }, [router.query.id]);

  return <BorrowForm title="借阅编辑" editData={data} />;
};

