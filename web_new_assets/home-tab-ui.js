(function () {
    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderBanner(track, dots, slides, activeIndex, getOptimizedImageUrl) {
        if (track) {
            track.innerHTML = (slides || []).map(function (slide, index) {
                var imageUrl = getOptimizedImageUrl ? getOptimizedImageUrl(slide.image, 'w1600') : slide.image;
                var badge = String(slide.badge || slide.label || '').trim();
                var title = String(slide.title || slide.text || '').trim();
                var subtitle = String(slide.subtitle || slide.description || slide.desc || '').trim();
                var support = String(slide.support || slide.note || '').trim();

                return [
                    "<div class='relative w-full h-full shrink-0 overflow-hidden'>",
                    "    <img src='", imageUrl, "' class='w-full h-full object-cover' alt='Banner ", String(index + 1), "' loading='", index === 0 ? "eager" : "lazy", "' decoding='async' fetchpriority='", index === 0 ? "high" : "low", "'/>",
                    "    <div class='absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/45 to-transparent'></div>",
                    "    <div class='absolute inset-y-0 left-0 z-10 flex items-center'>",
                    "        <div class='p-8 sm:p-12 lg:p-20 max-w-xl text-white'>",
                    badge ? "            <span class='inline-flex items-center rounded-full bg-white/15 border border-white/20 px-4 py-2 text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase mb-4 backdrop-blur-md'>" + escapeHtml(badge) + "</span>" : '',
                    title ? "            <h3 class='text-3xl sm:text-5xl lg:text-7xl font-black leading-tight'>" + escapeHtml(title) + "</h3>" : '',
                    subtitle ? "            <p class='text-slate-200 text-sm lg:text-xl mb-6 mt-4 font-medium leading-7'>" + escapeHtml(subtitle) + "</p>" : '',
                    support ? "            <p class='text-white/85 text-xs sm:text-sm font-bold tracking-[0.18em] uppercase'>" + escapeHtml(support) + "</p>" : '',
                    "        </div>",
                    "    </div>",
                    "</div>"
                ].join('');
            }).join('');
        }

        if (dots) {
            dots.innerHTML = (slides || []).map(function (_, index) {
                return "<button class='w-3 h-3 rounded-full transition-all " + (index === activeIndex ? "bg-babyPink scale-110" : "bg-white/60") + "' onclick='setHomeBanner(" + index + ")'></button>";
            }).join('');
        }
    }

    function renderHighlightGrid(container, items, getOptimizedImageUrl) {
        if (!container) return;

        container.innerHTML = (Array.isArray(items) ? items : []).map(function (item, index) {
            var imageUrl = getOptimizedImageUrl ? getOptimizedImageUrl(item.image, 'w1200') : item.image;
            var accentClass = String(item.accentClass || 'text-sky-600').trim();
            var label = String(item.label || '').trim();
            var action = String(item.action || "goToTab('tab-products')").trim();
            var iconSvg = String(item.iconSvg || '').trim();
            var safeAlt = label || ('Ưu đãi ' + String(index + 1));

            return [
                "<button class='group relative col-span-2 rounded-[2rem] overflow-hidden h-36 sm:h-56 shadow-sm border border-slate-100 dark:border-slate-800 text-left' onclick=\"", action.replace(/\"/g, '&quot;'), "\">",
                "    <img src='", imageUrl, "' class='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' alt='", escapeHtml(safeAlt), "' loading='lazy' decoding='async'/>",
                "    <div class='absolute inset-0 bg-gradient-to-r from-slate-900/55 via-slate-900/18 to-transparent'></div>",
                "    <div class='absolute top-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold shadow ", accentClass, "'>",
                iconSvg,
                "        <span>", escapeHtml(label), "</span>",
                "    </div>",
                "</button>"
            ].join('');
        }).join('');
    }

    function renderGuestCta(container, options) {
        if (!container) return;

        var isGuest = !!options.isGuest;
        container.classList.toggle('hidden', !isGuest);
        if (!isGuest) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = [
            "<div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>",
            "    <div>",
            "        <p class='text-[11px] uppercase tracking-[0.22em] text-babyPink font-black'>Khách chưa đăng nhập</p>",
            "        <h3 class='font-extrabold text-xl text-gray-800 mt-1'>Đăng nhập để xem giá sỉ và đồng bộ đơn hàng</h3>",
            "        <p class='text-sm text-gray-600 mt-2 leading-6 max-w-2xl'>", escapeHtml(options.gateMessage || ''), "</p>",
            "    </div>",
            "    <div class='flex flex-wrap gap-3 shrink-0'>",
            "        <button class='bg-babyPink text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:bg-pink-500 transition' onclick='openAuthFromHome(\"login\")'>Đăng nhập</button>",
            "        <button class='bg-white text-babyPink border border-pink-200 px-5 py-3 rounded-2xl font-bold hover:bg-pink-50 transition [.dark-mode_&]:!bg-[#1f2937] [.dark-mode_&]:!border-[#334155]' onclick='openAuthFromHome(\"register\")'>Đăng ký</button>",
            "    </div>",
            "</div>"
        ].join('');
    }

    function renderMobileCategoriesShortcut(container, options) {
        if (window.categoryMenuFeature && typeof window.categoryMenuFeature.renderMobileShortcut === 'function') {
            return window.categoryMenuFeature.renderMobileShortcut(container, options || {});
        }
    }

    function renderDesktopCategoryFallback(container, counter, categories, activeCategory, options) {
        if (window.categoryMenuFeature && typeof window.categoryMenuFeature.renderTreeMenu === 'function') {
            return window.categoryMenuFeature.renderTreeMenu({
                container: container,
                counter: counter,
                categories: categories,
                activeCategory: activeCategory,
                selectHandler: options && options.selectHandler,
                buildArgument: options && options.buildArgument,
                allLabel: 'Tất cả sản phẩm',
                variant: 'home-desktop',
                heroAction: "goToTab('tab-products')",
                heroActionLabel: 'Mở tab sản phẩm'
            });
        }
    }

    window.homeTabUi = {
        renderBanner: renderBanner,
        renderHighlightGrid: renderHighlightGrid,
        renderGuestCta: renderGuestCta,
        renderMobileCategoriesShortcut: renderMobileCategoriesShortcut,
        renderDesktopCategoryFallback: renderDesktopCategoryFallback
    };
})();
