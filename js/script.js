// Jio Institute - Main Script

// ========== 1. FOOTER ACCORDION (mobile) ==========
document.querySelectorAll('.footer-column-header').forEach(function (header) {
    header.addEventListener('click', function () {
        var clickedColumn = header.closest('.footer-column');
        var isOpen = clickedColumn.getAttribute('data-accordion') === 'open';
        document.querySelectorAll('.footer-column').forEach(function (col) {
            col.setAttribute('data-accordion', 'closed');
            var icon = col.querySelector('.accordion-icon');
            if (icon) icon.src = 'images/chevron-down-white.svg';
        });
        if (!isOpen) {
            clickedColumn.setAttribute('data-accordion', 'open');
            var icon = clickedColumn.querySelector('.accordion-icon');
            if (icon) icon.src = 'images/chevron-up-white.svg';
        }
    });
});

// ========== 2. MOBILE NAVIGATION MENU ==========

(function () {
    var menuIcon = document.querySelector('.menu-icon') || document.querySelector('.navbar-right img[alt="Menu"]');
    if (!menuIcon) return;

    // Gather nav links from whichever navbar structure exists
    var navLinks = document.querySelectorAll('.navbar-center a, .navbar-right a.desktop-only');
    var linksHTML = '';
    navLinks.forEach(function (link) {
        var text = link.textContent.trim();
        if (text) {
            linksHTML += '<a href="' + link.getAttribute('href') + '">' + text + '</a>';
        }
    });

    // Create mobile menu overlay
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    menu.innerHTML =
        '<div class="mobile-menu-header">' +
        '<a href="index.html"><img src="images/jio-logo-white.svg" alt="Jio Institute"></a>' +
        '<button class="mobile-menu-close"><img src="images/close-icon.svg" alt="Close" style="--stroke-0: #ffffff;"></button>' +
        '</div>' +
        '<div class="mobile-menu-links">' + linksHTML + '</div>' +
        '<div class="mobile-menu-footer">' +
        '<a href="#" class="mobile-menu-apply">Apply Now <img src="images/arrow-up-right-white.svg" alt=""></a>' +
        '</div>';

    document.body.appendChild(menu);

    function openMenu() {
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuIcon.style.cursor = 'pointer';
    menuIcon.addEventListener('click', openMenu);

    menu.querySelector('.mobile-menu-close').addEventListener('click', closeMenu);

    // Close on overlay background click
    menu.addEventListener('click', function (e) {
        if (e.target === menu) closeMenu();
    });

    // Escape key closes menu
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
})();

// ========== 3. SEARCH OVERLAY ==========

(function () {
    var overlay = document.getElementById('searchOverlay');
    if (!overlay) return;

    var closeBtn = document.getElementById('searchClose');
    var mobileCloseBtn = document.getElementById('searchMobileClose');
    var input = document.getElementById('searchInput');
    var clearBtn = document.getElementById('searchClear');
    var searchIcon = document.querySelector('.navbar-icons img[alt="Search"], .navbar-right img[alt="Search"]');

    function openOverlay() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (input) input.focus();
    }

    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (input) {
            input.value = '';
            updateClearButton();
        }
    }

    function updateClearButton() {
        if (!clearBtn) return;
        clearBtn.classList.toggle('visible', input && input.value.length > 0);
    }

    if (searchIcon) {
        searchIcon.style.cursor = 'pointer';
        searchIcon.addEventListener('click', openOverlay);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeOverlay);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });

    if (input) {
        input.addEventListener('input', updateClearButton);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && input.value.trim()) {
                window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (input) {
                input.value = '';
                updateClearButton();
                input.focus();
            }
        });
    }

    // Expose openOverlay for use by other modules
    window._openSearchOverlay = openOverlay;
})();

// ========== 4. SEARCH RESULTS PAGE + PAGINATION ==========

