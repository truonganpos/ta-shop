(function () {
    var STYLE_ID = 'category-menu-accordion-styles';
    var openState = {};

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) return;

        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            ".category-accordion-menu{display:flex;flex-direction:column;gap:.9rem;}",
            ".category-accordion-shell{border:1px solid #e2e8f0;border-radius:2rem;background:linear-gradient(180deg,#ffffff 0%,#fcfcfd 100%);padding:1.35rem 1.2rem;box-shadow:0 22px 48px rgba(15,23,42,.08);}",
            ".category-accordion-shell__head{display:flex;align-items:center;gap:.8rem;margin-bottom:1rem;}",
            ".category-accordion-shell__icon{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:.9rem;background:#fdf2f8;color:#ec4899;}",
            ".category-accordion-shell__icon svg{width:1rem;height:1rem;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;}",
            ".category-accordion-shell__title{font-size:1rem;font-weight:900;color:#1e293b;letter-spacing:-.02em;}",
            ".category-accordion-item{border:1px solid #e2e8f0;border-radius:1.35rem;background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);overflow:hidden;transition:border-color .22s ease,box-shadow .22s ease,background-color .22s ease;}",
            ".category-accordion-item.is-open{border-color:#dbe3ef;box-shadow:0 16px 32px rgba(148,163,184,.14);}",
            ".category-accordion-item__header{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;padding:1.05rem 1.1rem;}",
            ".category-accordion-title{flex:1;text-align:left;background:none;border:0;padding:0;cursor:pointer;}",
            ".category-accordion-label{display:block;font-size:1.08rem;line-height:1.35;font-weight:800;color:#334155;transition:color .22s ease;}",
            ".category-accordion-title:hover .category-accordion-label,.category-accordion-title.is-active .category-accordion-label{color:#db2777;}",
            ".category-accordion-toggle{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:999px;background:transparent;color:#94a3b8;cursor:pointer;transition:background-color .22s ease,color .22s ease,transform .22s ease;}",
            ".category-accordion-toggle:hover{background:#f8fafc;color:#64748b;}",
            ".category-accordion-arrow{display:inline-flex;align-items:center;justify-content:center;font-size:.78rem;line-height:1;transition:transform .22s ease;}",
            ".category-accordion-item.is-open .category-accordion-arrow{transform:rotate(180deg);}",
            ".category-accordion-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .26s ease,opacity .26s ease;padding:0 .9rem;opacity:.86;}",
            ".category-accordion-body.is-open{grid-template-rows:1fr;opacity:1;padding-bottom:.9rem;}",
            ".category-accordion-body__inner{overflow:hidden;border-top:1px solid #eef2f7;padding-top:.85rem;}",
            ".category-accordion-actions{display:flex;flex-direction:column;gap:.3rem;padding:0 .25rem;}",
            ".category-accordion-action{display:block;width:100%;border:0;background:none;border-radius:.95rem;padding:.75rem .9rem;text-align:left;font-size:1rem;line-height:1.45;font-weight:700;color:#64748b;cursor:pointer;transition:background-color .22s ease,color .22s ease,transform .22s ease;}",
            ".category-accordion-action:hover{background:#f8fafc;color:#db2777;transform:translateX(2px);}",
            ".category-accordion-action.is-active{background:#fdf2f8;color:#db2777;}",
            ".category-accordion-empty{padding:.75rem .9rem;border-radius:.95rem;background:#f8fafc;color:#94a3b8;font-size:.92rem;line-height:1.6;}",
            ".category-accordion-reset{display:flex;align-items:center;justify-content:space-between;gap:.75rem;border:1px solid #e2e8f0;border-radius:1.1rem;background:#ffffff;padding:.9rem 1rem;font-size:.95rem;font-weight:800;color:#334155;transition:border-color .22s ease,background-color .22s ease,color .22s ease;}",
            ".category-accordion-reset:hover{border-color:#fbcfe8;background:#fdf2f8;color:#db2777;}",
            ".category-accordion-reset__badge{display:inline-flex;align-items:center;justify-content:center;min-width:2.2rem;height:2rem;padding:0 .7rem;border-radius:999px;background:#f8fafc;color:#94a3b8;font-size:.72rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;}",
            ".category-accordion-filter-list{display:flex;flex-wrap:wrap;gap:.55rem;}",
            ".category-accordion-filter-chip{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem .78rem;border-radius:999px;border:1px solid #fbcfe8;background:#fdf2f8;color:#db2777;font-size:.75rem;font-weight:900;}",
            ".category-accordion-filter-close{display:inline-flex;align-items:center;justify-content:center;width:1.1rem;height:1.1rem;border-radius:999px;background:#ffffff;font-size:.72rem;line-height:1;color:inherit;}",
            "body.dark-mode .category-accordion-shell{background:linear-gradient(180deg,#0f172a 0%,#111827 100%);border-color:#334155;box-shadow:0 24px 48px rgba(2,6,23,.36);}",
            "body.dark-mode .category-accordion-shell__icon{background:rgba(244,114,182,.14);color:#f9a8d4;}",
            "body.dark-mode .category-accordion-shell__title{color:#f8fafc;}",
            "body.dark-mode .category-accordion-item{background:linear-gradient(180deg,#111827 0%,#0f172a 100%);border-color:#334155;}",
            "body.dark-mode .category-accordion-item.is-open{border-color:#475569;box-shadow:0 18px 36px rgba(2,6,23,.32);}",
            "body.dark-mode .category-accordion-label{color:#e2e8f0;}",
            "body.dark-mode .category-accordion-title:hover .category-accordion-label,body.dark-mode .category-accordion-title.is-active .category-accordion-label{color:#f9a8d4;}",
            "body.dark-mode .category-accordion-toggle{color:#94a3b8;}",
            "body.dark-mode .category-accordion-toggle:hover{background:#1e293b;color:#cbd5e1;}",
            "body.dark-mode .category-accordion-body__inner{border-color:#1e293b;}",
            "body.dark-mode .category-accordion-action{color:#cbd5e1;}",
            "body.dark-mode .category-accordion-action:hover{background:#1e293b;color:#f9a8d4;}",
            "body.dark-mode .category-accordion-action.is-active{background:rgba(244,114,182,.12);color:#f9a8d4;}",
            "body.dark-mode .category-accordion-empty{background:#1e293b;color:#94a3b8;}",
            "body.dark-mode .category-accordion-reset{background:#111827;border-color:#334155;color:#e2e8f0;}",
            "body.dark-mode .category-accordion-reset:hover{background:rgba(244,114,182,.12);border-color:rgba(244,114,182,.22);color:#f9a8d4;}",
            "body.dark-mode .category-accordion-reset__badge{background:#1e293b;color:#cbd5e1;}",
            "body.dark-mode .category-accordion-filter-chip{background:rgba(244,114,182,.12);border-color:rgba(244,114,182,.22);color:#f9a8d4;}",
            "body.dark-mode .category-accordion-filter-close{background:#0f172a;}",
            "@media (max-width:767px){.category-accordion-shell{padding:1.1rem 1rem;border-radius:1.75rem;}.category-accordion-item__header{padding:1rem;}.category-accordion-label{font-size:1rem;}.category-accordion-action{font-size:.98rem;padding:.72rem .8rem;}}",
            "@media (prefers-reduced-motion:reduce){.category-accordion-item,.category-accordion-label,.category-accordion-toggle,.category-accordion-arrow,.category-accordion-body,.category-accordion-action,.category-accordion-reset{transition:none!important;}}"
        ].join('');
        document.head.appendChild(style);
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function resolveTarget(target) {
        return typeof target === 'string' ? document.getElementById(target) : target;
    }

    function buildArgument(options) {
        return typeof options.buildArgument === 'function'
            ? options.buildArgument
            : function (value) {
                return "'" + String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
            };
    }

    function getStateBucket(prefix) {
        var key = String(prefix || 'category-menu');
        if (!openState[key]) openState[key] = {};
        return openState[key];
    }

    function getGroupChildren(group) {
        var seen = {};
        return (Array.isArray(group && group.children) ? group.children : []).reduce(function (list, child) {
            var name = String(child && child.name || '').trim();
            var key = name.toLowerCase();
            if (!name || seen[key]) return list;
            seen[key] = true;
            list.push({
                name: name,
                count: Math.max(0, Number(child && child.count) || 0)
            });
            return list;
        }, []);
    }

    function isAllCategoryName(value) {
        var normalized = String(value || '').trim().toLowerCase();
        return normalized === 'tất cả' || normalized === 'tat ca' || normalized === 'all';
    }

    function getRootGroups(categories) {
        var groupMap = {};

        (Array.isArray(categories) ? categories : []).forEach(function (item) {
            var name = String(item && item.name || '').trim();
            var key = name.toLowerCase();
            if (!name || (item && item.isChild)) return;

            if (!groupMap[key]) {
                groupMap[key] = {
                    name: name,
                    count: Math.max(0, Number(item && item.count) || 0),
                    children: []
                };
            } else {
                groupMap[key].count = Math.max(groupMap[key].count, Math.max(0, Number(item && item.count) || 0));
            }

            getGroupChildren(item).forEach(function (child) {
                if (!groupMap[key].children.some(function (entry) { return entry.name === child.name; })) {
                    groupMap[key].children.push(child);
                }
            });
        });

        return Object.keys(groupMap).map(function (key) {
            var group = groupMap[key];
            group.children.sort(function (left, right) {
                return String(left.name || '').localeCompare(String(right.name || ''), 'vi');
            });
            return group;
        }).sort(function (left, right) {
            if (isAllCategoryName(left && left.name)) return -1;
            if (isAllCategoryName(right && right.name)) return 1;
            return String(left.name || '').localeCompare(String(right.name || ''), 'vi');
        });
    }

    function getFocusedGroup(groups, activeCategory, explicitName) {
        if (explicitName) {
            return groups.find(function (group) { return group && group.name === explicitName; }) || null;
        }

        if (activeCategory) {
            var exact = groups.find(function (group) { return group && group.name === activeCategory; });
            if (exact) return exact;

            return groups.find(function (group) {
                return getGroupChildren(group).some(function (child) { return child.name === activeCategory; });
            }) || null;
        }

        return null;
    }

    function buildNodeId(prefix, groupName, index) {
        var safePrefix = String(prefix || 'category-menu').replace(/[^a-z0-9_-]/gi, '-');
        var safeName = String(groupName || 'group').trim().toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
        return [safePrefix, safeName || 'group', index].join('-');
    }

    function isNodeOpen(settings, nodeId, isGroupActive, isChildActive) {
        var bucket = getStateBucket(settings.prefix);
        if (Object.prototype.hasOwnProperty.call(bucket, nodeId)) {
            return !!bucket[nodeId];
        }
        if (isGroupActive || isChildActive) return true;
        return settings.expandAll !== false;
    }

    function renderResetButton(selectHandler, toArg, allLabel) {
        return [
            "<button type='button' class='category-accordion-reset' onclick=\"", selectHandler, "(", toArg(''), ")\">",
            "  <span>", escapeHtml(allLabel), "</span>",
            "  <span class='category-accordion-reset__badge'>All</span>",
            "</button>"
        ].join('');
    }

    function renderChildAction(label, value, selectHandler, toArg, isActive) {
        return [
            "<button type='button' class='category-accordion-action",
            isActive ? " is-active" : "",
            "' onclick=\"", selectHandler, "(", toArg(value), ")\">",
            escapeHtml(label),
            "</button>"
        ].join('');
    }

    function renderGroupItem(group, index, settings) {
        var activeCategory = String(settings.activeCategory || '').trim();
        var isAllGroup = isAllCategoryName(group && group.name);
        var children = getGroupChildren(group);
        var groupValue = isAllGroup ? '' : group.name;
        var isGroupActive = isAllGroup ? !activeCategory : activeCategory === group.name;
        var isChildActive = children.some(function (child) { return child.name === activeCategory; });
        var nodeId = buildNodeId(settings.prefix, group.name, index);
        var isOpen = isNodeOpen(settings, nodeId, isGroupActive, isChildActive);
        if (isAllGroup && !children.length) {
            return [
                "<div class='category-accordion-item", isGroupActive ? " is-open" : "", "'>",
                "  <div class='category-accordion-item__header'>",
                "      <button type='button' class='category-accordion-title", isGroupActive ? " is-active" : "", "' onclick=\"", settings.selectHandler, "(", settings.toArg(groupValue), ")\">",
                "          <span class='category-accordion-label'>", escapeHtml(group.name), "</span>",
                "      </button>",
                "  </div>",
                "</div>"
            ].join('');
        }
        var childHtml = children.length
            ? children.map(function (child) {
                return renderChildAction(child.name, child.name, settings.selectHandler, settings.toArg, activeCategory === child.name);
            }).join('')
            : "<div class='category-accordion-empty'>" + (isAllGroup
                ? "Hi&#7875;n th&#7883; to&#224;n b&#7897; s&#7843;n ph&#7849;m tr&#234;n web."
                : "Ch&#432;a c&#243; danh m&#7909;c con ri&#234;ng cho nh&#243;m n&#224;y.") + "</div>";

        return [
            "<div class='category-accordion-item", isOpen ? " is-open" : "", "' data-category-node='", escapeHtml(nodeId), "' data-category-prefix='", escapeHtml(settings.prefix), "'>",
            "  <div class='category-accordion-item__header'>",
            "      <button type='button' class='category-accordion-title", isGroupActive ? " is-active" : "", "' onclick=\"", settings.selectHandler, "(", settings.toArg(groupValue), ")\">",
            "          <span class='category-accordion-label'>", escapeHtml(group.name), "</span>",
            "      </button>",
            "      <button type='button' class='category-accordion-toggle' aria-expanded='", isOpen ? "true" : "false", "' onclick=\"window.categoryMenuFeature.toggleTreeNode('", escapeHtml(nodeId), "')\">",
            "          <span class='category-accordion-arrow'>&#9660;</span>",
            "      </button>",
            "  </div>",
            "  <div id='sub-", escapeHtml(nodeId), "' class='category-accordion-body", isOpen ? " is-open" : "", "'>",
            "      <div class='category-accordion-body__inner'>",
            "          <div class='category-accordion-actions'>",
            childHtml,
            "          </div>",
            "      </div>",
            "  </div>",
            "</div>"
        ].join('');
    }

    function renderMenuShell(container, innerHtml, options) {
        var title = escapeHtml(options.title || 'Danh mục');
        var iconHtml = [
            "<span class='category-accordion-shell__icon' aria-hidden='true'>",
            "  <svg viewBox='0 0 24 24'>",
            "      <path d='M6 7h12'></path>",
            "      <path d='M10 12h8'></path>",
            "      <path d='M14 17h4'></path>",
            "      <path d='M4 7h.01'></path>",
            "      <path d='M4 12h.01'></path>",
            "      <path d='M4 17h.01'></path>",
            "  </svg>",
            "</span>"
        ].join('');

        if (options.wrapShell === false) {
            container.innerHTML = innerHtml;
            return;
        }

        container.innerHTML = [
            "<section class='category-accordion-shell'>",
            options.showHeader === false ? '' : "<div class='category-accordion-shell__head'>" + iconHtml + "<h3 class='category-accordion-shell__title'>" + title + "</h3></div>",
            innerHtml,
            "</section>"
        ].join('');
    }

    function renderEmptyState(container, options) {
        renderMenuShell(container, "<div class='category-accordion-empty'>Ch&#432;a c&#243; danh m&#7909;c &#273;&#7875; hi&#7875;n th&#7883;.</div>", options || {});
    }

    function renderTreeMenu(options) {
        var settings = options || {};
        var container = resolveTarget(settings.container);
        var counter = resolveTarget(settings.counter);
        var groups = getRootGroups(settings.categories);
        var activeCategory = String(settings.activeCategory || '').trim();
        var toArg = buildArgument(settings);
        var selectHandler = String(settings.selectHandler || 'selectProductCategory').trim();
        var prefix = settings.prefix || (container && container.id) || settings.variant || 'category-menu';
        var focusedGroup = getFocusedGroup(groups, activeCategory, settings.focusGroupName);
        var html;

        if (!container) return;
        ensureStyles();

        if (counter) counter.innerText = groups.length + ' nh\u00f3m';
        if (!groups.length) {
            renderEmptyState(container, {
                title: settings.title || 'Danh m\u1ee5c',
                showHeader: settings.showHeader,
                wrapShell: settings.wrapShell
            });
            return;
        }

        html = [
            "<div class='category-accordion-menu' data-category-menu-root='", escapeHtml(prefix), "'>",
            settings.showAllButton === true ? renderResetButton(selectHandler, toArg, String(settings.allLabel || 'T\u1ea5t c\u1ea3 s\u1ea3n ph\u1ea9m')) : '',
            groups.map(function (group, index) {
                return renderGroupItem(group, index, {
                    activeCategory: activeCategory,
                    focusGroupName: focusedGroup ? focusedGroup.name : settings.focusGroupName,
                    prefix: prefix,
                    selectHandler: selectHandler,
                    toArg: toArg,
                    expandAll: settings.expandAll !== false
                });
            }).join(''),
            "</div>"
        ].join('');

        renderMenuShell(container, html, {
            title: settings.title || 'Danh m\u1ee5c',
            showHeader: settings.showHeader !== false,
            wrapShell: settings.wrapShell
        });
    }

    function renderCategoryGroups(container, headerTitle, backBtn, categories, buildArgFn, activeCategory) {
        if (headerTitle) {
            headerTitle.innerHTML = "<p class='text-xs uppercase tracking-[0.2em] text-babyPink font-black mb-1'>Danh m&#7909;c</p><h2 class='font-bold text-lg text-gray-800'>Ch&#7885;n danh m&#7909;c s&#7843;n ph&#7849;m</h2>";
        }
        if (backBtn) backBtn.classList.add('hidden');

        renderTreeMenu({
            container: container,
            categories: categories,
            activeCategory: activeCategory,
            buildArgument: buildArgFn,
            selectHandler: 'selectProductCategory',
            variant: 'popup',
            title: 'Danh mục',
            showHeader: false,
            wrapShell: false,
            expandAll: false
        });
    }

    function renderCategoryTags(container, headerTitle, backBtn, group, buildArgFn, activeCategory) {
        if (headerTitle) {
            headerTitle.innerHTML = "<p class='text-xs uppercase tracking-[0.2em] text-babyPink font-black mb-1'>Danh m&#7909;c</p><h2 class='font-bold text-lg text-gray-800'>" + escapeHtml(group && group.name || 'Ch&#7885;n danh m&#7909;c s&#7843;n ph&#7849;m') + "</h2>";
        }
        if (backBtn) backBtn.classList.add('hidden');

        renderTreeMenu({
            container: container,
            categories: group ? [group] : [],
            activeCategory: activeCategory,
            buildArgument: buildArgFn,
            selectHandler: 'selectProductCategory',
            variant: 'popup',
            title: 'Danh mục',
            showHeader: false,
            wrapShell: false
        });
    }

    function renderMobileShortcut(container, options) {
        var root = resolveTarget(container);
        var settings = options || {};
        if (!root) return;

        renderTreeMenu({
            container: root,
            categories: settings.categories,
            activeCategory: settings.activeCategory,
            buildArgument: settings.buildArgument,
            selectHandler: String(settings.selectHandler || 'filterHomeByCategory'),
            variant: 'mobile',
            prefix: (root.id || 'mobile-category-menu') + '-accordion',
            title: 'Danh mục',
            showHeader: true,
            expandAll: true
        });
    }

    function renderFilterSummary(container, tags) {
        var root = resolveTarget(container);
        if (!root) return;

        root.innerHTML = Array.isArray(tags) && tags.length
            ? "<div class='category-accordion-filter-list'>" + tags.map(function (tag, index) {
                return "<span class='category-accordion-filter-chip'>" + escapeHtml(tag.label || '') + "<button type='button' class='category-accordion-filter-close' onclick='window.removeFilterTag(" + String(index) + ")'>&times;</button></span>";
            }).join('') + "</div>"
            : '';
    }

    function setNodeState(node, shouldOpen) {
        var nodeId;
        var prefix;
        var toggle;
        var body;

        if (!node) return;

        nodeId = String(node.getAttribute('data-category-node') || '');
        prefix = String(node.getAttribute('data-category-prefix') || '');
        toggle = node.querySelector('.category-accordion-toggle');
        body = node.querySelector('.category-accordion-body');

        node.classList.toggle('is-open', shouldOpen);
        if (toggle) toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        if (body) body.classList.toggle('is-open', shouldOpen);
        if (nodeId) getStateBucket(prefix)[nodeId] = shouldOpen;
    }

    function toggleTreeNode(nodeId, bodyId) {
        var resolvedBodyId = bodyId || ('sub-' + String(nodeId || '').trim());
        var body = document.getElementById(resolvedBodyId);
        var node = body ? body.closest('[data-category-node]') : document.querySelector("[data-category-node='" + String(nodeId || '').replace(/'/g, "\\'") + "']");
        if (!node) return;
        setNodeState(node, !node.classList.contains('is-open'));
    }

    window.categoryMenuFeature = {
        ensureStyles: ensureStyles,
        renderTreeMenu: renderTreeMenu,
        renderCategoryGroups: renderCategoryGroups,
        renderCategoryTags: renderCategoryTags,
        renderMobileShortcut: renderMobileShortcut,
        renderFilterSummary: renderFilterSummary,
        toggleTreeNode: toggleTreeNode
    };
})();
