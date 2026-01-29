import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const query = `
query ($login: String!) {
  user(login: $login) {
    avatarUrl
    followers {
      totalCount
    }
    repositories(privacy: PUBLIC) {
      totalCount
    }
    pullRequests {
      totalCount
    }
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const json = await res.json();

  if (json.errors) {
    return NextResponse.json({ error: json.errors }, { status: 400 });
  }

  const user = json.data.user;
  const days =
    user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (w: any) => w.contributionDays
    );

  // 🧮 Calculations
  let longestStreak = 0;
  let currentStreak = 0;
  let longestGap = 0;
  let currentGap = 0;

  let activityDays = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      activityDays++;
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
      currentGap = 0;
    } else {
      currentGap++;
      longestGap = Math.max(longestGap, currentGap);
      currentStreak = 0;
    }
  }

  return NextResponse.json({
    username,
    avatarUrl: user.avatarUrl,
    followers: user.followers.totalCount,
    publicRepos: user.repositories.totalCount,
    pullRequests: user.pullRequests.totalCount,
    totalContributions:
      user.contributionsCollection.contributionCalendar.totalContributions,
    activityDays,
    longestStreak,
    longestGap,
    pinnedRepos: user.pinnedItems.nodes.map((r: any) => r.name),
  });
}
