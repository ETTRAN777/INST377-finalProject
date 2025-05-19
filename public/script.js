document.addEventListener('DOMContentLoaded', () => {
  const accountIcon = document.querySelector('.account');
  const dropdown = document.querySelector('.dropdown');
  const bigView = document.querySelector('.bigView');
  bigView.style.display = 'none'; // Hide big view initially

  const mainSearch = document.getElementById('mainSearch');
  const positionDropdown = document.getElementById("position");
  const locationDropdown = document.getElementById("location");

  // Card click logic for static cards (if any)
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function (event) {
      if (event.target.classList.contains('bookmark')) return;
      const allCards = document.querySelectorAll('.card');
      if (this.classList.contains('cardSelected')) {
        this.classList.remove('cardSelected');
        this.classList.add('card');
        if (bigView) bigView.style.display = 'none';
      } else {
        allCards.forEach(c => c.classList.remove('cardSelected'));
        this.classList.add('cardSelected');
        if (bigView) bigView.style.display = 'block';
      }
    });
  });

  // Account dropdown logic
  if (window.location.pathname.endsWith('jobSearch.html')) {
    accountIcon?.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (event) => {
      if (dropdown.style.display === 'block' && !dropdown.contains(event.target) && !accountIcon.contains(event.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  // Main search bar Enter triggers fetch
  mainSearch?.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchAllJobsAndPopulateCards();
    }
  });
  // Initial fetch
  fetchAllJobsAndPopulateCards();
});

function bookmark() {
  const bookmarkElement = this;
  const currentSrc = bookmarkElement.src;
  bookmarkElement.src = currentSrc.includes('bookmarkEmpty.png') ? 'bookmarkFull.png' : 'bookmarkEmpty.png';
}

function populateDropdown(dropdown, items, defaultText) {
  if (!dropdown) return; // Add null check
  dropdown.innerHTML = '';
  const defaultOption = document.createElement("option");
  defaultOption.disabled = false;
  defaultOption.selected = true;
  defaultOption.value = null;
  defaultOption.textContent = defaultText;
  dropdown.appendChild(defaultOption);

  items.sort((a, b) => a[1].localeCompare(b[1]));

  items.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.textContent = label;
    option.value = value;
    dropdown.appendChild(option);
  });
}

function updateBigView(aboutValue, descriptionValue, salaryValue, datePostedValue, applyButtonValue) {
  const about = document.getElementById("aboutValue");
  const description = document.getElementById("descriptionValue");
  const salary = document.getElementById("salaryValue");
  const datePosted = document.getElementById("datePostedValue");
  const applyButton = document.getElementById("applyButtonValue");

  if (about) about.innerText = aboutValue;
  if (description) description.innerText = descriptionValue;

  // Format salary as currency if it's a number or a range
  if (typeof salaryValue === 'string' && salaryValue.includes('-')) {
    const [min, max] = salaryValue.replace(/\$/g, '').split('-').map(s => s.trim());
    const formattedMin = !isNaN(min) && min ? Number(min).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : min;
    const formattedMax = !isNaN(max) && max ? Number(max).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : max;
    if (salary) salary.innerText = ` ${formattedMin} - ${formattedMax}`;
  } else if (
    (!isNaN(salaryValue) && salaryValue) ||
    (typeof salaryValue === 'string' && /^\$?\d+(\.\d+)?$/.test(salaryValue.trim()))
  ) {
    const num = Number(salaryValue.toString().replace(/\$/g, ''));
    if (salary) salary.innerText = " " + num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  } else {
    if (salary) salary.innerText = " " + salaryValue;
  }

  let formattedDate = datePostedValue;
  if (datePostedValue && typeof datePostedValue === 'string' && datePostedValue.includes('T')) {
    const dateObj = new Date(datePostedValue);
    if (!isNaN(dateObj)) {
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const year = dateObj.getFullYear();
      formattedDate = `${month}/${day}/${year}`;
    }
  }
  if (datePosted) datePosted.innerText = " " + formattedDate;
  if (applyButton) applyButton.action = applyButtonValue;
}

