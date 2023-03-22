import React from "react"

import { createBrowserRouter } from "react-router-dom";
import { ProtocolEditor } from "../components/ProtocolEditor";
import { FlexFormsComponent } from "./flexForms";
import { LandingPageComponent } from "./landingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageComponent />,
  },
  {
    path: "flex-robot",
    element: <FlexFormsComponent />
  },
  {
    path: "/ot-2-robot",
    element: <ProtocolEditor />,
  },
]);