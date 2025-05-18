



function displayBookmarks() {
  const container = document.getElementById('bookmarksContainer');
  const bookmarks = safeGetBookmarks();
  
  container.innerHTML = '';
  bookmarks.forEach(bookmark => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bookmark.html;
    container.appendChild(tempDiv.firstElementChild);
  });

  if (bookmarks.length === 0) {
    container.innerHTML = '<p>No bookmarked jobs found</p>';
  }
}

// Add storage listener
window.addEventListener('storage', () => displayBookmarks());
document.addEventListener('DOMContentLoaded', displayBookmarks);

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on bookmarks page
  const isBookmarksPage = window.location.pathname.endsWith('bookmarks.html');
  
  if (isBookmarksPage) {
    displayBookmarks();
  } else {
    // Only run job search logic on non-bookmarks pages
    fetchAllJobsAndPopulateCards();
  }
});