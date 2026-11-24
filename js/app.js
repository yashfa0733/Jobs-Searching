// CareerConnect - Lab 3 client-side demonstration
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
  });

  // Populate the job search keyword from the URL query string.
  const params = new URLSearchParams(location.search);
  const keywordInput = document.getElementById('job-keyword');
  if (keywordInput && params.get('q')) keywordInput.value = params.get('q');

  const searchForm = document.getElementById('job-search');
  if (searchForm) {
    const cards = [...document.querySelectorAll('.job-card')];
    const filterJobs = event => {
      if (event) event.preventDefault();
      const keyword = keywordInput.value.trim().toLowerCase();
      const locationValue = document.getElementById('job-location').value.toLowerCase();
      const typeValue = document.getElementById('job-type').value.toLowerCase();
      let count = 0;
      cards.forEach(card => {
        const text = (card.dataset.title + ' ' + card.dataset.company).toLowerCase();
        const matches = (!keyword || text.includes(keyword)) &&
          (!locationValue || card.dataset.location.toLowerCase() === locationValue) &&
          (!typeValue || card.dataset.type.toLowerCase() === typeValue);
        card.hidden = !matches;
        if (matches) count++;
      });
      document.getElementById('result-count').textContent = `${count} job${count === 1 ? '' : 's'} found`;
      document.getElementById('no-jobs').hidden = count !== 0;
    };
    searchForm.addEventListener('submit', filterJobs);
    filterJobs();
  }

  const showMessage = (id, message, error = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('error', error);
  };

  const register = document.getElementById('register-form');
  if (register) register.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('confirm-password').value;
    if (!register.reportValidity()) return;
    if (password !== confirm) return showMessage('register-message', 'Passwords do not match.', true);
    const users = JSON.parse(localStorage.getItem('ccUsers') || '[]');
    if (users.some(user => user.email === email)) return showMessage('register-message', 'This email is already registered. Please log in.', true);
    users.push({name, email, password, role: document.getElementById('user-role').value});
    localStorage.setItem('ccUsers', JSON.stringify(users));
    showMessage('register-message', 'Account created successfully! You can now log in.');
    register.reset();
  });

  const login = document.getElementById('login-form');
  if (login) login.addEventListener('submit', event => {
    event.preventDefault();
    if (!login.reportValidity()) return;
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('ccUsers') || '[]');
    const user = users.find(item => item.email === email && item.password === password);
    if (!user) return showMessage('login-message', 'Account not found or password is incorrect. Register first or check your details.', true);
    localStorage.setItem('ccCurrentUser', JSON.stringify({name:user.name,email:user.email,role:user.role}));
    showMessage('login-message', `Welcome, ${user.name}! Login successful. You can now browse and apply for jobs.`);
  });

  const apply = document.getElementById('apply-form');
  if (apply) {
    const jobField = document.getElementById('apply-job');
    jobField.value = params.get('job') || '';
    apply.addEventListener('submit', event => {
      event.preventDefault();
      if (!apply.reportValidity()) return;
      const file = document.getElementById('resume').files[0];
      if (!file) return showMessage('apply-message', 'Please select your resume.', true);
      if (file.size > 5 * 1024 * 1024) return showMessage('apply-message', 'Resume must be smaller than 5 MB.', true);
      const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
      if (!allowed) return showMessage('apply-message', 'Please upload a PDF or DOC/DOCX file.', true);
      showMessage('apply-message', 'Application form validated successfully! This demo does not send the application to a server.');
      apply.reset();
    });
  }

  const employer = document.getElementById('employer-form');
  if (employer) employer.addEventListener('submit', event => {
    event.preventDefault();
    if (!employer.reportValidity()) return;
    showMessage('employer-message', 'Job details validated successfully! This demo does not publish to a real server.');
    employer.reset();
  });
});
