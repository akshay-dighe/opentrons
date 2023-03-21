import * as React from 'react'
import {
  RouterProvider,
} from "react-router-dom";

import '../css/reset.css'
import { router } from '../flex-components';

export function App(): JSX.Element {
  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  )
}