function createJobCard(job) {
  const template = document.getElementById('jobCardTemplate');
  if (!template) return;
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector('.card');
  
  // Set card metadata
  card.dataset.jobId = job.id;
  card.dataset.description = job.description || 'No description provided.';
  card.dataset.salary = job.salary_min || job.salary_max ? `${job.salary_min}-${job.salary_max}` : 'N/A';
  card.dataset.date = job.created || 'N/A';
  card.dataset.url = job.redirect_url || '#';

  // Populate basic info
  clone.querySelector('.jobPositionValue').textContent = job.title || '';
  clone.querySelector('.companyValue').textContent = job.company?.display_name || '';
  clone.querySelector('.locationValue').textContent = job.location?.area?.[1] || '';
  clone.querySelector('.applyForm').action = job.redirect_url || '#';

  // Bookmark button setup
  const bookmarkBtn = clone.querySelector('.bookmark');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', saveBookmark);
    // Use safeGetBookmarks instead of JSON.parse
    const bookmarks = safeGetBookmarks();
    bookmarkBtn.src = bookmarks.some(b => b.id === job.id) ? 'bookmarkFull.png' : 'bookmarkEmpty.png';
  }


  // Card click handler
  card.addEventListener('click', function(event) {
    if (event.target.classList.contains('bookmark')) return;
    let salaryText = '';
    if (job.salary_min && job.salary_max && job.salary_min === job.salary_max) {
      salaryText = `$${job.salary_min}`;
    } else {
      salaryText = `$${job.salary_min || 'N/A'} - $${job.salary_max || 'N/A'}`;
    }
    updateBigView(
      job.company?.display_name || 'N/A',
      job.description || 'No description provided.',
      salaryText,
      job.created || 'N/A',
      job.redirect_url || '#'
    );

    // Toggle selection
    const allCards = document.querySelectorAll('.card');
    const bigView = document.querySelector('.bigView');
    if (this.classList.contains('cardSelected')) {
      this.classList.remove('cardSelected');
      if (bigView) bigView.style.display = 'none';
    } else {
      allCards.forEach(c => c.classList.remove('cardSelected'));
      this.classList.add('cardSelected');
      if (bigView) bigView.style.display = 'block';
    }
  });

  const cardContainer = document.querySelector('.cardContainer');
  if (cardContainer) cardContainer.appendChild(clone);
}

function populateJobCards(jobs) {
  const cardContainer = document.querySelector('.cardContainer');
  if (!cardContainer) return;
  cardContainer.innerHTML = '';
  jobs.forEach(job => createJobCard(job));
  initializeBookmarks(); // Initialize after populating
}

