export const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2419200) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 29030400) return `${Math.floor(seconds / 2419200)}m ago`;

  return `${Math.floor(seconds / 29030400)}y ago`;
};