(function () {
    var queryText = document.getElementById('searchQueryText');
    var queryTextMobile = document.getElementById('searchQueryTextMobile');
    if (!queryText && !queryTextMobile) return;

    // Read query from URL
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (query) {
        if (queryText) queryText.textContent = query;
        if (queryTextMobile) queryTextMobile.textContent = query;
        document.title = query + ' - Search - Jio Institute';
    }

    // Clear buttons open overlay
    ['searchQueryClear', 'searchQueryClearMobile'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function () {
                if (window._openSearchOverlay) window._openSearchOverlay();
            });
        }
    });

    // Filter tabs (desktop)
    document.querySelectorAll('.search-filter-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.search-filter-tab').forEach(function (t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
        });
    });

    // Filter dropdown (mobile) — sync with tabs
    var filterSelect = document.getElementById('searchFilterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            var tabs = document.querySelectorAll('.search-filter-tab');
            tabs.forEach(function (t) { t.classList.remove('active'); });
            if (tabs[filterSelect.selectedIndex]) {
                tabs[filterSelect.selectedIndex].classList.add('active');
            }
        });
    }

    // Pagination
    var pageNums = document.querySelectorAll('.search-page-num');
    var prevArrow = document.querySelector('.search-page-arrow.prev');
    var nextArrow = document.querySelector('.search-page-arrow.next');

    function updatePaginationArrows() {
        var activeIdx = -1;
        pageNums.forEach(function (p, i) { if (p.classList.contains('active')) activeIdx = i; });
        if (prevArrow) prevArrow.classList.toggle('disabled', activeIdx <= 0);
        if (nextArrow) nextArrow.classList.toggle('disabled', activeIdx >= pageNums.length - 1);
    }

    pageNums.forEach(function (btn, idx) {
        btn.addEventListener('click', function () {
            pageNums.forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            updatePaginationArrows();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    if (prevArrow) {
        prevArrow.addEventListener('click', function () {
            if (prevArrow.classList.contains('disabled')) return;
            var activeIdx = -1;
            pageNums.forEach(function (p, i) { if (p.classList.contains('active')) activeIdx = i; });
            if (activeIdx > 0) {
                pageNums.forEach(function (p) { p.classList.remove('active'); });
                pageNums[activeIdx - 1].classList.add('active');
                updatePaginationArrows();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', function () {
            if (nextArrow.classList.contains('disabled')) return;
            var activeIdx = -1;
            pageNums.forEach(function (p, i) { if (p.classList.contains('active')) activeIdx = i; });
            if (activeIdx < pageNums.length - 1) {
                pageNums.forEach(function (p) { p.classList.remove('active'); });
                pageNums[activeIdx + 1].classList.add('active');
                updatePaginationArrows();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
})();

// ========== 5. ABOUT PAGE: SMOOTH SCROLL TABS ==========

(function () {
    var tabs = document.querySelectorAll('.tab-navigation .tab-item');
    if (!tabs.length) return;

    var navbar = document.querySelector('.navbar');
    var navHeight = navbar ? navbar.offsetHeight : 84;

    // Click to scroll
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = tab.getAttribute('href');
            var target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
            }
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
        });
    });

    // Scroll spy — update active tab based on scroll position
    var sections = [];
    tabs.forEach(function (tab) {
        var id = tab.getAttribute('href');
        var el = document.querySelector(id);
        if (el) sections.push({ el: el, tab: tab });
    });

    var scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            var scrollPos = window.scrollY + navHeight + 100;
            var current = sections[0];
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].el.offsetTop <= scrollPos) {
                    current = sections[i];
                }
            }
            if (current) {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                current.tab.classList.add('active');
                // Also update mobile dropdown label
                var dropdownLabel = document.querySelector('.tab-dropdown-label');
                if (dropdownLabel) dropdownLabel.textContent = current.tab.textContent;
            }
        }, 50);
    });
})();

// ========== 6. ABOUT PAGE: MOBILE TAB DROPDOWN ==========

(function () {
    var dropdown = document.querySelector('.tab-dropdown');
    if (!dropdown) return;

    var label = dropdown.querySelector('.tab-dropdown-label');
    var icon = dropdown.querySelector('.tab-dropdown-icon');
    var tabs = document.querySelectorAll('.tab-navigation .tab-item');

    // Create dropdown panel
    var panel = document.createElement('div');
    panel.className = 'tab-dropdown-panel';
    tabs.forEach(function (tab) {
        var link = document.createElement('a');
        link.href = tab.getAttribute('href');
        link.textContent = tab.textContent;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(link.getAttribute('href'));
            if (target) {
                var navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 80;
                window.scrollTo({ top: target.offsetTop - navHeight - 20, behavior: 'smooth' });
            }
            if (label) label.textContent = link.textContent;
            panel.classList.remove('active');
            icon.src = 'images/chevron-down.svg';
        });
        panel.appendChild(link);
    });
    dropdown.appendChild(panel);

    dropdown.addEventListener('click', function (e) {
        if (e.target.closest('.tab-dropdown-panel')) return;
        var isOpen = panel.classList.contains('active');
        panel.classList.toggle('active');
        icon.src = isOpen ? 'images/chevron-down.svg' : 'images/chevron-up.svg';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
            panel.classList.remove('active');
            icon.src = 'images/chevron-down.svg';
        }
    });
})();