async function fetchAllJobsAndPopulateCards() {
  if (window.location.pathname.endsWith('bookmarks.html')) return;
  const appId = '583d7467';
  const appKey = 'a3731e89eb3d38f871e53fbe22a4d724';
  const baseUrl = 'https://api.adzuna.com/v1/api/jobs/us/search/';
  const category = 'it-jobs';
  const resultsPerPage = 50;
  let page = 1;
  let allJobs = [];
  let hasMore = true;
  const maxPages = 5; // Safety limit (fetch up to 500 jobs)

  // Get filter values
  const position = document.getElementById("position")?.value;
  const location = document.getElementById("location")?.value;
  const date = document.getElementById("date")?.value;
  const salary = document.getElementById("salary")?.value;
  const mainSearchValue = document.getElementById("mainSearch")?.value;

  // Build query string for filters
  let filterQuery = `&category=${category}`;
  if (mainSearchValue && mainSearchValue.trim() !== "") {
    filterQuery += `&what=${encodeURIComponent(mainSearchValue)}`;
  } else if (position && position !== "null") {
    filterQuery += `&what=${encodeURIComponent(position)}`;
  }
  if (location && location !== "null") {
    filterQuery += `&where=${encodeURIComponent(location)}`;
  }
  if (salary && salary !== "null") {
    if (salary.includes('_')) {
      const [min, max] = salary.split('_');
      filterQuery += `&salary_min=${encodeURIComponent(min)}`;
      if (max && max !== "plus") {
        filterQuery += `&salary_max=${encodeURIComponent(max)}`;
      }
    } else {
      filterQuery += `&salary_min=${encodeURIComponent(salary)}`;
    }
  }
  if (date && date !== "null") {
    const dateMap = {
      last_7_days: 7,
      last_30_days: 30,
      last_3_months: 90,
      last_6_months: 180,
      last_year: 365,
      last_2_years: 730,
      last_5_years: 1825,
      last_decade: 3650,
      since_2000: 9000,
      all_time: null
    };
    const maxDays = dateMap[date];
    if (maxDays) {
      filterQuery += `&max_days_old=${maxDays}`;
    }
  }

  // Pagination loop
  while (hasMore && page <= maxPages) {
    let url = `${baseUrl}${page}?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}${filterQuery}`;
    console.log(`Fetching page ${page}: ${url}`);
    const res = await fetch(url);
    console.log(`Page ${page} fetch status: ${res.status}`);
    if (!res.ok) break;
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      allJobs = allJobs.concat(data.results);
      page++;
      if (data.results.length < resultsPerPage) hasMore = false;
    } else {
      hasMore = false;
    }
  }
  console.log(`Total jobs fetched: ${allJobs.length}`);
  if (allJobs.length > 0) {
    console.log('Sample job object:', allJobs[0]);
  }

  populateJobCards(allJobs);

  // Populate dropdowns using sets for uniqueness
  const positionDropdown = document.getElementById("position");
  const locationDropdown = document.getElementById("location");

  if (!positionDropdown || !locationDropdown) {
    console.warn("Dropdowns with IDs 'position' and/or 'location' not found in the DOM when attempting to populate them.");
    return;
  }

  // Only run dropdown logic if both dropdowns exist
  const jobSet = new Set();
  const jobs = [];
  const citySet = new Set();
  const cities = [];
  allJobs.forEach(job => {
    if (job.title && !jobSet.has(job.title)) {
      jobs.push([job.title, job.title]);
      jobSet.add(job.title);
    }
    const city = job.location?.area?.[1];
    if (city && !citySet.has(city)) {
      cities.push([city, city]);
      citySet.add(city);
    }
  });
  jobs.sort((a, b) => a[1].localeCompare(b[1]));
  cities.sort((a, b) => a[1].localeCompare(b[1]));
  populateDropdown(positionDropdown, jobs, "Position:");
  populateDropdown(locationDropdown, cities, "Location:");
}

function updateFilters() {
  if (!window.location.pathname.endsWith('bookmarks.html')) {
    fetchAllJobsAndPopulateCards();
  }
}

// Separate function for search handling
function handleSearch(event) {
  if (event.key === "Enter" && !window.location.pathname.endsWith('bookmarks.html')) {
    event.preventDefault();
    fetchAllJobsAndPopulateCards();
  }
}

function saveBookmark(event) {
  event.stopPropagation();
  const bookmarkElement = this;
  const isBookmarked = bookmarkElement.src.includes('bookmarkEmpty.png');
  bookmarkElement.src = isBookmarked ? 'bookmarkFull.png' : 'bookmarkEmpty.png';

  const card = this.closest('.card');
  const jobId = card.dataset.jobId;
  let bookmarks = safeGetBookmarks();

  if (isBookmarked) {
    const cardClone = card.cloneNode(true);
    cardClone.querySelector('.bookmark').remove();
    bookmarks.push({
      id: jobId,
      html: cardClone.outerHTML
    });

    // Save to DB if logged in
    const uuid = localStorage.getItem('jobJunctionUUID');
    if (uuid) {
      fetch('/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, jobId, html: cardClone.outerHTML })
      });
    }
  } else {
    bookmarks = bookmarks.filter(b => b.id !== jobId);

    // Remove from DB if logged in
    const uuid = localStorage.getItem('jobJunctionUUID');
    if (uuid) {
      fetch('/bookmark', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, jobId })
      });
    }
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  const updateEvent = new Event('storage');
  window.dispatchEvent(updateEvent);
}



function safeGetBookmarks() {
  try {
    const raw = localStorage.getItem('bookmarks');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    localStorage.setItem('bookmarks', '[]');
    return [];
  }
}

function initializeBookmarks() {
  const bookmarks = safeGetBookmarks();
  document.querySelectorAll('.card').forEach(card => {
    const bookmarkBtn = card.querySelector('.bookmark');
    if (bookmarkBtn) {
      const jobId = card.dataset.jobId;
      const isBookmarked = bookmarks.some(b => b.id === jobId);
      bookmarkBtn.src = isBookmarked ? 'bookmarkFull.png' : 'bookmarkEmpty.png';
    }
  });
}

function logout(event) {
    event.preventDefault();
   localStorage.removeItem('jobJunctionUser');
}
