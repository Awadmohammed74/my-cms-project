import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getCountFromServer,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

const AppContext = createContext();

const DEFAULT_CATEGORIES = ["Technology", "Finance", "Design"];

export function AppProvider({ children }) {
  // ========== Articles State ==========
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  // ========== Stats State ==========
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // ========== Categories State ==========
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ========== Global Search ==========
  const [searchQuery, setSearchQuery] = useState("");

  // ========== Fetch Articles (Real-time with orderBy) ==========
  useEffect(() => {
    const articlesCollection = collection(db, "articles");

    const unsubscribe = onSnapshot(
      articlesCollection,
      (snapshot) => {
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by createdAt descending client-side
        articlesData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        setArticles(articlesData);
        setArticlesLoading(false);
      },
      (error) => {
        console.error("Error fetching articles: ", error);
        setArticlesLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ========== Fetch Categories (Real-time) ==========
  useEffect(() => {
    const categoriesCollection = collection(db, "categories");

    const unsubscribe = onSnapshot(
      categoriesCollection,
      (snapshot) => {
        const cats = snapshot.docs.map((doc) => doc.data().name);
        // If no categories exist yet, seed defaults
        if (cats.length === 0) {
          // Seed will happen via the seed function called from settings
          setCategories([]);
        } else {
          setCategories(cats);
        }
        setCategoriesLoading(false);
      },
      (error) => {
        console.error("Error fetching categories: ", error);
        setCategoriesLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ========== Category CRUD ==========
  const addCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return false;
    try {
      await addDoc(collection(db, "categories"), { name: trimmed });
      return true;
    } catch (error) {
      console.error("Error adding category:", error);
      return false;
    }
  };

  const deleteCategory = async (name) => {
    try {
      const q = query(collection(db, "categories"), where("name", "==", name));
      const snapshot = await getDocs(q);

      // Wait for all deletions to complete
      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "categories", docSnap.id)),
      );
      await Promise.all(deletePromises);

      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  };

  const seedDefaultCategories = async () => {
    try {
      // Clear all existing categories first to avoid duplicates
      const snapshot = await getDocs(collection(db, "categories"));
      const deletePromises = snapshot.docs.map((d) =>
        deleteDoc(doc(db, "categories", d.id)),
      );
      await Promise.all(deletePromises);

      // Seed defaults - wait for each to complete
      const addPromises = DEFAULT_CATEGORIES.map((name) =>
        addDoc(collection(db, "categories"), { name }),
      );
      await Promise.all(addPromises);

      return true;
    } catch (error) {
      console.error("Error seeding categories:", error);
      return false;
    }
  };

  // ========== Fetch Stats ==========
  useEffect(() => {
    async function fetchStats() {
      try {
        const articlesRef = collection(db, "articles");

        const totalSnap = await getCountFromServer(articlesRef);
        const total = totalSnap.data().count;

        const publishedQuery = query(
          articlesRef,
          where("status", "==", "published"),
        );
        const publishedSnap = await getCountFromServer(publishedQuery);

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
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [articles]);

  return (
    <AppContext.Provider
      value={{
        articles,
        articlesLoading,
        stats,
        statsLoading,
        categories,
        categoriesLoading,
        addCategory,
        deleteCategory,
        seedDefaultCategories,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
