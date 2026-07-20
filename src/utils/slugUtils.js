// Utility function to get the link identifier (slug or id) for an article
export const getArticleLink = (article) => {
  return article?.seo?.slug || article?.id;
};

// Utility function to create the view link for an article
export const getViewLink = (article) => {
  return `/articles/view/${getArticleLink(article)}`;
};

// Utility function to create the edit link for an article
export const getEditLink = (article) => {
  return `/articles/edit-article/${article?.id}`; // Keep using id for editing since it's internal
};
