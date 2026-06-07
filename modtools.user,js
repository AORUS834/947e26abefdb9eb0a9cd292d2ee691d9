// ==UserScript==
// @name         Insane18 Paralives Mod Tools
// @namespace    https://steamcommunity.com/
// @version      1.4.0
// @description  Adds a mod mirror download button on Steam Workshop pages when the ID exists in the JSON.
// @include      /^https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/?\?id=\d+/
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const JSON_URL = 'https://raw.githubusercontent.com/AORUS834/947e26abefdb9eb0a9cd292d2ee691d9/refs/heads/main/files.json';

    const workshopId = new URL(location.href).searchParams.get('id');

    if (!workshopId) return;

    addStyle();

    const box = addStatusBox(`Checking mod mirror for Steam ID ${workshopId}...`);

    function requestJson(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload(response) {
                    if (response.status < 200 || response.status >= 300) {
                        reject(new Error(`HTTP ${response.status}`));
                        return;
                    }

                    try {
                        resolve(JSON.parse(response.responseText));
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror(error) {
                    reject(error);
                }
            });
        });
    }

    function cleanText(value) {
        return String(value || '')
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getIdFromName(name) {
        // Example:
        // "3739685193 - Candle Decor.7z" -> "3739685193"
        const match = String(name || '').match(/^\s*(\d{6,})/);
        return match ? match[1] : null;
    }

    function findFile(json, id) {
        if (!json || !Array.isArray(json.files)) return null;

        return json.files.find(file => getIdFromName(file.name) === id) || null;
    }

    function getSteamWorkshopDateNow() {
        const blocks = Array.from(document.querySelectorAll('.rightDetailsBlock'));

        for (const block of blocks) {
            const labels = Array.from(block.querySelectorAll('.detailsStatLeft'))
                .map(el => cleanText(el.textContent));

            const values = Array.from(block.querySelectorAll('.detailsStatRight'))
                .map(el => cleanText(el.textContent));

            let posted = null;
            let updated = null;

            for (let i = 0; i < labels.length; i++) {
                const label = labels[i].toLowerCase().replace(':', '');
                const value = values[i] || null;

                if (label === 'posted') {
                    posted = value;
                }

                if (label === 'updated') {
                    updated = value;
                }
            }

            if (updated) {
                return {
                    type: 'Updated',
                    value: updated
                };
            }

            if (posted) {
                return {
                    type: 'Posted',
                    value: posted
                };
            }
        }

        return null;
    }

    function waitForSteamWorkshopDate(timeoutMs = 8000) {
        return new Promise(resolve => {
            const existing = getSteamWorkshopDateNow();

            if (existing) {
                resolve(existing);
                return;
            }

            const started = Date.now();

            const timer = setInterval(() => {
                const found = getSteamWorkshopDateNow();

                if (found) {
                    clearInterval(timer);
                    resolve(found);
                    return;
                }

                if (Date.now() - started >= timeoutMs) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 250);
        });
    }

    function parseJsonUploaded(uploaded) {
        // JSON example:
        // "2026-06-06 17:16:48"
        //
        // Host time is GMT+1, but Steam only shows a simple display time.
        // We compare the visible date/time values without seconds.
        const match = String(uploaded || '').match(
            /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
        );

        if (!match) return null;

        return {
            year: Number(match[1]),
            month: Number(match[2]),
            day: Number(match[3]),
            hour: Number(match[4]),
            minute: Number(match[5])
        };
    }

    function formatJsonUploadedLikeSteam(uploaded, includeYear = false) {
        const parts = parseJsonUploaded(uploaded);
        if (!parts) return null;

        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const suffix = parts.hour >= 12 ? 'pm' : 'am';
        const hour12 = parts.hour % 12 || 12;
        const minute = String(parts.minute).padStart(2, '0');
        const yearText = includeYear ? `, ${parts.year}` : '';

        return `${parts.day} ${months[parts.month - 1]}${yearText} @ ${hour12}:${minute}${suffix}`;
    }

    function parseSteamDate(value, defaultYear) {
        // Handles:
        // "29 May @ 9:36pm"
        // "29 May, 2026 @ 9:36pm"
        const match = cleanText(value).match(
            /^(\d{1,2})\s+([A-Za-z]{3,9})(?:,\s*(\d{4}))?\s+@\s+(\d{1,2}):(\d{2})(am|pm)$/i
        );

        if (!match) return null;

        const monthMap = {
            jan: 1,
            january: 1,
            feb: 2,
            february: 2,
            mar: 3,
            march: 3,
            apr: 4,
            april: 4,
            may: 5,
            jun: 6,
            june: 6,
            jul: 7,
            july: 7,
            aug: 8,
            august: 8,
            sep: 9,
            sept: 9,
            september: 9,
            oct: 10,
            october: 10,
            nov: 11,
            november: 11,
            dec: 12,
            december: 12
        };

        const month = monthMap[match[2].toLowerCase()];
        if (!month) return null;

        let hour = Number(match[4]);
        const ampm = match[6].toLowerCase();

        if (ampm === 'pm' && hour !== 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;

        return {
            year: match[3] ? Number(match[3]) : defaultYear,
            month,
            day: Number(match[1]),
            hour,
            minute: Number(match[5])
        };
    }

    function partsToMinutes(parts) {
        if (!parts) return null;

        return Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute
        );
    }

    function compareSteamAndUpload(steamDateText, jsonUploaded) {
        const jsonParts = parseJsonUploaded(jsonUploaded);
        if (!jsonParts) return 'unknown';

        const steamParts = parseSteamDate(steamDateText, jsonParts.year);
        if (!steamParts) return 'unknown';

        const steamTime = partsToMinutes(steamParts);
        const uploadTime = partsToMinutes(jsonParts);

        if (steamTime === null || uploadTime === null) {
            return 'unknown';
        }

        // Important:
        // Only warn if the mirror upload is BEFORE the Steam Posted/Updated time.
        //
        // Steam:    6 Jun @ 4:59pm
        // Uploaded: 6 Jun @ 5:16pm
        // Result: up to date
        if (uploadTime < steamTime) {
            return 'outdated';
        }

        return 'up_to_date';
    }

    function addStatusBox(text) {
        const el = document.createElement('div');
        el.id = 'tm-modmirror-box';
        el.textContent = text;

        const target =
            document.querySelector('.rightDetailsBlock') ||
            document.querySelector('.workshopItemDetails') ||
            document.querySelector('.workshopItemControls') ||
            document.body;

        target.prepend(el);
        return el;
    }

    function showDownload(file, steamDate, uploadedText) {
        box.innerHTML = `
            <div id="tm-modmirror-title">Mod mirror found</div>

            <a id="tm-modmirror-button" href="${escapeHtml(file.link)}" target="_blank" rel="noopener noreferrer">
                Download Mod
            </a>

            <div id="tm-modmirror-meta">
                <strong>File:</strong> ${escapeHtml(file.name || '')}<br>
                <strong>Steam ${escapeHtml(steamDate.type)}:</strong> ${escapeHtml(steamDate.value)}<br>
                <strong>Uploaded:</strong> ${escapeHtml(uploadedText)}
            </div>
        `;
    }

    function showOutdatedDownload(file, steamDate, uploadedText) {
        box.innerHTML = `
            <div id="tm-modmirror-title" class="tm-modmirror-warning-title">
                Mod mirror found, but it may not be up to date
            </div>

            <a id="tm-modmirror-button" class="tm-modmirror-warning-button" href="${escapeHtml(file.link)}" target="_blank" rel="noopener noreferrer">
                Download Anyway
            </a>

            <div id="tm-modmirror-warning-note">
                Warning: the Steam Workshop item was updated after this mod upload, so this download may be outdated. <a href="https://cs.rin.ru/forum/posting.php?mode=reply&f=10&t=158692">Request update!</a>
            </div>

            <div id="tm-modmirror-meta">
                <strong>File:</strong> ${escapeHtml(file.name || '')}<br>
                <strong>Steam ${escapeHtml(steamDate.type)}:</strong> ${escapeHtml(steamDate.value)}<br>
                <strong>Uploaded:</strong> ${escapeHtml(uploadedText)}
            </div>
        `;
    }

    function showUnknownDateDownload(file, steamDate, uploadedText) {
        box.innerHTML = `
            <div id="tm-modmirror-title" class="tm-modmirror-warning-title">
                Mod mirror found, but the date could not be checked
            </div>

            <a id="tm-modmirror-button" class="tm-modmirror-warning-button" href="${escapeHtml(file.link)}" target="_blank" rel="noopener noreferrer">
                Download Anyway
            </a>

            <div id="tm-modmirror-warning-note">
                Warning: the script could not compare the Steam date with the mod upload date. This download may be outdated.
            </div>

            <div id="tm-modmirror-meta">
                <strong>File:</strong> ${escapeHtml(file.name || '')}<br>
                <strong>Steam ${escapeHtml(steamDate.type)}:</strong> ${escapeHtml(steamDate.value)}<br>
                <strong>Uploaded:</strong> ${escapeHtml(uploadedText || 'Invalid upload date')}
            </div>
        `;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function addStyle() {
        const style = document.createElement('style');
        style.textContent = `
            #tm-modmirror-box {
                margin: 12px 0;
                padding: 12px;
                background: #16202d;
                border: 1px solid #3d6f8f;
                border-radius: 4px;
                color: #c7d5e0;
                font-size: 13px;
                line-height: 1.4;
                z-index: 99999;
            }

            #tm-modmirror-title {
                margin-bottom: 8px;
                font-weight: bold;
                color: #66c0f4;
            }

            #tm-modmirror-button {
                display: block;
                margin: 8px 0;
                padding: 10px 14px;
                text-align: center;
                border-radius: 3px;
                color: white !important;
                text-decoration: none !important;
                font-size: 15px;
                font-weight: bold;
                background: linear-gradient(to right, #47bfff 5%, #1a44c2 95%);
            }

            #tm-modmirror-button:hover {
                filter: brightness(1.15);
            }

            #tm-modmirror-meta {
                margin-top: 8px;
                color: #acb2b8;
                word-break: break-word;
                font-size: 12px;
            }

            .tm-modmirror-warning-title {
                color: #ffb347 !important;
            }

            .tm-modmirror-warning-button {
                background: linear-gradient(to right, #ffb347 5%, #d87900 95%) !important;
            }

            #tm-modmirror-warning-note {
                margin: 8px 0;
                padding: 8px;
                background: rgba(255, 179, 71, 0.12);
                border: 1px solid rgba(255, 179, 71, 0.55);
                border-radius: 3px;
                color: #ffd39a;
                font-size: 12px;
                line-height: 1.35;
            }
            #tm-modmirror-warning-note a{
                text-decoration-line: underline;
                color: #ffd39a;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    async function main() {
        try {
            const steamDate = await waitForSteamWorkshopDate();

            if (!steamDate) {
                box.textContent = 'Could not find Steam Posted or Updated date.';
                console.log('[ModMirror] rightDetailsBlock count:', document.querySelectorAll('.rightDetailsBlock').length);
                console.log('[ModMirror] detailsStatLeft:', Array.from(document.querySelectorAll('.detailsStatLeft')).map(el => el.textContent.trim()));
                console.log('[ModMirror] detailsStatRight:', Array.from(document.querySelectorAll('.detailsStatRight')).map(el => el.textContent.trim()));
                return;
            }

            const json = await requestJson(JSON_URL);
            const file = findFile(json, workshopId);

            if (!file) {
                box.innerHTML = `No mod mirror found for Steam ID ${workshopId}. <a href="https://cs.rin.ru/forum/posting.php?mode=reply&f=10&t=158692">Request it!</a>`;
                return;
            }

            if (!file.link) {
                box.textContent = `Mod mirror found for ${workshopId}, but it has no download link.`;
                return;
            }

            const uploadedText = formatJsonUploadedLikeSteam(file.uploaded, false);
            const dateStatus = compareSteamAndUpload(steamDate.value, file.uploaded);

            if (dateStatus === 'outdated') {
                showOutdatedDownload(file, steamDate, uploadedText);
                return;
            }

            if (dateStatus === 'unknown') {
                showUnknownDateDownload(file, steamDate, uploadedText);
                return;
            }

            showDownload(file, steamDate, uploadedText);
        } catch (error) {
            console.error('[ModMirror] Error:', error);
            box.textContent = `Mod mirror check failed: ${error.message || error}`;
        }
    }

    main();
})();
