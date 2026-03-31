(function () {
    function getBridge() {
        return window.webNewAppBridge || {};
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderDesktopCategoryMenu() {
        var bridge = getBridge();
        var categories = bridge.getProductCategoryOptions ? bridge.getProductCategoryOptions() : [];
        var activeCategory = bridge.getFilterCategory ? bridge.getFilterCategory() : '';
        var categoryUi = window.categoryMenuFeature || window.productsTabUi;

        if (categoryUi && typeof categoryUi.renderTreeMenu === 'function') {
            categoryUi.renderTreeMenu({
                container: 'desktop-category-menu',
                counter: 'desktop-category-count',
                categories: categories,
                activeCategory: activeCategory,
                allLabel: 'Tất cả sản phẩm',
                selectHandler: 'selectProductCategory',
                buildArgument: bridge.toInlineArgument,
                variant: 'products-desktop',
                showHeader: false,
                wrapShell: false,
                expandAll: false,
                showSummary: false,
                heroAction: '',
                heroActionLabel: ''
            });
        }
    }

    window.openProductCategoryPopup = function () {
        window.renderCategoryGroupsView();
        var bridge = getBridge();
        if (bridge.openModalShell) bridge.openModalShell('product-category-overlay');
    };

    window.closeProductCategoryPopup = function () {
        var bridge = getBridge();
        if (bridge.closeModalShell) bridge.closeModalShell('product-category-overlay');
    };

    window.renderCategoryGroupsView = function () {
        var bridge = getBridge();
        var categories = bridge.getProductCategoryOptions ? bridge.getProductCategoryOptions() : [];
        var container = document.getElementById('product-category-list');
        var headerTitle = document.getElementById('product-category-title');
        var backBtn = document.getElementById('product-category-back-btn');
        var categoryUi = window.categoryMenuFeature || window.productsTabUi;

        if (categoryUi && typeof categoryUi.renderCategoryGroups === 'function') {
            categoryUi.renderCategoryGroups(
                container,
                headerTitle,
                backBtn,
                categories,
                bridge.toInlineArgument,
                bridge.getFilterCategory ? bridge.getFilterCategory() : ''
            );
        }
    };

    window.renderCategoryTagsView = function (groupName) {
        var bridge = getBridge();
        var categories = bridge.getProductCategoryOptions ? bridge.getProductCategoryOptions() : [];
        var group = categories.find(function (item) { return item && item.name === groupName; });
        var container = document.getElementById('product-category-list');
        var headerTitle = document.getElementById('product-category-title');
        var backBtn = document.getElementById('product-category-back-btn');
        var categoryUi = window.categoryMenuFeature || window.productsTabUi;

        if (!group || !categoryUi || typeof categoryUi.renderCategoryTags !== 'function') return;
        categoryUi.renderCategoryTags(
            container,
            headerTitle,
            backBtn,
            group,
            bridge.toInlineArgument,
            bridge.getFilterCategory ? bridge.getFilterCategory() : ''
        );
    };

    window.selectProductCategory = function (category) {
        var bridge = getBridge();
        if (bridge.setFilterCategory) bridge.setFilterCategory(category);
        if (bridge.replaceProductFilters) bridge.replaceProductFilters({});
        window.renderProductsTabContent();

        var filtered = bridge.getFilteredProducts
            ? bridge.getFilteredProducts(bridge.getShopProducts ? bridge.getShopProducts() : [])
            : [];
        if (typeof window.renderHomeProductLists === 'function') window.renderHomeProductLists(filtered);
        window.closeProductCategoryPopup();
    };

    window.renderProductsFilterSummary = function () {
        var bridge = getBridge();
        var filters = bridge.getProductFilters ? bridge.getProductFilters() : {};
        var activeCategory = bridge.getFilterCategory ? bridge.getFilterCategory() : '';
        var summaryContainer = document.getElementById('products-filter-summary');
        if (!summaryContainer) return;

        var tags = [];
        if (activeCategory) {
            tags.push({
                label: 'Danh mục: ' + activeCategory,
                action: function () { window.selectProductCategory(''); }
            });
        }
        if (filters.minPrice || filters.maxPrice) {
            var min = bridge.formatMoney ? bridge.formatMoney(filters.minPrice || 0) : filters.minPrice;
            var max = bridge.formatMoney ? bridge.formatMoney(filters.maxPrice || 0) : filters.maxPrice;
            tags.push({
                label: 'Giá: ' + (filters.minPrice ? min : '0đ') + ' - ' + (filters.maxPrice ? max : 'Trở lên'),
                action: function () {
                    filters.minPrice = '';
                    filters.maxPrice = '';
                    window.applyFilter();
                }
            });
        }
        if (filters.bestSeller) tags.push({ label: 'Bán chạy', action: function () { filters.bestSeller = false; window.applyFilter(); } });
        if (filters.featured) tags.push({ label: 'Nổi bật', action: function () { filters.featured = false; window.applyFilter(); } });
        if (filters.multiImage) tags.push({ label: 'Nhiều ảnh', action: function () { filters.multiImage = false; window.applyFilter(); } });
        if (filters.hasVariant) tags.push({ label: 'Có phân loại', action: function () { filters.hasVariant = false; window.applyFilter(); } });

        var sortLabels = {
            newest: 'Mới nhất',
            priceAsc: 'Giá thấp đến cao',
            priceDesc: 'Giá cao đến thấp',
            popular: ''
        };
        if (filters.sort && sortLabels[filters.sort]) {
            tags.push({
                label: 'Sắp xếp: ' + sortLabels[filters.sort],
                action: function () {
                    filters.sort = 'popular';
                    window.applyFilter();
                }
            });
        }

        if (window.categoryMenuFeature && typeof window.categoryMenuFeature.renderFilterSummary === 'function') {
            window.categoryMenuFeature.renderFilterSummary(summaryContainer, tags);
        } else if (window.productsTabUi && typeof window.productsTabUi.renderFilterSummary === 'function') {
            window.productsTabUi.renderFilterSummary(summaryContainer, tags);
        }

        window.removeFilterTag = function (index) {
            if (tags[index] && typeof tags[index].action === 'function') tags[index].action();
        };
    };

    window.resetProductsFilters = function () {
        var bridge = getBridge();
        if (bridge.replaceProductFilters) bridge.replaceProductFilters({});
        if (bridge.setFilterCategory) bridge.setFilterCategory('');

        var searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        window.renderProductsTabContent();
        var filtered = bridge.getFilteredProducts
            ? bridge.getFilteredProducts(bridge.getShopProducts ? bridge.getShopProducts() : [])
            : [];
        if (typeof window.renderHomeProductLists === 'function') window.renderHomeProductLists(filtered);
        if (typeof window.updateHomeProductTitles === 'function') window.updateHomeProductTitles('Sản Phẩm Đề Xuất');
        if (typeof window.syncFilterDrawerUI === 'function') window.syncFilterDrawerUI();
    };

    window.setPriceFilter = function (min, max) {
        var minEl = document.getElementById('filter-min-price');
        var maxEl = document.getElementById('filter-max-price');
        if (minEl) minEl.value = min;
        if (maxEl) maxEl.value = max;
    };

    window.renderProductsTabContent = function () {
        var bridge = getBridge();
        var filtered = bridge.getFilteredProducts
            ? bridge.getFilteredProducts(bridge.getShopProducts ? bridge.getShopProducts() : [])
            : [];

        if (bridge.updateProductsCategoryButton) bridge.updateProductsCategoryButton();
        window.renderProductsFilterSummary();
        renderDesktopCategoryMenu();
        if (bridge.renderProductsList) bridge.renderProductsList(filtered, 'products-tab-grid', filtered);
    };

    function setupCategorySwipe() {
        var panel = document.getElementById('product-category-panel');
        if (!panel || panel.dataset.swipeBound) return;
        panel.dataset.swipeBound = '1';

        var startX = 0;
        var startY = 0;
        panel.addEventListener('touchstart', function (event) {
            startX = event.changedTouches[0].screenX;
            startY = event.changedTouches[0].screenY;
        }, { passive: true });

        panel.addEventListener('touchend', function (event) {
            var endX = event.changedTouches[0].screenX;
            var endY = event.changedTouches[0].screenY;
            var diffX = endX - startX;
            var diffY = endY - startY;

            if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
                window.closeProductCategoryPopup();
            }
        }, { passive: true });
    }

    function render() {
        window.renderProductsFilterSummary();
        window.renderProductsTabContent();
        setupCategorySwipe();
    }

    window.productsTabModule = {
        render: render,
        renderDesktopCategoryMenu: renderDesktopCategoryMenu,
        renderFilters: window.renderProductsFilterSummary,
        renderGrid: window.renderProductsTabContent
    };

    window.dispatchEvent(new Event('web-new-products-tab-ready'));
})();