// ========== 7. INDEX PAGE: NUMBERED LIST SWITCHING ==========

(function () {

    var nav = document.getElementById('commitment-nav');
    if (!nav) return;

    var items = Array.from(nav.querySelectorAll('.numbered-item'));
    var blocks = [
        document.getElementById('commitment-block-0'),
        document.getElementById('commitment-block-1'),
        document.getElementById('commitment-block-2')
    ];

    if (!items.length || !blocks[0]) return;

    var current = -1;

    function activate(idx) {
        if (idx === current) return;
        current = idx;

        // Update active class
        items.forEach(function (item) { item.classList.remove('active'); });
        if (items[idx]) items[idx].classList.add('active');

        // On block-1 (maroon), left panel text must be white
        // On block-0 and block-2 (light bg), use default CSS colors
        var onDark = (idx === 1);
        items.forEach(function (item) {
            var num = item.querySelector('.numbered-item-number');
            var text = item.querySelector('.numbered-item-text');
            var isActive = item.classList.contains('active');
            if (onDark) {
                num.style.color = isActive ? '#ffffff' : 'rgba(255,255,255,0.3)';
                text.style.color = isActive ? '#ffffff' : 'rgba(255,255,255,0.3)';
            } else {
                num.style.color = '';
                text.style.color = '';
            }
        });
    }

    activate(0);

    // Click → scroll to block
    items.forEach(function (item, idx) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
            var block = blocks[idx];
            if (!block) return;
            // idx 0 = pehla block, thoda upar
            // idx 1,2 = zyada scroll chahiye
            var extraScroll = idx === 0 ? 0 : 200;
            var top = block.getBoundingClientRect().top + window.pageYOffset - 100 + extraScroll;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    // Scroll spy
    window.addEventListener('scroll', function () {
        var mid = window.pageYOffset + window.innerHeight * 0.4;
        var best = 0;
        blocks.forEach(function (block, i) {
            if (!block) return;
            if (block.getBoundingClientRect().top + window.pageYOffset <= mid) best = i;
        });
        activate(best);
    });

})();

// ========== 8. HORIZONTAL SCROLL CAROUSELS ==========

(function () {
    // Generic function: finds a scroll container + prev/next arrows within a parent section
    function initCarousel(containerSelector, arrowParentSelector, itemSelector) {
        var container = document.querySelector(containerSelector);
        var arrowParent = document.querySelector(arrowParentSelector);
        if (!container || !arrowParent) return;

        var prevBtn = arrowParent.querySelector('.nav-arrow.prev, .plp-alumni-arrow.prev');
        var nextBtn = arrowParent.querySelector('.nav-arrow.active, .nav-arrow:not(.prev), .plp-alumni-arrow.active, .plp-alumni-arrow:not(.prev)');
        if (!prevBtn || !nextBtn) return;

        // Enable scroll behavior
        container.style.scrollBehavior = 'smooth';
        container.style.overflowX = 'auto';
        container.style.msOverflowStyle = 'none';
        container.style.scrollbarWidth = 'none';

        var items = container.querySelectorAll(itemSelector);
        if (!items.length) return;

        function getScrollAmount() {
            var item = items[0];
            return item.offsetWidth + parseInt(getComputedStyle(container).gap || '24');
        }

        function updateArrows() {
            var atStart = container.scrollLeft <= 5;
            var atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;
            prevBtn.classList.toggle('disabled', atStart);
            nextBtn.classList.toggle('disabled', atEnd);
            // Swap icon for disabled state
            var prevImg = prevBtn.querySelector('img');
            var nextImg = nextBtn.querySelector('img');
            if (prevImg) prevImg.src = atStart ? 'images/arrow-right-nav-disabled.svg' : 'images/arrow-right-nav.svg';
            if (nextImg) nextImg.src = atEnd ? 'images/arrow-right-nav-disabled.svg' : 'images/arrow-right-nav.svg';
        }

        prevBtn.addEventListener('click', function () {
            if (prevBtn.classList.contains('disabled')) return;
            container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', function () {
            if (nextBtn.classList.contains('disabled')) return;
            container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        container.addEventListener('scroll', updateArrows);
        updateArrows();

        // Recheck on resize
        window.addEventListener('resize', updateArrows);
    }

    // Faculty carousel (about.html) - Custom scaling slider logic
    (function initFacultyCarousel() {
        var container = document.querySelector('.faculty-carousel');
        var arrowParent = document.querySelector('.faculty-overview .nav-arrows');
        if (!container || !arrowParent) return;

        var prevBtn = arrowParent.querySelector('.nav-arrow.prev');
        var nextBtn = arrowParent.querySelector('.nav-arrow.active, .nav-arrow:not(.prev)');
        if (!prevBtn || !nextBtn) return;

        var items = Array.from(container.querySelectorAll('.faculty-card'));
        if (!items.length) return;

        var currentIndex = 0;
        items.forEach(function(item, idx) {
            if (item.classList.contains('center')) {
                currentIndex = idx;
            }
        });

        function updateSlider() {
            items.forEach(function (item, idx) {
                if (idx === currentIndex) {
                    item.classList.remove('side');
                    item.classList.add('center');
                } else {
                    item.classList.remove('center');
                    item.classList.add('side');
                }
            });

            var atStart = currentIndex === 0;
            var atEnd = currentIndex === items.length - 1;
            
            prevBtn.classList.toggle('disabled', atStart);
            nextBtn.classList.toggle('disabled', atEnd);
            
            var prevImg = prevBtn.querySelector('img');
            var nextImg = nextBtn.querySelector('img');
            if (prevImg) prevImg.src = atStart ? 'images/arrow-right-nav-disabled.svg' : 'images/arrow-right-nav.svg';
            if (nextImg) nextImg.src = atEnd ? 'images/arrow-right-nav-disabled.svg' : 'images/arrow-right-nav.svg';

            var isMobile = window.innerWidth <= 768;
            var gap = isMobile ? 16 : 48;
            var sideWidth = isMobile ? 280 : 630;
            var targetScroll = currentIndex * (sideWidth + gap);
            
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }

        prevBtn.addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', function () {
            if (currentIndex < items.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });
        
        // Initial setup
        var atStart = currentIndex === 0;
        var atEnd = currentIndex === items.length - 1;
        prevBtn.classList.toggle('disabled', atStart);
        nextBtn.classList.toggle('disabled', atEnd);

        // Snap to center instantly on load
        var isMobile = window.innerWidth <= 768;
        var gap = isMobile ? 16 : 48;
        var sideWidth = isMobile ? 280 : 630;
        container.scrollLeft = currentIndex * (sideWidth + gap);
    })();

    // News/blog cards carousel (about.html)
    initCarousel('.blog-cards', '.news-nav-arrows', '.blog-card');

    // Alumni carousel (programmes.html)
    initCarousel('.plp-alumni-cards', '.plp-alumni-nav', '.plp-alumni-card, .plp-alumni-video');
})();

// ==========  FACULTY MODAL LOGIC ==========

(function () {
    var cards = document.querySelectorAll('.faculty-card, .profile-card, .leader-quote-card');
    var backdrop = document.getElementById('modalBackdrop');
    var closeBtn = document.getElementById('modalClose');
    var modal = document.getElementById('modal');

    // Proceed only if the modal elements exist
    if (!backdrop || !closeBtn || !modal) return;

    // 1. Modal Open Behavior: On click of any card
    var openModal = function (e) {
        e.preventDefault();

        var targetCard = e.currentTarget;

        // Extract data to show in modal
        var nameEl = targetCard.querySelector('.name-row span, .name, .leader-author .name');
        var roleEl = targetCard.querySelector('.role, .title');
        var imgEl = targetCard.querySelector('img.faculty-bg, img.profile-bg, .leader-image img');

        // Update modal content with respective data
        if (nameEl) {
            var modalName = document.getElementById('modalName');
            if (modalName) modalName.textContent = nameEl.textContent;
        }

        if (roleEl) {
            var modalRole = document.getElementById('modalRole');
            if (modalRole) modalRole.textContent = roleEl.textContent;
        }

        if (imgEl) {
            var mslideImgs = modal.querySelectorAll('.mslide-img');
            if (mslideImgs.length > 0) {
                mslideImgs[0].src = imgEl.src;
            }
        }

        // Open Modal
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    cards.forEach(function (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', openModal);
    });

    // 2. Strict Modal Close Behavior
    var closeModal = function () {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
    };

    // Close ONLY when the close button is clicked
    closeBtn.addEventListener('click', closeModal);

    // Explicitly do NOT close the modal on outside click
    backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) {
            // Strict control: Do nothing.
        }
    });

    // Explicitly do NOT close on ESC key press
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && backdrop.classList.contains('open')) {
            // Strict control: Do nothing / prevent default.
            e.preventDefault();
        }
    });

    // --- Modal Inner Interactions (Tabs & Sliders) ---
    var tabs = modal.querySelectorAll('.tab-btn');
    var panels = modal.querySelectorAll('.tab-panel');

    if (tabs.length && panels.length) {
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                panels.forEach(function (p) { p.classList.remove('active'); });

                tab.classList.add('active');

                var targetId = 'tab-' + tab.getAttribute('data-tab');
                var targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    var dots = modal.querySelectorAll('.mslider-dot');
    var track = document.getElementById('msliderTrack');

    if (dots.length > 0 && track) {
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = parseInt(dot.getAttribute('data-mi'), 10);

                dots.forEach(function (d) { d.classList.remove('active'); });
                dot.classList.add('active');

                // Use the actual rendered width so it works on mobile (full-width) and desktop (355px)
                var imgWidth = track.querySelector('.mslide-img') ? track.querySelector('.mslide-img').offsetWidth : 355;
                track.style.transform = 'translateX(-' + (index * imgWidth) + 'px)';
            });
        });
    }

})();

