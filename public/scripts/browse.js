// browse.js - Vehicle browse page functionality

document.addEventListener('DOMContentLoaded', () => {
  // Initialize search and filter functionality
  initializeSearchAndFilters();
  
  // Initialize vehicle actions
  initializeVehicleActions();
});

function initializeSearchAndFilters() {
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  const typeFilter = document.querySelector('.filter-select[data-filter="type"]');
  const priceFilter = document.querySelector('.filter-select[data-filter="price"]');
  const sortFilter = document.querySelector('.filter-select[data-filter="sort"]');
  
  // Search input event listener
  if (searchInput) {
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  // Search button event listener
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  // Filter change event listeners
  if (typeFilter) {
    typeFilter.addEventListener('change', performSearch);
  }
  
  if (priceFilter) {
    priceFilter.addEventListener('change', performSearch);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', performSearch);
  }
}

function initializeVehicleActions() {
  // Quick view functionality
  window.quickView = function(vehicleId) {
    // For now, redirect to browse page - can be enhanced with modal later
    window.location.href = `/rentals/browse?highlight=${vehicleId}`;
  };

  // Toggle favorite functionality
  window.toggleFavorite = function(vehicleId) {
    const btn = event.target.closest('.favorite-btn');
    if (btn) {
      btn.classList.toggle('favorited');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('favorited')) {
        icon.className = 'fas fa-heart';
        icon.style.color = '#ef4444';
      } else {
        icon.className = 'fas fa-heart';
        icon.style.color = '#374151';
      }
    }
  };

  // Show vehicle details functionality
  window.showVehicleDetails = function(vehicleId) {
    // For now, redirect to browse page - can be enhanced with modal later
    window.location.href = `/rentals/browse?details=${vehicleId}`;
  };
}

async function performSearch() {
  try {
    // Show loading state
    showLoadingState(true);
    
    // Get search parameters
    const searchParams = getSearchParameters();
    
    // Make API call
    const response = await fetch(`/vehicles/search?${new URLSearchParams(searchParams)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update the vehicle grid
    updateVehicleGrid(data.vehicles);
    
    // Update results count
    updateResultsCount(data.count);
    
    // Update load more button
    updateLoadMoreButton(data.count);
    
  } catch (error) {
    console.error('Search error:', error);
    showErrorMessage('An error occurred while searching. Please try again.');
  } finally {
    showLoadingState(false);
  }
}

function getSearchParameters() {
  const searchInput = document.querySelector('.search-input');
  const typeFilter = document.querySelector('.filter-select[data-filter="type"]');
  const priceFilter = document.querySelector('.filter-select[data-filter="price"]');
  const sortFilter = document.querySelector('.filter-select[data-filter="sort"]');
  
  const params = {};
  
  if (searchInput && searchInput.value.trim()) {
    params.query = searchInput.value.trim();
  }
  
  if (typeFilter && typeFilter.value) {
    params.type = typeFilter.value;
  }
  
  if (priceFilter && priceFilter.value) {
    params.priceRange = priceFilter.value;
  }
  
  if (sortFilter && sortFilter.value) {
    params.sortBy = sortFilter.value;
  }
  
  return params;
}

function updateVehicleGrid(vehicles) {
  const vehiclesGrid = document.getElementById('vehiclesGrid');
  
  if (!vehiclesGrid) return;
  
  if (vehicles.length === 0) {
    vehiclesGrid.innerHTML = `
      <div class="no-vehicles">
        <div class="no-vehicles-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>No vehicles found</h3>
        <p>Try adjusting your search criteria or filters.</p>
        <button class="clear-filters-btn" onclick="clearAllFilters()">Clear All Filters</button>
      </div>
    `;
    return;
  }
  
  vehiclesGrid.innerHTML = vehicles.map(vehicle => `
    <div class="vehicle-card">
      <div class="vehicle-image-container">
        <img src="${vehicle.imageUrl}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
        <div class="vehicle-overlay">
          <div class="vehicle-actions">
            <button class="quick-view-btn" onclick="quickView('${vehicle._id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="favorite-btn" onclick="toggleFavorite('${vehicle._id}')">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="vehicle-badges">
          ${vehicle.type === 'luxury' ? '<span class="badge luxury">Luxury</span>' : ''}
          ${vehicle.type === 'sports' ? '<span class="badge sports">Sports</span>' : ''}
          <span class="badge available">Available</span>
        </div>
      </div>
      
      <div class="vehicle-details">
        <div class="vehicle-header">
          <h3 class="vehicle-title">${vehicle.make} ${vehicle.model}</h3>
          <div class="vehicle-rating">
            <i class="fas fa-star"></i>
            <span>4.8</span>
          </div>
        </div>
        
        <div class="vehicle-specs">
          <div class="spec-item">
            <i class="fas fa-calendar"></i>
            <span>${vehicle.year}</span>
          </div>
          <div class="spec-item">
            <i class="fas fa-gas-pump"></i>
            <span>${vehicle.mpg} MPG</span>
          </div>
          <div class="spec-item">
            <i class="fas fa-users"></i>
            <span>${vehicle.seats} Seats</span>
          </div>
        </div>
        
        <div class="vehicle-features">
          <span class="feature-tag">Automatic</span>
          <span class="feature-tag">AC</span>
          <span class="feature-tag">Bluetooth</span>
        </div>
        
        <div class="vehicle-pricing">
          <div class="price-info">
            <span class="price-amount">$${vehicle.pricePerDay}</span>
            <span class="price-period">/day</span>
          </div>
          <div class="price-details">
            <span class="deposit-info">$200 deposit</span>
          </div>
        </div>
        
        <div class="vehicle-actions-bottom">
          <button class="reserve-btn" onclick="window.location.href='/rentals/payment?vehicleId=${vehicle._id}'">
            <i class="fas fa-calendar-check"></i>
            Reserve Now
          </button>
          <button class="details-btn" onclick="showVehicleDetails('${vehicle._id}')">
            <i class="fas fa-info-circle"></i>
            Details
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateResultsCount(count) {
  const resultsCount = document.querySelector('.results-count');
  if (resultsCount) {
    resultsCount.textContent = `${count} vehicles available`;
  }
}

function updateLoadMoreButton(count) {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    if (count <= 12) { // Assuming 12 vehicles per page
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i> All vehicles loaded';
    } else {
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More';
    }
  }
}

function showLoadingState(show) {
  const vehiclesGrid = document.getElementById('vehiclesGrid');
  const searchBtn = document.querySelector('.search-btn');
  
  if (show) {
    if (vehiclesGrid) {
      vehiclesGrid.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <p>Searching vehicles...</p>
        </div>
      `;
    }
    if (searchBtn) {
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    }
  } else {
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.innerHTML = 'Search';
    }
  }
}

function showErrorMessage(message) {
  const vehiclesGrid = document.getElementById('vehiclesGrid');
  if (vehiclesGrid) {
    vehiclesGrid.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Search Error</h3>
        <p>${message}</p>
        <button class="retry-btn" onclick="performSearch()">Try Again</button>
      </div>
    `;
  }
}

function clearAllFilters() {
  const searchInput = document.querySelector('.search-input');
  const typeFilter = document.querySelector('.filter-select[data-filter="type"]');
  const priceFilter = document.querySelector('.filter-select[data-filter="price"]');
  const sortFilter = document.querySelector('.filter-select[data-filter="sort"]');
  
  if (searchInput) searchInput.value = '';
  if (typeFilter) typeFilter.value = '';
  if (priceFilter) priceFilter.value = '';
  if (sortFilter) sortFilter.value = 'featured';
  
  performSearch();
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
