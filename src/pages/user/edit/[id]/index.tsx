import { getUserDetail } from "@/api";
import { UserForm } from "@/components";
import { UserType } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserAdd() {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const res = await getUserDetail(router.query.id as string);
      setData(res.data);
    })();
  }, [router.query.id]);

  return <UserForm title="用户编辑" editData={data} />;
};

