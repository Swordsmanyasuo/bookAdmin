
import styles from "./index.module.css";
import { PropsWithChildren, ReactNode } from "react";
export default function Content({ children, title, operation }: {
  children: ReactNode
  operation?: ReactNode;
  title: string;
}) {
  return (
    <>
      <div className={styles.title}>
        {title}
        {operation && <span className={styles.btn}>{operation}</span>}
      </div>
      <div className={styles.content}>{children}</div>
    </>
  );
}