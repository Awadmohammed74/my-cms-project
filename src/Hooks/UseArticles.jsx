import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const articlesCollection = collection(db, "articles");

    const unsubscribe = onSnapshot(
      articlesCollection,
      (snapshot) => {
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching articles: ", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { articles, loading };
}
