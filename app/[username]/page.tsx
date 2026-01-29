import WrappedClient from "./wrapped";
export const runtime = 'edge';
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; 

  return <WrappedClient username={username} />;
}
