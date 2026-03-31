(function () {
    function getBridge() {
        return window.webNewAppBridge || {};
    }

    var homeBannerSlides = (window.HOME_BANNER_SLIDES || [
        {
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80",
            badge: "Trường An Store",
            title: "Thế giới niềm vui bé",
            subtitle: "Khơi dậy tiềm năng với hàng ngàn đồ chơi giáo dục an toàn.",
            support: "Đồ chơi • Mẹ bé • Giá sỉ rõ ràng"
        },
        {
            image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=1600&q=80",
            badge: "Góc đồ chơi",
            title: "Đồ chơi sáng tạo cho bé mỗi ngày",
            subtitle: "Danh mục rõ ràng theo nhóm hàng và tag để khách tìm nhanh hơn.",
            support: "Lọc nhanh • Xem đẹp trên mobile và desktop"
        },
        {
            image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1600&q=80",
            badge: "Mẹ và bé",
            title: "Sơ sinh, sữa bỉm và đồ dùng tiện chăm bé",
            subtitle: "Gợi ý hàng bán nhanh, dễ chốt đơn và dễ tạo giỏ hàng lớn.",
            support: "Giá tốt • Đồng bộ đơn hàng • Chăm sóc nhanh"
        }
    ]).map(function (slide) {
        return Object.assign({}, slide || {});
    });

    var homeHighlightCards = window.HOME_HIGHLIGHT_CARDS || [
        {
            image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
            label: "Đồ sơ sinh",
            accentClass: "text-blue-600",
            iconSvg: "<svg class='w-5 h-5 soft-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='M12 2v20'></path><path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'></path></svg>",
            action: "goToTab('tab-products')"
        },
        {
            image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&w=1200&q=80",
            label: "Đồ chơi mộc",
            accentClass: "text-violet-600",
            iconSvg: "<svg class='w-5 h-5 soft-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'></path><path d='M3 3v5h5'></path></svg>",
            action: "goToTab('tab-products')"
        }
    ];

    function updateHomeBannerContent() {
        var bridge = getBridge();
        var track = document.getElementById("home-banner-track");
        var dots = document.getElementById("home-banner-dots");
        var bannerIndex = bridge.getHomeBannerIndex ? bridge.getHomeBannerIndex() : 0;
        if (!track) return;

        track.style.transform = "translateX(-" + (bannerIndex * 100) + "%)";
        if (!dots) return;

        dots.querySelectorAll("button").forEach(function (dot, index) {
            dot.classList.toggle("bg-babyPink", index === bannerIndex);
            dot.classList.toggle("scale-110", index === bannerIndex);
            dot.classList.toggle("bg-white/60", index !== bannerIndex);
        });
    }

    function renderHomeBannerSlider() {
        var bridge = getBridge();
        var track = document.getElementById("home-banner-track");
        var dots = document.getElementById("home-banner-dots");
        if (!track || !dots) return;
        var canAutoRotate = function () {
            var homeTab = document.getElementById("tab-home");
            return document.visibilityState === "visible" && !!(homeTab && homeTab.classList.contains("active"));
        };

        if (window.homeTabUi && typeof window.homeTabUi.renderBanner === "function") {
            window.homeTabUi.renderBanner(
                track,
                dots,
                homeBannerSlides,
                bridge.getHomeBannerIndex ? bridge.getHomeBannerIndex() : 0,
                bridge.getOptimizedImageUrl
            );
        }

        updateHomeBannerContent();

        var timer = bridge.getHomeBannerTimer ? bridge.getHomeBannerTimer() : null;
        if (timer) clearInterval(timer);

        var nextTimer = setInterval(function () {
            if (!canAutoRotate()) return;
            var nextIndex = ((bridge.getHomeBannerIndex ? bridge.getHomeBannerIndex() : 0) + 1) % Math.max(homeBannerSlides.length, 1);
            if (bridge.setHomeBannerIndex) bridge.setHomeBannerIndex(nextIndex);
            updateHomeBannerContent();
        }, 4000);

        if (bridge.setHomeBannerTimer) bridge.setHomeBannerTimer(nextTimer);
    }

    function renderHomeHighlightGrid() {
        var bridge = getBridge();
        var container = document.getElementById("home-highlight-grid");
        if (!container || !window.homeTabUi || typeof window.homeTabUi.renderHighlightGrid !== "function") return;
        window.homeTabUi.renderHighlightGrid(container, homeHighlightCards, bridge.getOptimizedImageUrl);
    }

    window.setHomeBanner = function (index) {
        var bridge = getBridge();
        if (bridge.setHomeBannerIndex) bridge.setHomeBannerIndex(index);
        updateHomeBannerContent();
    };

    function renderHomeDesktopCategoryMenu() {
        var bridge = getBridge();
        var menu = document.getElementById("home-desktop-category-menu");
        if (!menu) return;

        var categories = bridge.getProductCategoryOptions ? bridge.getProductCategoryOptions() : [];
        var activeCategory = bridge.getFilterCategory ? bridge.getFilterCategory() : "";
        var categoryUi = window.categoryMenuFeature || window.productsTabUi;

        if (categoryUi && typeof categoryUi.renderTreeMenu === "function") {
            categoryUi.renderTreeMenu({
                container: "home-desktop-category-menu",
                counter: "home-desktop-category-count",
                categories: categories,
                activeCategory: activeCategory,
                allLabel: "Tất cả sản phẩm",
                selectHandler: "filterHomeByCategory",
                buildArgument: bridge.toInlineArgument,
                variant: "home-desktop",
                showHeader: false,
                wrapShell: false,
                showSummary: false,
                heroAction: "goToTab('tab-products')",
                heroActionLabel: "Mở tab sản phẩm"
            });
        } else if (window.homeTabUi && typeof window.homeTabUi.renderDesktopCategoryFallback === "function") {
            window.homeTabUi.renderDesktopCategoryFallback(
                document.getElementById("home-desktop-category-menu"),
                document.getElementById("home-desktop-category-count"),
                categories,
                activeCategory,
                {
                    selectHandler: "filterHomeByCategory",
                    buildArgument: bridge.toInlineArgument
                }
            );
        }
    }

    function renderHomeGuestCta() {
        var bridge = getBridge();
        var container = document.getElementById("home-guest-cta");
        if (!container || !window.homeTabUi || typeof window.homeTabUi.renderGuestCta !== "function") return;

        var user = bridge.getCurrentUser ? bridge.getCurrentUser() : null;
        var isGuest = !(user && user.authUid);
        var gateMessage = window.webNewCatalogGate && typeof window.webNewCatalogGate.getBlockedMessage === "function"
            ? window.webNewCatalogGate.getBlockedMessage()
            : "Đăng nhập để đồng bộ giá và danh sách sản phẩm mới nhất.";

        window.homeTabUi.renderGuestCta(container, {
            isGuest: isGuest,
            gateMessage: gateMessage
        });
    }

    window.openAuthFromHome = function (mode) {
        if (typeof window.goToTab === "function") window.goToTab("tab-account");
        setTimeout(function () {
            if (typeof window.openAuth === "function") window.openAuth();
            if (typeof window.switchAuthTab === "function") {
                window.switchAuthTab(mode === "register" ? "register" : "login");
            }
        }, 120);
    };

    window.renderHomeCategories = function () {
        var bridge = getBridge();
        var container = document.getElementById("home-mobile-categories");
        if (!container || !window.homeTabUi || typeof window.homeTabUi.renderMobileCategoriesShortcut !== "function") return;
        window.homeTabUi.renderMobileCategoriesShortcut(container, {
            categories: bridge.getProductCategoryOptions ? bridge.getProductCategoryOptions() : [],
            activeCategory: bridge.getFilterCategory ? bridge.getFilterCategory() : "",
            selectHandler: "filterHomeByCategory",
            buildArgument: bridge.toInlineArgument,
            ctaAction: "goToTab('tab-products')",
            ctaLabel: "Mở sản phẩm"
        });
    };

    window.filterHomeByCategory = function (categoryName) {
        var bridge = getBridge();
        var currentCategory = bridge.getFilterCategory ? bridge.getFilterCategory() : "";

        if (!categoryName || currentCategory === categoryName) {
            if (bridge.setFilterCategory) bridge.setFilterCategory("");
        } else if (bridge.setFilterCategory) {
            bridge.setFilterCategory(categoryName);
        }

        if (bridge.updateProductsCategoryButton) bridge.updateProductsCategoryButton();
        if (typeof window.renderProductsFilterSummary === "function") window.renderProductsFilterSummary();

        var filtered = bridge.getFilteredProducts ? bridge.getFilteredProducts(bridge.getShopProducts ? bridge.getShopProducts() : []) : [];
        window.renderHomeProductLists(filtered);
    };

    window.renderHomeProductLists = function (products) {
        var bridge = getBridge();
        var renderList = bridge.renderProductsList || window.renderProductsList;
        if (typeof renderList !== "function") return;
        var safeProducts = Array.isArray(products) ? products.slice() : [];
        var safeUser = bridge.getCurrentUser ? bridge.getCurrentUser() : null;
        var hasCategoryFilter = !!(bridge.getFilterCategory && bridge.getFilterCategory());
        var recommendedProducts = (!hasCategoryFilter && safeUser && bridge.getRecommendedProductsForUser)
            ? bridge.getRecommendedProductsForUser(safeProducts, safeUser)
            : safeProducts;
        if (typeof window.updateHomeProductTitles === "function") {
            window.updateHomeProductTitles(!hasCategoryFilter && safeUser ? "Gợi ý phù hợp cho bạn" : "Sản phẩm đề xuất");
        }
        renderList(recommendedProducts, "product-container", recommendedProducts);
        renderList(recommendedProducts, "product-container-desktop", recommendedProducts);
    };

    window.updateHomeProductTitles = function (title) {
        ["home-products-title", "home-products-title-desktop"].forEach(function (id) {
            var element = document.getElementById(id);
            if (element) {
                var textContainer = element.querySelector("span:last-child");
                if (textContainer) textContainer.innerText = title;
                else element.innerText = title;
            }
        });
    };

    function render() {
        var bridge = getBridge();
        renderHomeBannerSlider();
        renderHomeHighlightGrid();
        renderHomeGuestCta();
        var filteredProducts = bridge.getFilteredProducts ? bridge.getFilteredProducts(bridge.getShopProducts ? bridge.getShopProducts() : []) : [];
        window.renderHomeProductLists(filteredProducts);
    }

    window.renderHomeDesktopCategoryMenu = renderHomeDesktopCategoryMenu;
    window.homeTabModule = {
        render: render,
        renderBanner: renderHomeBannerSlider,
        renderCategories: window.renderHomeCategories,
        renderProducts: window.renderHomeProductLists,
        updateTitles: window.updateHomeProductTitles,
        renderGuestCta: renderHomeGuestCta
    };

    window.dispatchEvent(new Event("web-new-home-tab-ready"));
})();
