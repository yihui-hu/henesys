import { useRouter } from "next/navigation"

const Error404 = () => {
  const router = useRouter();
  
  return (
    <div>
      <h2>This page does not exist.</h2>
      <h2 onClick={() => router.push("/")}>Return home</h2>
    </div>
  );
};

export default Error404;