// ========== 9. PRINCIPLES CAROUSEL (about.html) ==========

(function () {
    var container = document.querySelector('.principles-cards');
    if (!container) return;

    var cards = container.querySelectorAll('.principle-card');
    if (!cards.length) return;

    var section = container.closest('.principles-section');
    if (!section) return;

    var prevBtn = section.querySelector('.nav-arrow.prev');
    var nextBtn = section.querySelector('.nav-arrow:not(.prev)');
    if (!prevBtn || !nextBtn) return;

    var shift = 0;
    var maxShift = 436; // pixels to shift (reveals card-04)

    // Add transition to cards
    cards.forEach(function (card) {
        card.style.transition = 'transform 0.5s ease';
    });

    function updateArrows() {
        prevBtn.classList.toggle('disabled', shift <= 0);
        nextBtn.classList.toggle('disabled', shift >= maxShift);
        var prevImg = prevBtn.querySelector('img');
        var nextImg = nextBtn.querySelector('img');
        if (prevImg) prevImg.src = shift <= 0 ? 'images/arrow-right-nav-disabled.svg' : 'images/arrow-right-nav.svg';
        if (nextImg) nextImg.src = shift >= maxShift ? 'images/arrow-right-nav-disabled.svg' : 'images/arrow-right-nav.svg';
    }

    function applyShift() {
        cards.forEach(function (card) {
            card.style.transform = 'translateX(' + (-shift) + 'px)';
        });
        updateArrows();
    }

    nextBtn.addEventListener('click', function () {
        if (shift >= maxShift) return;
        shift = Math.min(shift + maxShift, maxShift);
        applyShift();
    });

    prevBtn.addEventListener('click', function () {
        if (shift <= 0) return;
        shift = Math.max(shift - maxShift, 0);
        applyShift();
    });

    updateArrows();
})();

