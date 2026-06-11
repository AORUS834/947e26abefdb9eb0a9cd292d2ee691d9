// ==UserScript==
// @name         Paralives - Steam Workshop Direct Download
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Direct link using GitHub JSON mirror data with multilingual UI
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @match        https://steamcommunity.com/workshop/browse/*
// @match        https://steamcommunity.com/app/1118520/workshop/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      raw.githubusercontent.com
// @connect      api.steampowered.com
// ==/UserScript==

//
// Thanks to anonymous.54564 for the help with the script
//

(function() {
    'use strict';

    const PARALIVES_APPID = '1118520';
    const JSON_URL = 'https://raw.githubusercontent.com/AORUS834/947e26abefdb9eb0a9cd292d2ee691d9/refs/heads/main/files.json';

    const translations = {
        en: {
            loading:         '⏳ Loading...',
            checkingVersion: '⏳ Checking Version...',
            dbError:         '⚠️ Mirror DB Error',
            requestMod:      '➕ Request Mod',
            modNotListed:    'Mod not listed. Click to request.',
            download:        '✅ Download',
            downloadWarning: '⚠️ Download',
            modUpdated:      'MOD UP TO DATE',
            modOutdated:     'MOD OUTDATED',
            requestUpdate:   'Request Update on Forum',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        pt: {
            loading:         '⏳ Buscando...',
            checkingVersion: '⏳ Verificando versão...',
            dbError:         '⚠️ Erro na base de mirrors',
            requestMod:      '➕ Pedir Mod',
            modNotListed:    'Mod não listado. Clique para pedir.',
            download:        '✅ Baixar',
            downloadWarning: '⚠️ Baixar',
            modUpdated:      'MOD ATUALIZADO',
            modOutdated:     'MOD DESATUALIZADO',
            requestUpdate:   'Pedir atualização no fórum',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        es: {
            loading:         '⏳ Buscando...',
            checkingVersion: '⏳ Comprobando versión...',
            dbError:         '⚠️ Error de base de mirrors',
            requestMod:      '➕ Pedir mod',
            modNotListed:    'Mod no listado. Haz clic para pedirlo.',
            download:        '✅ Descargar',
            downloadWarning: '⚠️ Descargar',
            modUpdated:      'MOD ACTUALIZADO',
            modOutdated:     'MOD DESACTUALIZADO',
            requestUpdate:   'Pedir actualización en el foro',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        fr: {
            loading:         '⏳ Recherche...',
            checkingVersion: '⏳ Vérification de la version...',
            dbError:         '⚠️ Erreur de base de mirrors',
            requestMod:      '➕ Demander le mod',
            modNotListed:    'Mod non listé. Cliquez pour le demander.',
            download:        '✅ Télécharger',
            downloadWarning: '⚠️ Télécharger',
            modUpdated:      'MOD À JOUR',
            modOutdated:     'MOD OBSOLÈTE',
            requestUpdate:   'Demander une mise à jour sur le forum',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        de: {
            loading:         '⏳ Suche...',
            checkingVersion: '⏳ Version wird geprüft...',
            dbError:         '⚠️ Mirror-Datenbankfehler',
            requestMod:      '➕ Mod anfragen',
            modNotListed:    'Mod nicht gelistet. Zum Anfragen klicken.',
            download:        '✅ Herunterladen',
            downloadWarning: '⚠️ Herunterladen',
            modUpdated:      'MOD AKTUELL',
            modOutdated:     'MOD VERALTET',
            requestUpdate:   'Update im Forum anfragen',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        it: {
            loading:         '⏳ Ricerca...',
            checkingVersion: '⏳ Controllo versione...',
            dbError:         '⚠️ Errore database mirror',
            requestMod:      '➕ Richiedi mod',
            modNotListed:    'Mod non presente. Clicca per richiederla.',
            download:        '✅ Scarica',
            downloadWarning: '⚠️ Scarica',
            modUpdated:      'MOD AGGIORNATA',
            modOutdated:     'MOD NON AGGIORNATA',
            requestUpdate:   'Richiedi aggiornamento sul forum',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        nl: {
            loading:         '⏳ Zoeken...',
            checkingVersion: '⏳ Versie controleren...',
            dbError:         '⚠️ Mirror-databasefout',
            requestMod:      '➕ Mod aanvragen',
            modNotListed:    'Mod staat niet in de lijst. Klik om aan te vragen.',
            download:        '✅ Downloaden',
            downloadWarning: '⚠️ Downloaden',
            modUpdated:      'MOD IS UP-TO-DATE',
            modOutdated:     'MOD IS VEROUDERD',
            requestUpdate:   'Update aanvragen op het forum',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        pl: {
            loading:         '⏳ Szukanie...',
            checkingVersion: '⏳ Sprawdzanie wersji...',
            dbError:         '⚠️ Błąd bazy mirrorów',
            requestMod:      '➕ Poproś o mod',
            modNotListed:    'Mod nie jest na liście. Kliknij, aby poprosić.',
            download:        '✅ Pobierz',
            downloadWarning: '⚠️ Pobierz',
            modUpdated:      'MOD AKTUALNY',
            modOutdated:     'MOD NIEAKTUALNY',
            requestUpdate:   'Poproś o aktualizację na forum',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        ru: {
            loading:         '⏳ Поиск...',
            checkingVersion: '⏳ Проверка версии...',
            dbError:         '⚠️ Ошибка базы зеркал',
            requestMod:      '➕ Запросить мод',
            modNotListed:    'Мода нет в списке. Нажмите, чтобы запросить.',
            download:        '✅ Скачать',
            downloadWarning: '⚠️ Скачать',
            modUpdated:      'МОД АКТУАЛЕН',
            modOutdated:     'МОД УСТАРЕЛ',
            requestUpdate:   'Запросить обновление на форуме',
            labelSteam:      'Steam:',
            labelInsane:     'Зеркало:',
        },
        tr: {
            loading:         '⏳ Aranıyor...',
            checkingVersion: '⏳ Sürüm kontrol ediliyor...',
            dbError:         '⚠️ Mirror veritabanı hatası',
            requestMod:      '➕ Mod iste',
            modNotListed:    'Mod listede yok. İstemek için tıkla.',
            download:        '✅ İndir',
            downloadWarning: '⚠️ İndir',
            modUpdated:      'MOD GÜNCEL',
            modOutdated:     'MOD ESKİ',
            requestUpdate:   'Forumda güncelleme iste',
            labelSteam:      'Steam:',
            labelInsane:     'Mirror:',
        },
        zh: {
            loading:         '⏳ 正在查找...',
            checkingVersion: '⏳ 正在检查版本...',
            dbError:         '⚠️ 镜像数据库错误',
            requestMod:      '➕ 请求 Mod',
            modNotListed:    'Mod 未收录。点击请求。',
            download:        '✅ 下载',
            downloadWarning: '⚠️ 下载',
            modUpdated:      'MOD 已是最新',
            modOutdated:     'MOD 已过期',
            requestUpdate:   '在论坛请求更新',
            labelSteam:      'Steam:',
            labelInsane:     '镜像:',
        },
        zh_tw: {
            loading:         '⏳ 正在尋找...',
            checkingVersion: '⏳ 正在檢查版本...',
            dbError:         '⚠️ 鏡像資料庫錯誤',
            requestMod:      '➕ 請求 Mod',
            modNotListed:    'Mod 未收錄。點擊請求。',
            download:        '✅ 下載',
            downloadWarning: '⚠️ 下載',
            modUpdated:      'MOD 已是最新',
            modOutdated:     'MOD 已過期',
            requestUpdate:   '在論壇請求更新',
            labelSteam:      'Steam:',
            labelInsane:     '鏡像:',
        },
        ja: {
            loading:         '⏳ 検索中...',
            checkingVersion: '⏳ バージョン確認中...',
            dbError:         '⚠️ ミラーDBエラー',
            requestMod:      '➕ Modをリクエスト',
            modNotListed:    'Modが未登録です。クリックしてリクエスト。',
            download:        '✅ ダウンロード',
            downloadWarning: '⚠️ ダウンロード',
            modUpdated:      'MODは最新です',
            modOutdated:     'MODは古い可能性があります',
            requestUpdate:   'フォーラムで更新をリクエスト',
            labelSteam:      'Steam:',
            labelInsane:     'ミラー:',
        },
        ko: {
            loading:         '⏳ 검색 중...',
            checkingVersion: '⏳ 버전 확인 중...',
            dbError:         '⚠️ 미러 DB 오류',
            requestMod:      '➕ 모드 요청',
            modNotListed:    '모드가 목록에 없습니다. 클릭해서 요청하세요.',
            download:        '✅ 다운로드',
            downloadWarning: '⚠️ 다운로드',
            modUpdated:      'MOD 최신 상태',
            modOutdated:     'MOD 오래됨',
            requestUpdate:   '포럼에서 업데이트 요청',
            labelSteam:      'Steam:',
            labelInsane:     '미러:',
        },
    };

    const languageAliases = {
        'pt-br': 'pt',
        'pt-pt': 'pt',
        'es-es': 'es',
        'es-419': 'es',
        'fr-fr': 'fr',
        'de-de': 'de',
        'it-it': 'it',
        'nl-nl': 'nl',
        'pl-pl': 'pl',
        'ru-ru': 'ru',
        'tr-tr': 'tr',
        'zh-cn': 'zh',
        'zh-sg': 'zh',
        'zh-hans': 'zh',
        'zh-tw': 'zh_tw',
        'zh-hk': 'zh_tw',
        'zh-hant': 'zh_tw',
        'ja-jp': 'ja',
        'ko-kr': 'ko',
    };

    function getScriptLanguage() {
        const rawLang = (
            document.documentElement.lang ||
            document.querySelector('html')?.getAttribute('lang') ||
            navigator.language ||
            'en'
        ).toLowerCase();

        const normalized = rawLang.replace('_', '-');

        if (translations[normalized]) return normalized;
        if (languageAliases[normalized]) return languageAliases[normalized];

        const baseLang = normalized.split('-')[0];
        return translations[baseLang] ? baseLang : 'en';
    }

    const t = translations[getScriptLanguage()];

    function isParalivesPage() {
        const url = window.location.href;
        if (url.includes(`appid=${PARALIVES_APPID}`) || url.includes(`/app/${PARALIVES_APPID}/`)) return true;
        if (document.querySelector(`a[href*="${PARALIVES_APPID}"]`) || document.querySelector(`[onclick*="${PARALIVES_APPID}"]`)) return true;
        return false;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .insane-custom-btn {
            display: inline-flex !important; align-items: center !important; justify-content: center !important;
            padding: 0 15px !important; font-size: 13px !important; font-weight: bold !important;
            border-radius: 2px !important; text-decoration: none !important; white-space: nowrap !important;
            transition: all 0.2s ease-in-out !important; box-sizing: border-box !important;
            font-family: "Motiva Sans", Arial, Helvetica, sans-serif !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important; gap: 8px !important;
            z-index: 99 !important; height: 34px !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important; margin: 0 !important;
        }
        .insane-custom-btn-compact { padding: 0 8px !important; font-size: 11px !important; border-radius: 2px !important; gap: 4px !important; height: 24px !important; }
        .insane-custom-btn:hover { filter: brightness(1.15) !important; }
        .insane-custom-btn:active { filter: brightness(0.9) !important; }

        .insane-state-loading { background: linear-gradient(to bottom, #343f4d 5%, #222933 95%) !important; color: #acb2b8 !important; border: 1px solid #455366 !important; cursor: wait !important; }
        .insane-state-info { background: linear-gradient(to bottom, #1a3c54 5%, #122436 95%) !important; color: #66c0f4 !important; border: 1px solid #2b5575 !important; cursor: pointer !important; }
        .insane-state-success { background: linear-gradient(to bottom, #3f5c1e 5%, #2c4015 95%) !important; color: #A3E33B !important; border: 1px solid #5a852a !important; cursor: pointer !important; }
        .insane-state-warning { background: linear-gradient(to bottom, #6b410c 5%, #452a08 95%) !important; color: #F59E0B !important; border: 1px solid #995c10 !important; cursor: pointer !important; }
        .insane-state-error { background: linear-gradient(to bottom, #612222 5%, #3d1616 95%) !important; color: #ff6b6b !important; border: 1px solid #8c3232 !important; cursor: pointer !important; }

        .insane-btn-group { position: relative; display: inline-flex; border-radius: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s; align-items: center; height: 100%; }
        .insane-btn-group:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.4); }
        .insane-btn-main { border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important; border-right: 1px solid rgba(0,0,0,0.4) !important; margin: 0 !important; box-shadow: none !important; }
        .insane-btn-main:hover { transform: none !important; box-shadow: none !important; }
        .insane-btn-arrow { border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important; padding: 0 8px !important; margin: 0 !important; box-shadow: none !important; }
        .insane-btn-arrow:hover { transform: none !important; box-shadow: none !important; }

        .insane-global-dropdown { position: fixed !important; background: #171a21; border: 1px solid #3d4450; border-radius: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.9); display: none; flex-direction: column; min-width: 220px; z-index: 2147483647 !important; overflow: hidden; margin: 0 !important; }
        .insane-global-dropdown.show { display: flex; }
        .insane-global-dropdown:popover-open { bottom: auto; right: auto; margin: 0 !important; }
        .insane-global-dropdown a { padding: 10px 12px; color: #acb2b8; text-decoration: none; font-size: 12px; transition: background 0.2s; font-family: "Motiva Sans", sans-serif; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .insane-global-dropdown a:hover { background: #3d4450; color: #fff; }

        .insane-custom-tooltip { position: fixed !important; margin: 0 !important; z-index: 2147483647 !important; background: #171a21 !important; border: 1px solid #3d4450 !important; border-radius: 6px !important; padding: 12px !important; color: #acb2b8 !important; font-family: "Motiva Sans", Arial, sans-serif !important; font-size: 13px !important; box-shadow: 0 8px 16px rgba(0,0,0,0.9) !important; pointer-events: none !important; opacity: 0; transition: opacity 0.1s; white-space: nowrap !important; }
        .insane-custom-tooltip.show { opacity: 1 !important; }
        .insane-custom-tooltip:popover-open { bottom: auto; right: auto; margin: 0 !important; }
        
        .insane-tooltip-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #3d4450; display: flex; align-items: center; gap: 6px; }
        .insane-tooltip-success { color: #A3E33B; } .insane-tooltip-warning { color: #F59E0B; } .insane-tooltip-error { color: #ff6b6b; }
        .insane-tooltip-row { margin: 4px 0; } .insane-tooltip-label { color: #8f98a0; display: inline-block; width: 60px; } .insane-tooltip-value { color: #E2E8F0; font-weight: 500; }

        #insane-widget-main { display: inline-flex; height: 34px; align-items: center; }
        .insane-widget-container { position: relative; z-index: 10; display: inline-flex; align-items: center; }
        .insane-widget-container:hover { z-index: 9999; }
    `;
    document.head.appendChild(style);

    let popoverHideTimeouts = new WeakMap();

    function safeShowPopover(el) {
        if (typeof el.showPopover === 'function') {
            if (popoverHideTimeouts.has(el)) {
                clearTimeout(popoverHideTimeouts.get(el));
                popoverHideTimeouts.delete(el);
            }
            try { if (!el.matches(':popover-open')) el.showPopover(); } catch(e) {}
        }
    }

    function safeHidePopover(el, delay = 0) {
        if (typeof el.hidePopover === 'function') {
            if (popoverHideTimeouts.has(el)) {
                clearTimeout(popoverHideTimeouts.get(el));
            }
            if (delay > 0) {
                const timeoutId = setTimeout(() => {
                    try { if (el.matches(':popover-open')) el.hidePopover(); } catch(e) {}
                    popoverHideTimeouts.delete(el);
                }, delay);
                popoverHideTimeouts.set(el, timeoutId);
            } else {
                try { if (el.matches(':popover-open')) el.hidePopover(); } catch(e) {}
                popoverHideTimeouts.delete(el);
            }
        }
    }

    const dropdownGlobal = document.createElement('div');
    dropdownGlobal.className = 'insane-global-dropdown';
    if (typeof dropdownGlobal.showPopover === 'function') {
        dropdownGlobal.setAttribute('popover', 'manual');
    }

    document.addEventListener('click', (e) => {
        const arrowBtn = e.target.closest('.insane-btn-arrow');
        if (arrowBtn) {
            e.preventDefault(); e.stopPropagation();

            if (dropdownGlobal.classList.contains('show') && dropdownGlobal.lastArrow === arrowBtn) {
                dropdownGlobal.classList.remove('show');
                safeHidePopover(dropdownGlobal);
                dropdownGlobal.lastArrow = null;
                return;
            }

            const dialogParent = arrowBtn.closest('dialog');
            const rect = arrowBtn.getBoundingClientRect();
            let topPos = rect.bottom;
            let leftPos = rect.right - 220;

            if (dialogParent) {
                dialogParent.appendChild(dropdownGlobal);
            } else {
                document.body.appendChild(dropdownGlobal);
            }

            if (typeof dropdownGlobal.showPopover !== 'function') {
                if (dialogParent) {
                    const style = window.getComputedStyle(dialogParent);
                    if (style.transform !== 'none') {
                        const dialogRect = dialogParent.getBoundingClientRect();
                        topPos -= dialogRect.top;
                        leftPos -= dialogRect.left;
                    }
                }
            }

            dropdownGlobal.innerHTML = `
                <a href="https://cs.rin.ru/forum/viewtopic.php?f=10&t=158692" class="insane-bg-link"><span>💬</span> ${t.requestUpdate}</a>
            `;

            dropdownGlobal.style.top = topPos + 'px';
            dropdownGlobal.style.left = leftPos + 'px';

            dropdownGlobal.classList.add('show');
            safeShowPopover(dropdownGlobal);
            dropdownGlobal.lastArrow = arrowBtn;
            return;
        }

        if (!e.target.closest('.insane-global-dropdown')) {
            dropdownGlobal.classList.remove('show');
            safeHidePopover(dropdownGlobal);
            dropdownGlobal.lastArrow = null;
        }

        const insaneLink = e.target.closest('a.insane-custom-btn, a.insane-bg-link');
        if (insaneLink && insaneLink.href) {
            e.preventDefault(); e.stopPropagation();
            GM_openInTab(insaneLink.href, { active: false, insert: true });
            dropdownGlobal.classList.remove('show');
            safeHidePopover(dropdownGlobal);
            dropdownGlobal.lastArrow = null;
        }
    });

    window.addEventListener('scroll', () => {
        dropdownGlobal.classList.remove('show');
        safeHidePopover(dropdownGlobal);
        dropdownGlobal.lastArrow = null;
    }, { passive: true });

    const tooltipGlobal = document.createElement('div');
    tooltipGlobal.className = 'insane-custom-tooltip';
    if (typeof tooltipGlobal.showPopover === 'function') {
        tooltipGlobal.setAttribute('popover', 'manual');
    }
    let hoverTimer;

    function bindTooltip(element, htmlContent) {
        element.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                const dialogParent = element.closest('dialog');
                
                if (dialogParent) {
                    dialogParent.appendChild(tooltipGlobal);
                } else {
                    document.body.appendChild(tooltipGlobal);
                }

                tooltipGlobal.innerHTML = htmlContent;
                tooltipGlobal.classList.add('show');
                safeShowPopover(tooltipGlobal);
            }, 300);
        });

        element.addEventListener('mousemove', (e) => {
            let left = e.clientX + 15, top = e.clientY + 15;
            const tooltipWidth = tooltipGlobal.offsetWidth || 200, tooltipHeight = tooltipGlobal.offsetHeight || 100;

            if (left + tooltipWidth > window.innerWidth - 10) left = e.clientX - tooltipWidth - 15;
            if (top + tooltipHeight > window.innerHeight - 10) top = e.clientY - tooltipHeight - 15;

            if (typeof tooltipGlobal.showPopover !== 'function') {
                const dialogParent = element.closest('dialog');
                if (dialogParent) {
                    const style = window.getComputedStyle(dialogParent);
                    if (style.transform !== 'none') {
                        const dialogRect = dialogParent.getBoundingClientRect();
                        left -= dialogRect.left;
                        top -= dialogRect.top;
                    }
                }
            }

            tooltipGlobal.style.left = left + 'px';
            tooltipGlobal.style.top = top + 'px';
        });

        element.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            tooltipGlobal.classList.remove('show');
            safeHidePopover(tooltipGlobal, 100); 
        });
    }

    let steamDateCache = {};
    let pendingSteamIDs = new Set();
    let isFetchingBatch = false;

    setInterval(() => {
        if (!isParalivesPage()) return;
        if (isFetchingBatch || pendingSteamIDs.size === 0) return;
        isFetchingBatch = true;
        const idsToFetch = Array.from(pendingSteamIDs).slice(0, 100);

        let dataString = `itemcount=${idsToFetch.length}`;
        idsToFetch.forEach((id, index) => dataString += `&publishedfileids[${index}]=${id}`);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/',
            data: dataString,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.response?.publishedfiledetails) {
                        data.response.publishedfiledetails.forEach(details => {
                            if (details.publishedfileid) {
                                const timestamp = details.time_updated || details.time_created;
                                steamDateCache[details.publishedfileid] = timestamp ? new Date(timestamp * 1000) : 'NO_DATE';
                            }
                        });
                    }
                } catch(e) {}

                idsToFetch.forEach(id => { pendingSteamIDs.delete(id); document.dispatchEvent(new Event(`SteamDateResolved_${id}`)); });
                isFetchingBatch = false;
            },
            onerror: () => { idsToFetch.forEach(id => { pendingSteamIDs.delete(id); document.dispatchEvent(new Event(`SteamDateResolved_${id}`)); }); isFetchingBatch = false; }
        });
    }, 500);

    let insaneDatabaseCache = null;
    let isFetchingInsane = false;
    let fetchQueue = [];

    function finishInsaneFetch(result) {
        insaneDatabaseCache = result;
        fetchQueue.forEach(cb => cb(insaneDatabaseCache));
        fetchQueue = [];
        isFetchingInsane = false;
    }

    function getIdFromName(name) {
        // JSON file names look like: "3739685193 - Candle Decor.7z"
        const match = String(name || '').match(/^\s*(\d{6,})/);
        return match ? match[1] : null;
    }

    function normalizeInsaneFile(file) {
        const idSteam = getIdFromName(file?.name);
        const link = file?.link || file?.url;
        if (!idSteam || !link) return null;

        return {
            id: idSteam,
            name: file.name || '',
            link,
            uploaded: file.uploaded || null
        };
    }

    function fetchInsaneData(callback) {
        if (insaneDatabaseCache !== null) { callback(insaneDatabaseCache); return; }
        fetchQueue.push(callback);
        if (isFetchingInsane) return;
        isFetchingInsane = true;

        GM_xmlhttpRequest({
            method: 'GET',
            url: JSON_URL,
            onload: function(response) {
                if (response.status < 200 || response.status >= 300) {
                    finishInsaneFetch(null);
                    return;
                }

                try {
                    const json = JSON.parse(response.responseText);
                    const files = Array.isArray(json?.files) ? json.files : [];
                    const db = {};

                    files.forEach(file => {
                        const normalized = normalizeInsaneFile(file);
                        if (normalized) {
                            db[normalized.id] = {
                                link: normalized.link,
                                uploaded: normalized.uploaded,
                                name: normalized.name
                            };
                        }
                    });

                    finishInsaneFetch(db);
                } catch (e) {
                    console.error('[Insane] Failed to parse GitHub JSON:', e);
                    finishInsaneFetch(null);
                }
            },
            onerror: function(error) {
                console.error('[Insane] Failed to fetch GitHub JSON:', error);
                finishInsaneFetch(null);
            }
        });
    }

    function parseDataInsane(dataString) {
        // GitHub JSON example: "2026-06-06 17:16:48". Host time is GMT+1.
        if (!dataString) return null;
        const match = String(dataString).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!match) return null;

        const year = Number(match[1]);
        const monthIndex = Number(match[2]) - 1;
        const day = Number(match[3]);
        const hour = Number(match[4]);
        const minute = Number(match[5]);
        const second = Number(match[6] || 0);

        return new Date(Date.UTC(year, monthIndex, day, hour - 1, minute, second));
    }

    function renderWidget(container, modId, isCard) {
        const cClass = isCard ? 'insane-custom-btn-compact' : '';
        container.innerHTML = `<a class="insane-custom-btn ${cClass} insane-state-loading">${t.loading}</a>`;

        fetchInsaneData((db) => {
            if (db === null) { container.innerHTML = `<a class="insane-custom-btn ${cClass} insane-state-warning">${t.dbError}</a>`; return; }
            if (!db[modId]) {
                container.innerHTML = `<a href="https://cs.rin.ru/forum/viewtopic.php?f=10&t=158692" class="insane-custom-btn ${cClass} insane-state-error">${t.requestMod}</a>`;
                bindTooltip(container.firstElementChild, `<div class="insane-tooltip-title insane-tooltip-error"><span>❌</span> ${t.modNotListed}</div>`);
                return;
            }

            const modData = db[modId];
            const dataInsane = parseDataInsane(modData.uploaded);

            function drawDateComparison() {
                const dataSteam = steamDateCache[modId];
                if (!dataSteam) { container.innerHTML = `<a class="insane-custom-btn ${cClass} insane-state-loading">${t.checkingVersion}</a>`; pendingSteamIDs.add(modId); return; }

                const strInsane = dataInsane ? dataInsane.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'}) : 'N/A';
                const strSteam = (dataSteam && dataSteam !== 'NO_DATE') ? dataSteam.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'}) : 'N/A';

                if (dataSteam === 'NO_DATE' || dataInsane >= dataSteam) {
                    container.innerHTML = `<a href="${modData.link}" class="insane-custom-btn ${cClass} insane-state-success">${t.download}</a>`;
                    bindTooltip(container.firstElementChild, `
                        <div class="insane-tooltip-title insane-tooltip-success"><span>✅</span> ${t.modUpdated}</div>
                        <div class="insane-tooltip-row"><span class="insane-tooltip-label">${t.labelSteam}</span> <span class="insane-tooltip-value">${strSteam}</span></div>
                        <div class="insane-tooltip-row"><span class="insane-tooltip-label">${t.labelInsane}</span> <span class="insane-tooltip-value">${strInsane}</span></div>
                    `);
                } else {
                    container.innerHTML = `
                        <div class="insane-btn-group">
                            <a href="${modData.link}" class="insane-custom-btn ${cClass} insane-state-warning insane-btn-main">${t.downloadWarning}</a>
                            <button class="insane-custom-btn ${cClass} insane-state-warning insane-btn-arrow">▼</button>
                        </div>
                    `;
                    bindTooltip(container.querySelector('.insane-btn-group'), `
                        <div class="insane-tooltip-title insane-tooltip-warning"><span>⚠️</span> ${t.modOutdated}</div>
                        <div class="insane-tooltip-row"><span class="insane-tooltip-label">${t.labelSteam}</span> <span class="insane-tooltip-value">${strSteam}</span></div>
                        <div class="insane-tooltip-row"><span class="insane-tooltip-label">${t.labelInsane}</span> <span class="insane-tooltip-value">${strInsane}</span></div>
                    `);
                }
            }
            drawDateComparison();
            document.addEventListener(`SteamDateResolved_${modId}`, drawDateComparison);
        });
    }

    setInterval(() => {
        if (!isParalivesPage()) return;

        if (window.location.href.includes("steamcommunity.com/sharedfiles/filedetails")) {
            const modId = new URLSearchParams(window.location.search).get('id');
            const steamBtn = document.getElementById('SubscribeItemBtn');
            const subscribeControls = steamBtn ? steamBtn.parentElement : null;

            if (modId && subscribeControls && !document.getElementById('insane-widget-main')) {
                const gameArea = subscribeControls.parentElement;
                if (gameArea && gameArea.classList.contains('game_area_purchase_game')) {
                    gameArea.style.display = 'flex';
                    gameArea.style.flexWrap = 'wrap';
                    gameArea.style.alignItems = 'center';
                    gameArea.style.justifyContent = 'space-between';
                    gameArea.style.gap = '15px';

                    const titleH1 = gameArea.querySelector('h1');
                    if (titleH1) {
                        titleH1.style.float = 'none';
                        titleH1.style.width = 'auto';
                        titleH1.style.flex = '1 1 auto';
                        titleH1.style.margin = '0';
                    }
                }

                subscribeControls.style.float = 'none';
                subscribeControls.style.display = 'flex';
                subscribeControls.style.flexWrap = 'wrap';
                subscribeControls.style.alignItems = 'center';
                subscribeControls.style.justifyContent = 'flex-end';
                subscribeControls.style.gap = '10px';
                
                steamBtn.style.flexShrink = '0';
                steamBtn.style.margin = '0';

                const container = document.createElement('div');
                container.id = 'insane-widget-main';
                steamBtn.insertAdjacentElement('beforebegin', container);
                renderWidget(container, modId, false);
            }
        }

        document.querySelectorAll('h2 a[href*="sharedfiles/filedetails/?id="]').forEach(titleLink => {
            let modalRoot = titleLink;
            for(let i = 0; i < 6; i++) { if(modalRoot.parentElement) modalRoot = modalRoot.parentElement; }

            const subscribeBtn = Array.from(modalRoot.querySelectorAll('button')).find(b => b.getAttribute('data-accent-color') === 'green' || b.querySelector('.SVGIcon_Plus'));
            if (!subscribeBtn) return;

            const anchor = subscribeBtn.closest('.tool-tip-source') || subscribeBtn;
            if (!anchor.parentElement.querySelector('.insane-widget-container')) {
                const container = document.createElement('div');
                container.className = 'insane-widget-container';
                container.style.marginRight = '8px';

                anchor.insertAdjacentElement('beforebegin', container);
                const modId = new URL(titleLink.href).searchParams.get('id');
                if (modId) renderWidget(container, modId, false);
            }
        });

        document.querySelectorAll('.SVGIcon_MagnifyingGlass').forEach(zoomIcon => {
            const actionRow = (zoomIcon.closest('[role="button"]') || zoomIcon.parentElement)?.parentElement;
            if (!actionRow || actionRow.querySelector('.insane-widget-container')) return;

            let cardContainer = actionRow.parentElement, modLink = null;
            for (let i = 0; i < 5; i++) {
                if (!cardContainer) break;
                modLink = cardContainer.querySelector('a[href*="sharedfiles/filedetails/?id="]');
                if (modLink) break;
                cardContainer = cardContainer.parentElement;
            }
            if (!modLink || modLink.parentElement.tagName === 'H2') return;

            actionRow.style.setProperty('opacity', '1', 'important');
            actionRow.style.setProperty('visibility', 'visible', 'important');
            actionRow.style.display = 'flex';
            actionRow.style.alignItems = 'center';
            actionRow.style.gap = '6px';

            const container = document.createElement('div');
            container.className = 'insane-widget-container';
            actionRow.prepend(container);

            const modId = new URL(modLink.href).searchParams.get('id');
            if (modId) renderWidget(container, modId, true);
        });

    }, 1000);
})();
