
export default Providers;  

import { BrowserRouter } from "react-router-dom";
import React from "react";

export function Providers({ children }: {
    children : React.ReactNode
}) {
  return (
    <BrowserRouter>
      <main>
        {children}
      </main>
    </BrowserRouter>
  );
}


