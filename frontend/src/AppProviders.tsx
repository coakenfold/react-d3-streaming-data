import React from "react";
import { store } from "./state";
import { Provider as ReactRedux } from "react-redux";

interface Props {
  children: React.ReactNode;
}
export const AppProviders = ({ children }: Props) => {
  return <ReactRedux store={store}>{children}</ReactRedux>;
};
