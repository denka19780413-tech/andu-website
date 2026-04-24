/* ==========================================
   合同会社ANDu — Main Script
   ========================================== */

// ---------- Header scroll shadow ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const nav       = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

// Close nav on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ---------- Smooth scroll offset for fixed header ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- Scroll-in animation ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .about__wrap, .contact-form').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ---------- Contact form validation ----------
const form = document.getElementById('contactForm');

const rules = {
  name:    { el: null, error: null, validate: v => v.trim() ? '' : 'お名前を入力してください。' },
  email:   { el: null, error: null, validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : '正しいメールアドレスを入力してください。' },
  message: { el: null, error: null, validate: v => v.trim().length >= 10 ? '' : '10文字以上でメッセージを入力してください。' },
};

Object.keys(rules).forEach(key => {
  rules[key].el    = document.getElementById(key);
  rules[key].error = document.getElementById(key + 'Error');
});

function validate(key) {
  const rule = rules[key];
  const msg  = rule.validate(rule.el.value);
  rule.error.textContent = msg;
  rule.el.classList.toggle('error', !!msg);
  return !msg;
}

Object.keys(rules).forEach(key => {
  rules[key].el.addEventListener('blur', () => validate(key));
  rules[key].el.addEventListener('input', () => {
    if (rules[key].el.classList.contains('error')) validate(key);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const valid = Object.keys(rules).map(validate).every(Boolean);
  if (!valid) return;

  // ---- Placeholder: フォーム送信処理 ----
  // Cloudflare Pagesにデプロイ後、Web3FormsやFormspreeのactionを設定してください。
  // 例: form.action = 'https://api.web3forms.com/submit';
  alert('送信が完了しました。（※ 現在はデモ表示です。デプロイ後に送信設定を行ってください）');
  form.reset();
});

// ---------- Fade-in CSS (injected) ----------
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
