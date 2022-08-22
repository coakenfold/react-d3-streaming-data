import React from "react";
interface Props {
  children: React.ReactNode;
}
export const AppProviders = ({ children }: Props) => {
  return <>{children}</>;
};
