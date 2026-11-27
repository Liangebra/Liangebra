// Fetch aggregate public GitHub profile data for README Templates' Singularity art.
// No token is saved in the output. Run only with the repository-scoped Actions token.
import { writeFileSync } from 'node:fs';
const query = `query($login: String!) {
  user(login: $login) {
    login createdAt followers { totalCount }
    contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes { stargazerCount languages(first: 10, orderBy: {field: SIZE, direction: DESC}) { edges { size node { name color } } } }
    }
  }
}`;
const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { login: 'Liangebra' } }),
});
const data = await response.json();
if (!response.ok || data.errors || !data.data?.user) throw Error(JSON.stringify(data.errors || { status: response.status }));
const u = data.data.user;
const cal = u.contributionsCollection.contributionCalendar;
const langs = new Map();
for (const repo of u.repositories.nodes) for (const edge of repo.languages.edges) {
  const item = langs.get(edge.node.name) || { name: edge.node.name, color: edge.node.color, bytes: 0 };
  item.bytes += edge.size;
  langs.set(item.name, item);
}
const totalBytes = [...langs.values()].reduce((sum, v) => sum + v.bytes, 0);
const profile = {
  login: u.login, name: u.login, headline: 'Mathematics / Lean',
  joinedYear: Number(u.createdAt.slice(0, 4)), followers: u.followers.totalCount,
  totalStars: u.repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0),
  contributions: { total: cal.totalContributions, days: cal.weeks.flatMap(w => w.contributionDays.map(d => ({date: d.date, count: d.contributionCount}))) },
  languages: [...langs.values()].sort((a,b) => b.bytes-a.bytes).map(v => ({...v, share: totalBytes ? v.bytes/totalBytes : 0})),
};
writeFileSync(process.argv[2], JSON.stringify(profile));
