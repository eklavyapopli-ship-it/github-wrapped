"use client";


import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  GitPullRequest,
  Flame,
  Snowflake,
  Calendar,
  Users,
  FolderGit2,
  BarChart,
  Activity,
} from "lucide-react";
import { Timeline } from "@/components/ui/timeline";


function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8 }}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
        />
      </div>
    </div>
  );
}


function BarGraph({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-md"
          title={`Month ${i + 1}: ${v} commits`}
        />
      ))}
    </div>
  );
}

export default function WrappedClient({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/github-wrapped?username=${username}`)
      .then((res) => res.json())
      .then(setData);
  }, [username]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-400">
        Loading analysis…
      </div>
    );
  }

  const timelineData = [
    {
      title: "Peak Month",
      content: <p className="text-neutral-400">Most active month: {data.mostActiveMonth + 1}</p>,
    },
    {
      title: "Consistency",
      content: <p className="text-neutral-400">Average {data.avgCommitsPerActiveDay.toFixed(1)} commits per active day</p>,
    },
    {
      title: "Focus",
      content: <p className="text-neutral-400">And Reached till {data.totalContributions} Total Contributions</p>,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      <div className="max-w-5xl mx-auto mb-12 flex items-center gap-6">
        <img src={data.avatarUrl} className="w-24 h-24 rounded-full border border-green-500" />
        <div>
          <h1 className="text-4xl font-bold">@{username}</h1>
          <p className="text-gray-400">GitHub Wrapped · Deep Analytics</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <Stat icon={FolderGit2} label="Public Repos" value={data.publicRepos} />
        <Stat icon={GitPullRequest} label="Pull Requests" value={data.pullRequests} />
        <Stat icon={Users} label="Followers" value={data.followers} />
        <Stat icon={Activity} label="Total Commits" value={data.totalContributions} />
        <Stat icon={Calendar} label="Active Days" value={data.activityDays} />
        <Stat icon={Flame} label="Longest Streak" value={`${data.longestStreak} days`} />
        <Stat icon={Snowflake} label="Longest Gap" value={`${data.longestGap} days`} />
        <Stat icon={BarChart} label="Avg / Day" value={data.avgCommitsPerActiveDay.toFixed(1)} />
      </div>


      <div className="max-w-5xl mx-auto mb-20">
        <ProgressBar label="Year Coverage" value={data.activityDays} max={365} />
        <ProgressBar label="PR Merge Rate" value={data.pullRequestsMerged} max={data.pullRequests || 1} />
        <ProgressBar label="Repo Focus" value={data.activeRepos} max={data.publicRepos || 1} />
      </div>
      <Timeline data={timelineData} />

      <div className="max-w-5xl mx-auto mb-24 md:mt-100 mt-25 border ">
        <h2 className="text-2xl font-bold mb-4">Monthly Commit Volume</h2>
        <BarGraph data={data.monthlyCommits} />
      </div>



    </main>
  );
}


function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-green-500 transition">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="text-green-400" />
        <span className="text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </motion.div>
  );
}
