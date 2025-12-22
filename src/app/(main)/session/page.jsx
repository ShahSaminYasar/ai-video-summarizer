"use client";

import { useSession } from "next-auth/react";

const Session = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <pre>{JSON.stringify(session, null, 4)}</pre>
    </div>
  );
};
export default Session;
