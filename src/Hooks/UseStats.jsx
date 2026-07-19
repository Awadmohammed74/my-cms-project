import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const articlesRef = collection(db, "articles");

        // 1. حساب الإجمالي
        const totalSnap = await getCountFromServer(articlesRef);
        const total = totalSnap.data().count;

        // 2. حساب المنشور (Published)
        const publishedQuery = query(
          articlesRef,
          where("status", "==", "published"),
        );
        const publishedSnap = await getCountFromServer(publishedQuery);

        // 3. حساب المسودات (Draft)
        const draftQuery = query(articlesRef, where("status", "==", "draft"));
        const draftSnap = await getCountFromServer(draftQuery);

        setStats([
          {
            id: "total",
            title: "Total Articles",
            value: total,
            type: "total",
            change: total > 20 ? "High Activity" : "Stable System",
          },
          {
            id: "published",
            title: "Published",
            value: publishedSnap.data().count,
            type: "published",
            change: "Live Online",
          },
          {
            id: "draft",
            title: "Drafts",
            value: draftSnap.data().count,
            type: "draft",
            change: draftSnap.data().count > 0 ? "Needs Review" : "All Clear",
          },
        ]);
      } catch (error) {
        console.error("Error calculating stats: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