// ========== 10. FACULTY CHIPS TAB SWITCHING (about.html) ==========

(function () {
    var chips = document.querySelectorAll('.faculty-tabs .chip');
    if (!chips.length) return;

    chips.forEach(function (chip) {
        chip.style.cursor = 'pointer';
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
        });
    });
})();

// ========== 11. PLP SIDEBAR FILTERS (programmes.html) ==========

(function () {
    // Filter section collapse/expand
    var filterHeaders = document.querySelectorAll('.plp-filter-header');
    filterHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var section = header.closest('.plp-filter-section');
            var options = section.querySelector('.plp-filter-options');
            var icon = header.querySelector('img');
            if (!options) return;

            var isOpen = options.style.display !== 'none';
            options.style.display = isOpen ? 'none' : 'flex';
            if (icon) icon.src = isOpen ? 'images/chevron-down.svg' : 'images/chevron-up.svg';
        });
    });

    // Checkbox toggle
    document.querySelectorAll('.plp-filter-option').forEach(function (option) {
        option.addEventListener('click', function () {
            var img = option.querySelector('img');
            if (!img) return;
            var isChecked = img.src.indexOf('checkbox-checked') !== -1;
            img.src = isChecked ? 'images/checkbox-unchecked.svg' : 'images/checkbox-checked.svg';
        });
    });

    // Mobile filter button — show filter overlay
    var filterBtn = document.querySelector('.plp-mobile-filter-btn');
    if (!filterBtn) return;

    var sidebar = document.querySelector('.plp-sidebar');
    if (!sidebar) return;

    // Create mobile filter overlay
    var overlay = document.createElement('div');
    overlay.className = 'plp-filter-overlay';
    overlay.innerHTML =
        '<div class="plp-filter-overlay-header">' +
        '<span class="plp-filter-overlay-title">Filters</span>' +
        '<button class="plp-filter-overlay-close"><img src="images/close-icon.svg" alt="Close"></button>' +
        '</div>' +
        '<div class="plp-filter-overlay-body"></div>' +
        '<div class="plp-filter-overlay-footer">' +
        '<button class="plp-filter-overlay-apply">Apply Filters</button>' +
        '</div>';

    // Clone sidebar content into overlay body
    var body = overlay.querySelector('.plp-filter-overlay-body');
    body.innerHTML = sidebar.innerHTML;

    // Setup checkbox toggle in overlay copy
    body.querySelectorAll('.plp-filter-option').forEach(function (option) {
        option.addEventListener('click', function () {
            var img = option.querySelector('img');
            if (!img) return;
            var isChecked = img.src.indexOf('checkbox-checked') !== -1;
            img.src = isChecked ? 'images/checkbox-unchecked.svg' : 'images/checkbox-checked.svg';
        });
    });

    // Setup filter collapse in overlay copy
    body.querySelectorAll('.plp-filter-header').forEach(function (header) {
        header.addEventListener('click', function () {
            var section = header.closest('.plp-filter-section');
            var options = section.querySelector('.plp-filter-options');
            var icon = header.querySelector('img');
            if (!options) return;
            var isOpen = options.style.display !== 'none';
            options.style.display = isOpen ? 'none' : 'flex';
            if (icon) icon.src = isOpen ? 'images/chevron-down.svg' : 'images/chevron-up.svg';
        });
    });

    document.body.appendChild(overlay);

    filterBtn.addEventListener('click', function () {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeFilterOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    overlay.querySelector('.plp-filter-overlay-close').addEventListener('click', closeFilterOverlay);
    overlay.querySelector('.plp-filter-overlay-apply').addEventListener('click', closeFilterOverlay);
})();

