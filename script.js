document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Theme Switcher
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        if(themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color:#f59e0b"></i>';
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            let theme = 'dark';
            if (body.classList.contains('light-theme')) {
                theme = 'light';
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color:#f59e0b"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
            
            // Re-trigger scroll event to update navbar styles if needed
            window.dispatchEvent(new Event('scroll'));
        });
    }

    // 1. Navbar Scroll Effect
    // 인라인 스타일 대신 클래스 토글 — 라이트 테마에서도 CSS 변수(--nav-bg-scrolled)가 적용되도록 수정
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 2. Tabs Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active', 'fade-in'));
            
            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            
            targetPane.classList.add('active');
            
            // Force reflow for animation
            void targetPane.offsetWidth;
            targetPane.classList.add('fade-in');
        });
    });

    // 3. Copy to Clipboard
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                btn.style.color = '#34d399';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.color = '';
                }, 2000);
            });
        });
    });

    // 4. Number Counting Animation
    const statValues = document.querySelectorAll('.stat-value');
    let hasAnimated = false;

    const animateNumbers = () => {
        if (hasAnimated) return;
        
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-val'), 10);
            const duration = 2000; // ms
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.innerText = Math.floor(current).toLocaleString();
            }, stepTime);
        });
        hasAnimated = true;
    };

    // Trigger number animation when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
            }
        });
    });
    
    const heroStats = document.querySelector('.stats-container');
    if (heroStats) observer.observe(heroStats);

    // 5. 3D Tilt Effect for Hero Panel
    const tiltEl = document.querySelector('[data-tilt]');
    if (tiltEl) {
        tiltEl.addEventListener('mousemove', (e) => {
            const rect = tiltEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPct = x / rect.width - 0.5;
            const yPct = y / rect.height - 0.5;
            
            tiltEl.style.transform = `perspective(1000px) rotateX(${yPct * -10}deg) rotateY(${xPct * 10}deg)`;
            tiltEl.style.transition = 'none';
        });

        tiltEl.addEventListener('mouseleave', () => {
            tiltEl.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            tiltEl.style.transition = 'transform 0.5s ease';
        });
    }

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            try {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const navEl = document.querySelector('.glass-nav');
                    const navHeight = navEl ? navEl.offsetHeight : 70;
                    const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // 모바일 메뉴가 열려있으면 닫기
                    const navLinks = document.querySelector('.nav-links');
                    const menuBtn = document.querySelector('.mobile-menu-btn');
                    if (navLinks && navLinks.classList.contains('mobile-open')) {
                        navLinks.classList.remove('mobile-open');
                        if (menuBtn) menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                    }
                }
            } catch (err) {
                // 비정상 selector 예외 무시
            }
        });
    });

    // 7. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('mobile-open');
            mobileMenuBtn.innerHTML = isOpen 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });

        // 바깥 클릭 시 메뉴 닫기
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('mobile-open') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('mobile-open');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    // 8. Interactive Law API Key (OC) Live Updater
    const ocInput = document.getElementById('user-oc-input');
    const clearOcBtn = document.getElementById('clear-oc-btn');
    const keyStatusMsg = document.getElementById('key-status-msg');
    
    const copyWebBtn = document.getElementById('copy-web-btn');
    const copyDesktopBtn = document.getElementById('copy-desktop-btn');
    const copyCliBtn = document.getElementById('copy-cli-btn');

    const codeWebUrl = document.getElementById('code-web-url');
    const codeDesktopJson = document.getElementById('code-desktop-json');
    const codeCliBlock = document.getElementById('code-cli-block');

    function updateApiKeys(rawKey) {
        const key = rawKey ? rawKey.trim() : '';
        const displayKey = key || '본인인증키';
        const urlKey = key || 'YOUR_KEY';

        // 1. Web connector
        if (copyWebBtn) {
            copyWebBtn.setAttribute('data-copy', `https://korean-law-mcp.fly.dev/mcp?oc=${urlKey}`);
        }
        if (codeWebUrl) {
            codeWebUrl.innerHTML = `https://korean-law-mcp.fly.dev/mcp?oc=<span class="highlight-text key-placeholder">${escapeHtml(displayKey)}</span>`;
        }

        // 2. Desktop JSON
        const desktopJsonContent = `{\n  "mcpServers": {\n    "korean-law": {\n      "url": "https://korean-law-mcp.fly.dev/mcp?oc=${urlKey}"\n    }\n  }\n}`;
        if (copyDesktopBtn) {
            copyDesktopBtn.setAttribute('data-copy', desktopJsonContent);
        }
        if (codeDesktopJson) {
            codeDesktopJson.innerHTML = `{\n  <span class="json-key">"mcpServers"</span>: {\n    <span class="json-key">"korean-law"</span>: {\n      <span class="json-key">"url"</span>: <span class="json-string">"https://korean-law-mcp.fly.dev/mcp?oc=<span class="highlight-text key-placeholder">${escapeHtml(displayKey)}</span>"</span>\n    }\n  }\n}`;
        }

        // 3. CLI
        if (codeCliBlock) {
            codeCliBlock.innerHTML = `<span class="cmd-comment"># 대화형 설치 마법사 실행 (가장 추천)</span>\n<span class="cmd-command">npx</span> korean-law-mcp setup\n\n<span class="cmd-comment"># 환경 변수로 인증키 등록 시</span>\n<span class="cmd-command">export</span> LAW_OC=<span class="highlight-text key-placeholder">${escapeHtml(displayKey)}</span>     <span class="cmd-comment"># Mac / Linux</span>\n<span class="cmd-command">$env:LAW_OC</span>="<span class="highlight-text key-placeholder">${escapeHtml(displayKey)}</span>"  <span class="cmd-comment"># Windows PowerShell</span>\n\n<span class="cmd-comment"># 터미널에서 직접 질의 실행</span>\n<span class="cmd-command">korean-law</span> "학교폭력예방법 제13조의2 요건 알려줘"`;
        }

        // Status Message
        if (keyStatusMsg) {
            if (key) {
                keyStatusMsg.className = 'key-status-msg active-key';
                keyStatusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> 입력하신 인증키(<strong>${escapeHtml(key)}</strong>)가 설치 코드에 실시간 반영되었습니다. 바로 복사해 사용하세요!`;
            } else {
                keyStatusMsg.className = 'key-status-msg';
                keyStatusMsg.innerHTML = `<i class="fa-solid fa-circle-info"></i> 인증키를 입력하지 않으면 기본 예시값으로 표시됩니다.`;
            }
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (ocInput) {
        ocInput.addEventListener('input', (e) => {
            updateApiKeys(e.target.value);
        });
    }

    if (clearOcBtn && ocInput) {
        clearOcBtn.addEventListener('click', () => {
            ocInput.value = '';
            updateApiKeys('');
            ocInput.focus();
        });
    }

    // 7. Progress Bar Animation in Feature Section
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const defaultBar = document.querySelector('.chart-bar.default');
                const warningBar = document.querySelector('.chart-bar.warning');
                const successBar = document.querySelector('.chart-bar.success');
                
                setTimeout(() => defaultBar.style.width = '45%', 200);
                setTimeout(() => warningBar.style.width = '100%', 400);
                setTimeout(() => successBar.style.width = '15%', 600);
            }
        });
    });
    
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) featureObserver.observe(chartContainer);
});
