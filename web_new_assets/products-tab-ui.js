(function () {
    function getFeature() {
        return window.categoryMenuFeature || {};
    }

    window.productsTabUi = {
        renderTreeMenu: function (options) {
            if (typeof getFeature().renderTreeMenu === 'function') {
                return getFeature().renderTreeMenu(options);
            }
        },
        renderCategoryGroups: function (container, headerTitle, backBtn, categories, buildArgument, activeCategory) {
            if (typeof getFeature().renderCategoryGroups === 'function') {
                return getFeature().renderCategoryGroups(container, headerTitle, backBtn, categories, buildArgument, activeCategory);
            }
        },
        renderCategoryTags: function (container, headerTitle, backBtn, group, buildArgument, activeCategory) {
            if (typeof getFeature().renderCategoryTags === 'function') {
                return getFeature().renderCategoryTags(container, headerTitle, backBtn, group, buildArgument, activeCategory);
            }
        },
        renderFilterSummary: function (container, tags) {
            if (typeof getFeature().renderFilterSummary === 'function') {
                return getFeature().renderFilterSummary(container, tags);
            }
        },
        toggleTreeNode: function (nodeId, bodyId, arrowId) {
            if (typeof getFeature().toggleTreeNode === 'function') {
                return getFeature().toggleTreeNode(nodeId, bodyId, arrowId);
            }
        }
    };
})();