// ========== 12. PLP DROPDOWN TOGGLES (programmes.html) ==========

(function () {
    // Desktop filter dropdown
    var dropdown = document.querySelector('.plp-filter-dropdown');
    if (dropdown) {
        var options = ['Postgraduate', 'Undergraduate', 'Executive Education', 'Doctoral'];
        var panel = document.createElement('div');
        panel.className = 'plp-dropdown-panel';
        options.forEach(function (opt) {
            var item = document.createElement('div');
            item.className = 'plp-dropdown-item';
            item.textContent = opt;
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdown.childNodes[0].textContent = opt + ' ';
                panel.classList.remove('active');
            });
            panel.appendChild(item);
        });
        dropdown.style.position = 'relative';
        dropdown.appendChild(panel);

        dropdown.addEventListener('click', function () {
            panel.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) panel.classList.remove('active');
        });
    }

    // Mobile dropdown
    var mobileDropdown = document.querySelector('.plp-mobile-dropdown');
    if (mobileDropdown) {
        var options2 = ['Postgraduate', 'Undergraduate', 'Executive Education', 'Doctoral'];
        var panel2 = document.createElement('div');
        panel2.className = 'plp-dropdown-panel';
        options2.forEach(function (opt) {
            var item = document.createElement('div');
            item.className = 'plp-dropdown-item';
            item.textContent = opt;
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                mobileDropdown.querySelector('span').textContent = opt;
                panel2.classList.remove('active');
            });
            panel2.appendChild(item);
        });
        mobileDropdown.style.position = 'relative';
        mobileDropdown.appendChild(panel2);

        mobileDropdown.addEventListener('click', function () {
            panel2.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!mobileDropdown.contains(e.target)) panel2.classList.remove('active');
        });
    }
})();

// ========== 13. NEWSLETTER FORM VALIDATION ==========

