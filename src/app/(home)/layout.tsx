import type React from "react";
import Header02 from "@/components/header/Header02";

const Poslayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header02 />
      <div>{children}</div>
    </>
  );
};

export default Poslayout;
