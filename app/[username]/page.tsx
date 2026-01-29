import WrappedClient from "./wrapped";
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; 

  return <WrappedClient username={username} />;
}
