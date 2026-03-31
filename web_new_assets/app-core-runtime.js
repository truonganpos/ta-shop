    const saveState = () => {
        localStorage.setItem('ta_cart', JSON.stringify(cartData));
        localStorage.setItem('ta_wishlist', JSON.stringify(wishlistData));
        if(currentUser) localStorage.setItem('ta_user', JSON.stringify(currentUser));
        else localStorage.removeItem('ta_user');
        if(typeof window.updateBadgeNumbers === 'function') window.updateBadgeNumbers();
    };

    const buildProductRenderSignature = (containerId, products, wishedIds) => {
        const safeProducts = Array.isArray(products) ? products : [];
        const wishedSignature = Array.from(wishedIds || []).sort().join('|');
        const productSignature = safeProducts.map((prod) => {
            const safeProd = prod || {};
            return [
                safeProd.id || '',
                safeProd.img || '',
                safeProd.priceValue || safeProd.price || '',
                safeProd.originalPriceValue || safeProd.originalPrice || '',
                safeProd.salePercent || safeProd.discountPercent || '',
                safeProd.sold || '',
                safeProd.availableStock || safeProd.stock || '',
                safeProd.inStock === false ? 0 : 1
            ].join('~');
        }).join('||');
        return [
            containerId,
            safeProducts.length,
            productFeedState.error || '',
            wishedSignature,
            productSignature
        ].join('##');
    };

    const initializeAppCore = () => {
        loadState();
        applyTheme(localStorage.getItem('ta_theme') || 'light');
        const introSupportPhone = document.getElementById('intro-support-phone');
        if(introSupportPhone) introSupportPhone.innerText = STORE_CONTACT_PHONE;
        
        // MOCK DATA NÂNG CẤP THÊM IMAGES VÀ VARIANTS
        shopProducts = [
            { id: 'p1', cat: 'Sơ sinh', name: 'Set đồ sơ sinh 100% Cotton an toàn tuyệt đối', price: '199.000đ', sold: 120, inStock: true, badges: ['NEW'],
              images: ['https://images.unsplash.com/photo-1522771930-78848d92871d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'],
              img: 'https://images.unsplash.com/photo-1522771930-78848d92871d?auto=format&fit=crop&w=400&q=80', desc: 'Chất liệu vải 100% cotton tự nhiên, vô cùng mềm mịn và thoáng mát. An toàn cho trẻ sơ sinh từ 0-6 tháng tuổi.',
              variants: [{ name: 'Màu sắc', options: ['Xanh Mint', 'Hồng Phấn', 'Vàng Chanh'] }, { name: 'Size', options: ['0-3M', '3-6M'] }]
            },
            { id: 'p2', cat: 'Đồ chơi', name: 'Đồ chơi xếp hình gỗ Montessori', price: '150.000đ', sold: 340, inStock: true, badges: ['HOT'],
              images: ['https://drive.google.com/thumbnail?id=1ddz0OyMeWpfmrxFcrCUFavcFTTq1rZiF&sz=w800', 'https://drive.google.com/thumbnail?id=1ddz0OyMeWpfmrxFcrCUFavcFTTq1rZiF&sz=w800'],
              img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80', desc: 'Bộ đồ chơi được làm từ gỗ tự nhiên, sơn phủ sinh học không độc hại. Phát triển tư duy logic thông qua phương pháp giáo dục Montessori.',
              variants: []
            },
            { id: 'p3', cat: 'Sữa bỉm', name: 'Sữa công thức số 1 nhập khẩu chính hãng', price: '550.000đ', sold: 89, inStock: false, badges: ['SALE'],
              images: ['https://images.unsplash.com/photo-1629815049386-5386f78cc73d?auto=format&fit=crop&w=600&q=80'],
              img: 'https://images.unsplash.com/photo-1629815049386-5386f78cc73d?auto=format&fit=crop&w=400&q=80', desc: 'Bổ sung DHA, ARA và hệ chất xơ GOS/FOS mô phỏng sữa mẹ giúp bé tiêu hóa tốt, tăng cường miễn dịch.',
              variants: [{ name: 'Khối lượng', options: ['Hộp 400g', 'Hộp 800g'] }]
            },
            { id: 'p4', cat: 'Đồ chơi', name: 'Gấu bông ru ngủ phát nhạc tự động', price: '210.000đ', sold: 215, inStock: true, badges: ['HOT', 'NEW'],
              images: ['https://images.unsplash.com/photo-1559418612-4cf4e723528b?auto=format&fit=crop&w=600&q=80'],
              img: 'https://images.unsplash.com/photo-1559418612-4cf4e723528b?auto=format&fit=crop&w=400&q=80', desc: 'Tích hợp bộ phát nhạc với tiếng ồn trắng. Cảm biến thông minh tự động phát nhạc khi bé khóc, chất liệu nỉ lông cừu siêu êm.',
              variants: [{ name: 'Mẫu mã', options: ['Gấu Nâu', 'Thỏ Trắng'] }]
            }
        ];
        shopProducts = [];

        loadCachedCatalogFromApp();
        scheduleShortcutPrompt(SHORTCUT_PROMPT_DELAY_MS);
        const initializeDeferredTabModule = (config = {}, force = false) => {
            const moduleName = String(config.moduleName || '').trim();
            const readyEvent = String(config.readyEvent || '').trim();
            const stateKey = String(config.stateKey || '').trim();
            const tabId = String(config.tabId || '').trim();
            const loadingMarkup = String(config.loadingMarkup || '').trim();
            if(!moduleName || !readyEvent || !stateKey) return;

            const renderModule = () => {
                const tabModule = window[moduleName];
                if(tabModule && typeof tabModule.render === 'function') {
                    tabModule.render({ force: !!force });
                    tabRenderState[stateKey] = true;
                    return true;
                }
                return false;
            };

            if(renderModule()) return;

            if(loadingMarkup && tabId) {
                const tabNode = document.getElementById(tabId);
                if(tabNode && !tabNode.innerHTML.trim()) tabNode.innerHTML = loadingMarkup;
            }

            const onTabReady = () => { renderModule(); };
            window.addEventListener(readyEvent, onTabReady, { once: true });
            scheduleIdleTask(renderModule, 360);
        };
        const initializeHomeTab = (force = false) => initializeDeferredTabModule({
            moduleName: 'homeTabModule',
            readyEvent: 'web-new-home-tab-ready',
            stateKey: 'home',
            tabId: 'tab-home'
        }, force);
        const initializeProductsTab = (force = false) => initializeDeferredTabModule({
            moduleName: 'productsTabModule',
            readyEvent: 'web-new-products-tab-ready',
            stateKey: 'products',
            tabId: 'tab-products'
        }, force);
        const initializeSaleTab = (force = false) => initializeDeferredTabModule({
            moduleName: 'saleTabModule',
            readyEvent: 'web-new-sale-tab-ready',
            stateKey: 'sale',
            tabId: 'tab-sale',
            loadingMarkup: `<div class="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm text-sm text-gray-500">Đang tải trạm săn deal...</div>`
        }, force);
        const initializeIntroTab = (force = false) => initializeDeferredTabModule({
            moduleName: 'introTabModule',
            readyEvent: 'web-new-intro-tab-ready',
            stateKey: 'intro',
            tabId: 'tab-intro'
        }, force);
        const initializeAccountTab = (force = false) => initializeDeferredTabModule({
            moduleName: 'accountTabModule',
            readyEvent: 'web-new-account-tab-ready',
            stateKey: 'account',
            tabId: 'tab-account',
            loadingMarkup: `<div class="flex flex-col items-center justify-center py-20 text-center px-4 text-gray-500"><div class="w-16 h-16 rounded-full border-4 border-pink-100 border-t-babyPink animate-spin mb-4"></div><h2 class="font-bold text-lg text-gray-800 mb-2">Đang tải tài khoản</h2><p class="text-sm">Thông tin tài khoản đang được khởi tạo.</p></div>`
        }, force);
        const ensureTabInitialized = (tabId, force = false) => {
            if(tabId === 'tab-home') initializeHomeTab(force);
            if(tabId === 'tab-products') initializeProductsTab(force);
            if(tabId === 'tab-sale') initializeSaleTab(force);
            if(tabId === 'tab-intro') initializeIntroTab(force);
            if(tabId === 'tab-account') initializeAccountTab();
        };

        let remoteAccountRefreshTimer = null;
        const scheduleRemoteAccountRefresh = (options = {}) => {
            clearTimeout(remoteAccountRefreshTimer);
            remoteAccountRefreshTimer = setTimeout(async () => {
                if(!currentUser || !currentUser.authUid) return;
                try {
                    if(options.customers !== false) {
                        await syncCustomerSessionFromFirebase({ clearIfSignedOut: true, skipCatalogRefresh: true });
                    }
                    if(options.orders !== false) {
                        await syncOrdersFromFirebase({ force: true });
                    }
                } catch(error) {
                    console.warn('Khong dong bo duoc tai khoan tu metadata:', error);
                } finally {
                    if(tabRenderState.account && typeof window.renderAccountTab === 'function') window.renderAccountTab();
                    if(typeof window.renderOrdersUI === 'function') window.renderOrdersUI();
                }
            }, Math.max(Number(options.delay || 220) || 220, 80));
        };

        ensureTabInitialized('tab-home', true);
        if(typeof window.updateBadgeNumbers === 'function') window.updateBadgeNumbers();
        updateFloatingFilterButton();
        scheduleIdleTask(() => {
            if(typeof window.setupSwipeGestures === 'function') window.setupSwipeGestures();
            if(typeof window.initFullscreenSwipe === 'function') window.initFullscreenSwipe();
        }, 80);
        setupCatalogLazyObserver();
        scheduleIdleTask(async () => {
            await waitForRetailFirebaseReady();
            if(isCatalogLoadBlocked()) {
                applyCatalogBlockedState();
            } else {
                syncCatalogFromPosCache({ refreshViews: true, force: !loadCachedCatalogFromApp() });
            }
            if(window.retailFirebase && typeof window.retailFirebase.subscribeCatalogMeta === 'function') {
                window.retailFirebase.subscribeCatalogMeta((payload) => {
                    if(payload && payload.type === 'catalog-live') {
                        if(!isCatalogLoadBlocked()) {
                            loadCachedCatalogFromApp();
                            refreshCatalogViews();
                        }
                        return;
                    }
                    scheduleIdleTask(() => {
                        if(isCatalogLoadBlocked()) {
                            applyCatalogBlockedState();
                            return;
                        }
                        syncCatalogDeltaFromCloud();
                    });
                });
            }
            if(window.retailFirebase && typeof window.retailFirebase.subscribeAccountMeta === 'function') {
                window.retailFirebase.subscribeAccountMeta((payload) => {
                    if(!payload) return;
                    if(payload.type === 'account-signout') {
                        currentUser = null;
                        saveState();
                        if(tabRenderState.account && typeof window.renderAccountTab === 'function') window.renderAccountTab();
                        if(typeof window.renderOrdersUI === 'function') window.renderOrdersUI();
                        return;
                    }
                    if(payload.type === 'customer-live') {
                        if(!payload.profile) return;
                        currentUser = normalizeUserData({
                            ...(currentUser || {}),
                            ...(payload.profile || {}),
                            authUid: payload.authUid || (payload.profile && payload.profile.authUid) || ((currentUser && currentUser.authUid) || ''),
                            orders: Array.isArray(payload.profile && payload.profile.orders)
                                ? payload.profile.orders
                                : ((currentUser && currentUser.orders) || [])
                        });
                        saveState();
                        if(tabRenderState.account && typeof window.renderAccountTab === 'function') window.renderAccountTab();
                        if(typeof window.renderOrdersUI === 'function') window.renderOrdersUI();
                        return;
                    }
                    if(payload.type === 'orders-live') {
                        if(!currentUser || !currentUser.authUid) return;
                        currentUser = normalizeUserData({
                            ...currentUser,
                            orders: Array.isArray(payload.orders) ? payload.orders : (currentUser.orders || [])
                        });
                        saveState();
                        if(tabRenderState.account && typeof window.renderAccountTab === 'function') window.renderAccountTab();
                        if(typeof window.renderOrdersUI === 'function') window.renderOrdersUI();
                        return;
                    }
                    if(!currentUser || !currentUser.authUid) return;
                    const hasLiveBindings = !!(
                        window.retailFirebase
                        && typeof window.retailFirebase.hasLiveAccountBindings === 'function'
                        && window.retailFirebase.hasLiveAccountBindings(currentUser.authUid)
                    );
                    if(payload.type === 'customers-meta') {
                        if(hasLiveBindings) return;
                        scheduleRemoteAccountRefresh({ orders: false, customers: true, delay: 140 });
                        return;
                    }
                    if(payload.type === 'orders-meta') {
                        if(hasLiveBindings) return;
                        scheduleRemoteAccountRefresh({ orders: true, customers: false, delay: 140 });
                    }
                });
            }
            syncCustomerSessionFromFirebase({ clearIfSignedOut: true });
        });
        scheduleIdleTask(() => {
            if(window.introExperienceModule && typeof window.introExperienceModule.maybeAutoOpenWelcomePopup === 'function') {
                window.introExperienceModule.maybeAutoOpenWelcomePopup({ storageKey: 'ta_welcome_popup_seen_v2', delay: 700 });
            } else if(window.uiPc && typeof window.uiPc.maybeAutoOpenWelcomePopup === 'function') {
                window.uiPc.maybeAutoOpenWelcomePopup({ storageKey: 'ta_welcome_popup_seen_v2', delay: 700 });
            }
        }, 260);
        
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const targetId = item.getAttribute("data-target");
                goToTab(targetId);
            });
        });

        document.addEventListener('click', (event) => {
            if(!toggleSearchOpen) return;
            const header = document.getElementById('app-header');
            if(header && !header.contains(event.target)) hideSearchBar();
        });

        window.addEventListener('storage', (event) => {
            if([POS_CACHE_KEYS.appCatalog, 'ta_user', 'ta_orders_cache_v2', 'ta_customer_profile_v2'].includes(event.key)) {
                loadCachedCatalogFromApp();
                if(event.key === POS_CACHE_KEYS.appCatalog) refreshCatalogViews();
                if(event.key === 'ta_user') {
                    loadState();
                    if(tabRenderState.account && typeof window.renderAccountTab === 'function') window.renderAccountTab();
                }
            }
        });
        document.addEventListener('visibilitychange', () => {
            if(document.visibilityState !== 'visible') return;
            scheduleRemoteAccountRefresh({ customers: true, orders: true, delay: 120 });
        });
        window.addEventListener('focus', () => {
            scheduleRemoteAccountRefresh({ customers: true, orders: true, delay: 120 });
        });

        window.ensureTabInitialized = ensureTabInitialized;
    };
    if(document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", initializeAppCore, { once: true });
    } else {
        initializeAppCore();
    }

    let toggleSearchOpen = !!(document.getElementById('search-shell') && document.getElementById('search-shell').classList.contains('is-open'));
    window.goToTab = (targetId) => {
        const navItems = document.querySelectorAll(".nav-item");
        const tabContents = document.querySelectorAll(".tab-content");

        tabContents.forEach(tab => tab.classList.remove("active"));
        navItems.forEach(nav => nav.classList.remove("active-nav"));
        
        const targetTab = document.getElementById(targetId);
        if(targetTab) targetTab.classList.add("active");
        
        document.querySelectorAll(`.nav-item[data-target="${targetId}"]`).forEach(n => n.classList.add("active-nav"));
        
        if(typeof window.ensureTabInitialized === 'function') {
            if(targetId === 'tab-account') {
                window.ensureTabInitialized(targetId, true);
                scheduleIdleTask(async () => {
                    try {
                        await syncCustomerSessionFromFirebase({ clearIfSignedOut: true });
                        await syncOrdersFromFirebase({ force: true });
                    } catch(error) {
                        console.warn('Khong dong bo duoc tab tai khoan:', error);
                    } finally {
                        if(typeof window.renderAccountTab === 'function') window.renderAccountTab();
                    }
                });
            }
            else if(['tab-products', 'tab-sale', 'tab-intro'].includes(targetId)) window.ensureTabInitialized(targetId);
            else if(targetId === 'tab-home') {
                window.ensureTabInitialized(targetId);
                scheduleIdleTask(() => {
                    if(window.homeTabModule && typeof window.homeTabModule.render === 'function') window.homeTabModule.render();
                }, 60);
            }
        } else {
            if(targetId === 'tab-account' && typeof window.renderAccountTab === 'function') window.renderAccountTab();
            if(targetId === 'tab-products' && typeof window.renderProductsTabContent === 'function') window.renderProductsTabContent();
        }
        if((targetId === 'tab-home' || targetId === 'tab-products') && !productFeedState.initialSynced) {
            scheduleIdleTask(() => syncCatalogFromPosCache({ refreshViews: true }));
        }
        
        hideSearchBar();
        updateFloatingFilterButton();
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    window.openSearch = () => {
        const shell = document.getElementById('search-shell');
        const toggleButton = document.getElementById('search-toggle-btn');
        const searchInput = document.getElementById('search-input');
        toggleSearchOpen = true;
        if(shell) shell.classList.add('is-open');
        if(toggleButton) toggleButton.setAttribute('aria-expanded', 'true');
        if(window.__webNewSearchBootState) window.__webNewSearchBootState.open = true;
        if(searchInput) searchInput.focus();
    };

    window.toggleSearch = (event) => {
        if(event && typeof event.stopPropagation === 'function') event.stopPropagation();
        if(toggleSearchOpen) {
            hideSearchBar();
            return;
        }
        window.openSearch();
    };

    window.handleSearch = (keyword) => {
        const kw = keyword.toLowerCase();
        const filtered = getFilteredProducts(shopProducts);
        
        if(document.getElementById('tab-home').classList.contains('active')) {
            const bannerSec = document.getElementById('home-banner-section');
            const titleSec = { set innerText(value) { if(typeof window.updateHomeProductTitles === 'function') window.updateHomeProductTitles(value); } };
            if(kw.length > 0) {
                if(bannerSec) bannerSec.classList.add('hidden');
                titleSec.innerText = `Kết quả cho: "${keyword}"`;
            } else {
                if(bannerSec) bannerSec.classList.remove('hidden');
                titleSec.innerText = "Sản Phẩm Đề Xuất";
            }
            if(typeof window.renderHomeProductLists === 'function') window.renderHomeProductLists(filtered);
        } else {
            goToTab('tab-products');
            if(typeof window.ensureTabInitialized === 'function') window.ensureTabInitialized('tab-products', true);
            else if(typeof window.renderProductsTabContent === 'function') window.renderProductsTabContent();
            if(kw.length > 0 && typeof window.openSearch === 'function') window.openSearch();
        }
    };

    // Dùng chung cho Home & Products tab
    function renderProductsList(arr, containerId = 'product-container', sourceArray = shopProducts) {
        const container = document.getElementById(containerId);
        if(!container) return;
        const imageClass = containerId === 'products-tab-grid'
            ? 'w-full h-40 md:h-56 object-cover transition-transform duration-700 ease-out group-hover:scale-110'
            : 'w-full h-36 md:h-52 object-cover transition-transform duration-700 ease-out group-hover:scale-110';
        const emptyClass = containerId === 'products-tab-grid' ? 'col-span-2 md:col-span-4 xl:col-span-5 2xl:col-span-6' : 'col-span-2 md:col-span-4';
        const emptyMessage = productFeedState.error
            ? `<div class='${emptyClass} text-center py-10 text-red-400'><i class="fa-solid fa-circle-exclamation text-3xl mb-3 block opacity-80"></i><p>${productFeedState.error}</p><p class='text-xs text-gray-400 mt-2'>Kiểm tra rules public của catalog_public, router shard 1 và file firebase.js đang được nạp mới nhất.</p></div>`
            : `<div class='${emptyClass} text-center py-10 text-gray-400'>Không tìm thấy sản phẩm phù hợp.</div>`;
        
        const wishedIds = new Set((Array.isArray(wishlistData) ? wishlistData : []).map((item) => String(item || '').trim()).filter(Boolean));
        const renderSignature = buildProductRenderSignature(containerId, arr, wishedIds);
        if(container.dataset.renderSignature === renderSignature) {
            window[`context_${containerId}`] = sourceArray;
            return;
        }
        container.dataset.renderSignature = renderSignature;
        container.innerHTML = arr.length ? arr.map(prod => {
            const isWished = wishedIds.has(String((prod && prod.id) || '').trim());
            const isInStock = isProductInStock(prod);
            const badgeHtml = renderProductBadges(prod);
            const displayName = getProductDisplayName(prod);
            const pricingMeta = getProductPricingMeta(prod);
            const imageHtml = typeof window.renderResponsiveImageHtml === 'function'
                ? window.renderResponsiveImageHtml(
                    prod.img,
                    containerId === 'products-tab-grid' ? 'w800' : 'w600',
                    `${imageClass} media-stable`,
                    {
                        alt: displayName,
                        loading: 'lazy',
                        decoding: 'async',
                        pictureClass: 'block media-stable'
                    }
                )
                : `<img src="${getOptimizedImageUrl(prod.img, containerId === 'products-tab-grid' ? 'w800' : 'w600')}" loading="lazy" decoding="async" class="${imageClass} media-stable" />`;
            const cartBtnClass = isInStock
                ? 'bg-babyPink text-white w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:bg-pink-500 transition'
                : 'bg-gray-200 text-gray-400 w-8 h-8 rounded-full shadow-sm flex items-center justify-center opacity-60 cursor-not-allowed';
            return `
            <div class="catalog-product-card bg-white rounded-2xl shadow-sm border border-gray-100 relative group transition hover:shadow-md flex flex-col h-full overflow-hidden">
                <button id="wish-icon-${prod.id}" onclick="toggleWishlist(event, '${prod.id}')" class="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm transition ${isWished ? 'text-red-500' : 'text-gray-300'} hover:text-red-500"><i class="fa-solid fa-heart"></i></button>
                <div onclick="openFullscreenViewer('${prod.id}', '${containerId}')" class="cursor-pointer">
                    <div class="catalog-image-shell relative overflow-hidden bg-gray-100 shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)]">
                        ${badgeHtml}
                        ${imageHtml}
                    </div>
                    <div class="p-3">
                        <h4 class="text-sm font-bold text-gray-700 line-clamp-2 leading-tight mb-2 hover:text-babyPink transition">${displayName}</h4>
                    </div>
                </div>
                <div class="flex justify-between items-end mt-auto px-3 pb-3">
                    <div class="min-w-0 pr-2">
                        <span class="text-babyPink font-extrabold text-sm block">${pricingMeta.currentText || formatProductPriceLabel(prod)}</span>
                        ${pricingMeta.hasSale ? `<span class="text-[11px] text-gray-400 line-through block mt-0.5">${pricingMeta.originalText}</span>` : ''}
                    </div>
                    <div class="flex items-center gap-1.5 md:gap-2">
                        <button onclick="openProductDetail('${prod.id}')" class="bg-pink-50 text-babyPink w-8 h-8 md:w-auto md:px-3 rounded-full md:rounded-lg flex items-center justify-center font-bold text-xs shadow-sm hover:bg-pink-100 transition"><i class="fa-solid fa-eye md:hidden"></i><span class="hidden md:inline">Chi tiết</span></button>
                        <button onclick="${isInStock ? `openPopup('${prod.id}')` : `showToast('Sản phẩm hiện đã hết hàng.', 'warning')`}" class="${cartBtnClass}" ${isInStock ? '' : 'disabled'}><i class="fa-solid fa-cart-shopping text-sm"></i></button>
                    </div>
                </div>
            </div>`;
        }).join('') : emptyMessage;
        
        window[`context_${containerId}`] = sourceArray;
    }
    window.renderProductsList = renderProductsList;
    window.webNewAppBridge = Object.assign(window.webNewAppBridge || {}, {
        createDefaultProductFilters,
        getCartData: () => cartData,
        setCartData: (nextValue) => {
            cartData = Array.isArray(nextValue) ? nextValue : [];
            return cartData;
        },
        getWishlistData: () => wishlistData,
        setWishlistData: (nextValue) => {
            wishlistData = Array.isArray(nextValue) ? nextValue : [];
            return wishlistData;
        },
        getCurrentUser: () => currentUser,
        setCurrentUser: (nextValue) => {
            currentUser = nextValue || null;
            return currentUser;
        },
        getCurrentViewingProduct: () => currentViewingProduct,
        setCurrentViewingProduct: (nextValue) => {
            currentViewingProduct = nextValue || null;
            return currentViewingProduct;
        },
        getShopProducts: () => shopProducts,
        setShopProducts: (nextValue) => {
            shopProducts = Array.isArray(nextValue) ? nextValue : [];
            return shopProducts;
        },
        getFilterCategory: () => filterCategory,
        setFilterCategory: (nextValue) => {
            filterCategory = String(nextValue || '').trim();
            return filterCategory;
        },
        getCurrentTheme: () => currentTheme,
        setCurrentTheme: (nextValue) => {
            currentTheme = nextValue === 'dark' ? 'dark' : 'light';
            return currentTheme;
        },
        getProductFilters: () => productFilters,
        setProductFilters: (nextValue) => {
            productFilters = nextValue && typeof nextValue === 'object'
                ? { ...productFilters, ...nextValue }
                : productFilters;
            return productFilters;
        },
        replaceProductFilters: (nextValue) => {
            productFilters = nextValue && typeof nextValue === 'object'
                ? { ...createDefaultProductFilters(), ...nextValue }
                : createDefaultProductFilters();
            return productFilters;
        },
        getActiveProfileField: () => activeProfileField,
        setActiveProfileField: (nextValue) => {
            activeProfileField = String(nextValue || '').trim();
            return activeProfileField;
        },
        getHomeBannerIndex: () => homeBannerIndex,
        setHomeBannerIndex: (nextValue) => {
            homeBannerIndex = Math.max(0, Number(nextValue) || 0);
            return homeBannerIndex;
        },
        getHomeBannerTimer: () => homeBannerTimer,
        setHomeBannerTimer: (nextValue) => {
            homeBannerTimer = nextValue || null;
            return homeBannerTimer;
        },
        getTabRenderState: () => tabRenderState,
        getProductFeedState: () => productFeedState,
        getRemoteState: () => remoteState,
        saveState,
        loadState,
        scheduleIdleTask,
        formatMoney,
        parseMoney,
        hasRetailFirebase,
        getFirebaseReadyMessage,
        waitForRetailFirebaseReady,
        requestCatalogSyncAfterAuth: window.requestCatalogSyncAfterAuth,
        normalizeUserData,
        syncCurrentUserToCloud,
        syncOrdersFromFirebase,
        syncOrderDetailFromFirebase,
        isProductInStock,
        renderProductBadges,
        showToast,
        openConfirmModal,
        openModalShell,
        closeModalShell,
        getOrderTotals,
        getOptimizedImageUrl,
        normalizeKeyword,
        isAllCategory,
        getProductDisplayName,
        getProductUnit,
        getProductMinQty,
        getProductSalePercent,
        getProductPricingMeta,
        formatProductPriceLabel,
        getProductCategoryNames,
        getProductCategoryOptions,
        getCategoryVisual,
        getRecommendedProductsForUser,
        getProductVariantSummary,
        productMatchesCategory,
        getFilteredProducts,
        toInlineArgument,
        updateProductsCategoryButton,
        openStoreZalo,
        openStoreFacebook: window.openStoreFacebook,
        openStoreEmail: window.openStoreEmail,
        openStoreZaloGroup: window.openStoreZaloGroup,
        sendTelegramEvent,
        formatBirthdayDisplay,
        renderProductsList,
        defaultGuestName: DEFAULT_GUEST_NAME,
        storeContactPhone: STORE_CONTACT_PHONE,
        storeZaloPhone: STORE_ZALO_PHONE,
        passwordResetZaloPhone: PASSWORD_RESET_ZALO_PHONE,
        storeMapUrl: STORE_MAP_URL
    });