(function () {
    document.querySelectorAll('.newsletter-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = form.querySelector('input[type="email"]');
            var email = input ? input.value.trim() : '';
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Remove existing message
            var existing = form.parentElement.querySelector('.newsletter-msg');
            if (existing) existing.remove();

            var msg = document.createElement('p');
            msg.className = 'newsletter-msg';

            if (!email) {
                msg.textContent = 'Please enter your email address.';
                msg.style.color = '#e30513';
            } else if (!regex.test(email)) {
                msg.textContent = 'Please enter a valid email address.';
                msg.style.color = '#e30513';
            } else {
                msg.textContent = 'Thank you for subscribing!';
                msg.style.color = '#4caf50';
                if (input) input.value = '';
            }

            msg.style.fontFamily = "'Inter', sans-serif";
            msg.style.fontSize = '13px';
            msg.style.marginTop = '8px';
            form.parentElement.appendChild(msg);

            // Auto-remove message after 4 seconds
            setTimeout(function () { msg.remove(); }, 4000);
        });
    });
})();

// ========== 14. PLAY BUTTONS ==========

(function () {
    document.querySelectorAll('.play-btn, .plp-alumni-play-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.style.transform = btn.style.transform === 'translate(-50%, -50%) scale(1.2)'
                ? 'translate(-50%, -50%) scale(1)'
                : 'translate(-50%, -50%) scale(1.2)';
            // Brief pulse animation
            btn.style.transition = 'transform 0.3s ease';
            setTimeout(function () {
                btn.style.transform = btn.classList.contains('plp-alumni-play-btn')
                    ? 'translate(-50%, -50%)'
                    : '';
            }, 300);
        });
    });
})();

// ========== 15. NAVBAR ACTIVE LINK HIGHLIGHT ==========

(function () {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.navbar-center a, .navbar-right a');
    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('nav-active');
        }
    });
})();

// ========== 16. PDP SECTION NAVIGATION ==========

(function () {
    var pdpNav = document.querySelector('.pdp-nav');
    if (!pdpNav) return;

    var mobileToggle = pdpNav.querySelector('.pdp-nav-mobile');
    var mobileLabel = pdpNav.querySelector('.pdp-nav-mobile-label');
    var navItems = pdpNav.querySelectorAll('.pdp-nav-item');

    // Mobile toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            pdpNav.classList.toggle('open');
        });
    }

    // Nav item clicks — smooth scroll + update active
    navItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            var href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    var offset = 160;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
                navItems.forEach(function (n) { n.classList.remove('active'); });
                item.classList.add('active');
                if (mobileLabel) mobileLabel.textContent = item.textContent;
                pdpNav.classList.remove('open');
            }
        });
    });

    // Scroll spy
    var sections = [];
    navItems.forEach(function (item) {
        var href = item.getAttribute('href');
        if (href && href.startsWith('#')) {
            var sec = document.querySelector(href);
            if (sec) sections.push({ el: sec, link: item });
        }
    });

    window.addEventListener('scroll', function () {
        var scrollPos = window.pageYOffset + 200;
        var current = null;
        sections.forEach(function (s) {
            if (s.el.offsetTop <= scrollPos) current = s;
        });
        if (current) {
            navItems.forEach(function (n) { n.classList.remove('active'); });
            current.link.classList.add('active');
            if (mobileLabel) mobileLabel.textContent = current.link.textContent;
        }
    });
})();

// ========== 17. PDP LIFE TABS ==========

(function () {
    var tabs = document.querySelectorAll('.pdp-life-tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
        });
    });
})();

// ========== 18. PDP CURRICULUM MODULES ==========

(function () {
    var modules = document.querySelectorAll('.pdp-module');
    if (!modules.length) return;

    modules.forEach(function (mod) {
        var header = mod.querySelector('.pdp-module-header');
        if (!header) return;
        header.addEventListener('click', function () {
            var wasExpanded = mod.classList.contains('expanded');
            modules.forEach(function (m) { m.classList.remove('expanded'); });
            if (!wasExpanded) mod.classList.add('expanded');
        });
    });

    // Curriculum sidebar categories
    var cats = document.querySelectorAll('.pdp-curriculum-cat');
    cats.forEach(function (cat) {
        cat.addEventListener('click', function () {
            cats.forEach(function (c) { c.classList.remove('active'); });
            cat.classList.add('active');
        });
    });

    // Mobile curriculum chips
    var chips = document.querySelectorAll('.pdp-curriculum-chips .pdp-chip');
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
        });
    });
})();

