"user client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store, RootState } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<RootState>(undefined);
  if (!storeRef.current) {
    storeRef.current = store;
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
