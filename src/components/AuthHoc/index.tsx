import { USER_ROLE } from "@/constants";
import { useCurrentUser } from "@/utils/hoos";
import { PropsWithChildren, ReactNode, cloneElement } from "react";

export default function AuthHoc({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  return user?.role === USER_ROLE.ADMIN ? <>{children}</> : null;
};

