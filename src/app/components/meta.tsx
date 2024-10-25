// src/app/components/Meta.tsx
"use client"; // This is a client component

import { usePathname } from 'next/navigation'; // Import usePathname
import { metadata as homeMetadata } from '../metadata'; // Import home metadata
import { metadata as loginMetadata } from '../(auth)/login/metadata'; // Import login metadata
import { metadata as registerMetadata } from '../(auth)/register/metadata'; // Import register metadata

const Meta = () => {
  // Get the current path
  const currentPath = usePathname();
  let currentMetadata;

  // Determine metadata based on the current path
  if (currentPath.includes('/login')) {
    currentMetadata = loginMetadata;
  } else if (currentPath.includes('/register')) {
    currentMetadata = registerMetadata;
  } else {
    currentMetadata = homeMetadata;
  }

  // Kiểm tra giá trị và gán giá trị mặc định là chuỗi
  const title: string = typeof currentMetadata?.title === 'string' ? currentMetadata.title : 'Default Title';
  const description: string = typeof currentMetadata?.description === 'string' ? currentMetadata.description : 'Default description';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
};

export default Meta;
