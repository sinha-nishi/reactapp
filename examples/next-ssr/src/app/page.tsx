'use client';

import { ReactApplication } from "@pkvsinha/react-app";

const config = { views: [
    
  ] }

export default function Home() {
    return <ReactApplication
      app={config}
      strictValidation={false}
    />
}