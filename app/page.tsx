"use client";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWrapped() {
    if (!username) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/github-wrapped?username=${username}`);
      const json = await res.json();
      if (!res.ok) throw new Error();
      setData(json);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "auto" }}>
      <h1>🎁 GitHub Wrapped</h1>

      <input
        placeholder="github username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />
      <button onClick={fetchWrapped} disabled={loading}>
        {loading ? "Loading..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: 30 }}>
          <img src={data.avatarUrl} width={100} />
          <h2>@{data.username}</h2>

          <p>👥 Followers: {data.followers}</p>
          <p>📦 Public repos: {data.publicRepos}</p>
          <p>🔀 Pull Requests: {data.pullRequests}</p>
          <p>🟩 Total contributions: {data.totalContributions}</p>
          <p>📆 Activity days: {data.activityDays}</p>
          <p>🔥 Longest streak: {data.longestStreak} days</p>
          <p>❄️ Longest gap: {data.longestGap} days</p>

          <p>📌 Pinned repos:</p>
          <ul>
            {data.pinnedRepos.map((r: string) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
