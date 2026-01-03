import Header02 from "@/components/header/Header02";
import React from "react";

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
