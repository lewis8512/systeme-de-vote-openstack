import { config } from "../config";

export async function hasVoted(): Promise<{ hasVoted: boolean; votedAt: string | null }> {
  const token = localStorage.getItem("token");
  if (!token) return { hasVoted: false, votedAt: null };

  try {
    const res = await fetch(`${config.apiUrl}/vote/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
        credentials: "include",
    });

    if (!res.ok) return { hasVoted: false, votedAt: null };

    const data = await res.json();
    return {
      hasVoted: data.hasVoted,
      votedAt: data.votedAt ?? null,
    };
  } catch (error) {
    console.error("Erreur dans hasVoted():", error);
    return { hasVoted: false, votedAt: null };
  }
}  