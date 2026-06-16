import type { ReactNode } from "react";

import "./tds-preview.css";

interface TDSMobileAITProviderProps {
  children: ReactNode;
  brandPrimaryColor?: string;
}

export function TDSMobileAITProvider({ children }: TDSMobileAITProviderProps) {
  return <>{children}</>;
}