// ========== 19. PDP ADMISSIONS SIDEBAR + ACCORDION ==========

(function () {
    // Sidebar categories
    var cats = document.querySelectorAll('.pdp-admissions-cat');
    cats.forEach(function (cat) {
        cat.addEventListener('click', function () {
            cats.forEach(function (c) { c.classList.remove('active'); });
            cat.classList.add('active');
        });
    });

    // Mobile admissions chips
    var chips = document.querySelectorAll('.pdp-admissions-chips .pdp-chip');
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
        });
    });

    // Accordion items
    var items = document.querySelectorAll('.pdp-accordion-header');
    items.forEach(function (header) {
        header.addEventListener('click', function () {
            var item = header.closest('.pdp-accordion-item');
            var icon = header.querySelector('.pdp-accordion-icon');
            var isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.pdp-accordion-item').forEach(function (i) {
                i.classList.remove('open');
                var ic = i.querySelector('.pdp-accordion-icon');
                if (ic) ic.style.transform = '';
            });

            if (!isOpen) {
                item.classList.add('open');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
})();

// ========== 20. PDP CAPSTONE CHIPS ==========

(function () {
    var chips = document.querySelectorAll('.pdp-capstone-chips .pdp-chip');
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
        });
    });
})();

// ========== 21. PDP FACULTY CHIPS ==========

(function () {
    var chips = document.querySelectorAll('.pdp-faculty-chips .pdp-chip');
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
        });
    });
})();

// ========== 18. NEWS SWIPER INITIALIZATION (Mobile Only) ==========

(function () {
    if (typeof Swiper === 'undefined') return;

    // Target only the mobile slider
    var mobileSwiperEl = document.querySelector('.mobile-only-slider .news-swiper');
    if (!mobileSwiperEl) return;

    var newsSwiper = new Swiper(mobileSwiperEl, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        observer: true,
        observeParents: true,
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false,
        // },
        navigation: {
            nextEl: '.news-swiper-next',
            prevEl: '.news-swiper-prev',
        }
    });
})();

// ========== 17. ABOUT PAGE: CONTROLLED TIMELINE SLIDER (CLICK TRIGGERED) ==========

(function () {
    var section = document.querySelector('.our-story-section.slider-version');
    if (!section) return;

    var yearBox = section.querySelector('.slider-year-box');
    var slides = section.querySelectorAll('.slider-slide');
    var progressContainer = section.querySelector('.slider-progress-container');
    var progressBars = section.querySelectorAll('.slider-progress-bar .fill');
    var yearSuffix = section.querySelector('.year-suffix');

    var isRunning = false;

    // Start on click
    yearBox.addEventListener('click', function () {
        if (isRunning) return;
        isRunning = true;
        startIntroSequence();
    });

    function startIntroSequence() {
        // 1. Animate Year (last 2 digits)
        countUp(yearSuffix, 0, 26, 1200, function () {
            // 2. Fade out year box (no delay)
            yearBox.classList.add('fade-out');

            // 3. Start slides after fade animation
            setTimeout(function () {
                yearBox.style.display = 'none'; // Remove from flow
                progressContainer.classList.add('active'); // Show progress bars
                runStep(0);
            }, 800); // Matches CSS transition duration
        });
    }



    function runStep(index) {
        if (index >= slides.length) return;

        var slide = slides[index];

        // Show Slide
        if (index > 0) {
            slides[index - 1].classList.remove('active');
            slides[index - 1].classList.add('previous');
        }
        slide.classList.add('active');

        // Animate Progress Bar
        var bar = progressBars[index];
        setTimeout(function () {
            animateProgressBar(bar, 3000, function () {
                // Next Step
                runStep(index + 1);
            });
        }, 500);
    }

    function countUp(el, start, end, duration, callback) {
        var startTime = null;
        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var current = Math.floor(progress * (end - start) + start);
            el.textContent = current.toString().padStart(2, '0');
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        }
        requestAnimationFrame(animate);
    }

    function animateProgressBar(el, duration, callback) {
        var startTime = null;
        var parent = el.parentElement;
        var isVertical = parent.offsetHeight > parent.offsetWidth;

        function animate(currentTime) {

            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var percentage = (progress * 100) + '%';

            if (isVertical) {
                el.style.height = percentage;
                el.style.width = '100%';
            } else {
                el.style.width = percentage;
                el.style.height = '100%';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        }
        requestAnimationFrame(animate);
    }

})();