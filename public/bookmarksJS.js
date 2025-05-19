async function displayBookmarks() {
  const container = document.getElementById('bookmarksContainer');
  let localBookmarks = safeGetBookmarks();
  let dbBookmarks = [];
  const uuid = localStorage.getItem('jobJunctionUUID');

  if (uuid) {
    try {
      const res = await fetch(`/bookmarks?uuid=${encodeURIComponent(uuid)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        dbBookmarks = data.map(b => ({ id: b.jobId, html: b.html }));
      }
    } catch (e) {
      dbBookmarks = [];
    }
  }

  // Merge bookmarks, preferring DB over localStorage for duplicates
  const bookmarkMap = new Map();
  [...localBookmarks, ...dbBookmarks].forEach(b => {
    if (!bookmarkMap.has(b.id)) {
      bookmarkMap.set(b.id, b);
    }
  });

  container.innerHTML = '';
  if (bookmarkMap.size === 0) {
    container.innerHTML = '<p>No bookmarked jobs found</p>';
    return;
  }
  bookmarkMap.forEach(bookmark => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bookmark.html;
    container.appendChild(tempDiv.firstElementChild);
  });
}

// Add storage listener
window.addEventListener('storage', () => displayBookmarks());
document.addEventListener('DOMContentLoaded', displayBookmarks);

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on bookmarks page
  const isBookmarksPage = window.location.pathname.endsWith('bookmarks.html');

  if (isBookmarksPage) {
    // If user is logged in, fetch UUID
    const user = JSON.parse(localStorage.getItem('jobJunctionUser') || 'null');
    if (user && user.username && user.password) {
      fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user && data.user.uuid) {
            localStorage.setItem('jobJunctionUUID', data.user.uuid);
            console.log('User UUID:', data.user.uuid);
          } else {
            localStorage.removeItem('jobJunctionUUID');
          }
        })
        .catch(() => localStorage.removeItem('jobJunctionUUID'));
    } else {
      localStorage.removeItem('jobJunctionUUID');
      console.log("Not logged in");
    }
    // Display bookmarks for all users (login optional)
    displayBookmarks();
  } else {
    // Only run job search logic on non-bookmarks pages
    fetchAllJobsAndPopulateCards();
  }
});