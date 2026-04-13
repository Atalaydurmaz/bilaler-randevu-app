// ===== STATE =====
const state = {
  serviceName: '',
  servicePrice: 0,
  serviceDuration: 0,
  date: null,
  dateStr: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  note: ''
};

let calYear, calMonth;

// ===== NAVIGATION =====
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  target.classList.add('active');
  if (screenId === 'screen-date') renderCalendar();
  if (screenId === 'screen-time') renderTimeSlots();
  if (screenId === 'screen-summary') fillSummary();
  const body = target.querySelector('.screen-body');
  if (body) body.scrollTop = 0;
}

// ===== SERVICE =====
function selectService(el, name, price, duration) {
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.serviceName = name;
  state.servicePrice = price;
  state.serviceDuration = duration;
  document.getElementById('btn-service-next').disabled = false;
}

// ===== CALENDAR =====
const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                   'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  const today = new Date(); today.setHours(0,0,0,0);
  const maxDate = new Date(today); maxDate.setDate(today.getDate() + 60);

  document.getElementById('cal-month-year').textContent = TR_MONTHS[calMonth] + ' ' + calYear;
  document.getElementById('cal-prev').disabled =
    (calYear === today.getFullYear() && calMonth === today.getMonth());

  const grid = document.getElementById('cal-days');
  grid.innerHTML = '';

  const firstDay = new Date(calYear, calMonth, 1);
  let startDow = firstDay.getDay();
  startDow = (startDow === 0) ? 6 : startDow - 1;
  for (let i = 0; i < startDow; i++) {
    const empty = document.createElement('button');
    empty.className = 'cal-day empty';
    grid.appendChild(empty);
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calYear, calMonth, d);
    const dow = date.getDay();
    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d;

    if (date < today || date > maxDate || dow === 0) {
      btn.classList.add('disabled');
      if (dow === 0) btn.classList.add('sunday');
    } else {
      if (date.getTime() === today.getTime()) btn.classList.add('today');
      if (dateToStr(date) === state.dateStr) btn.classList.add('selected');
      btn.onclick = () => selectDate(date, btn);
    }
    grid.appendChild(btn);
  }
}

function selectDate(date, btn) {
  document.querySelectorAll('.cal-day').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.date = date;
  state.dateStr = dateToStr(date);
  state.time = '';
  document.getElementById('btn-date-next').disabled = false;
}

function dateToStr(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth()+1).padStart(2,'0') + '-' +
    String(date.getDate()).padStart(2,'0');
}

// ===== TIME SLOTS =====
const ALL_SLOTS = [
  '09:00','10:00','11:00',
  '12:00','13:00','14:00',
  '15:00','16:00','17:00',
  '18:00','19:00','20:00'
];

const LUNCH_BREAK = ['12:00'];

function renderTimeSlots() {
  const grid = document.getElementById('time-grid');
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--gray);font-size:13px;">Yükleniyor...</div>';

  if (state.dateStr) {
    const d = state.date;
    const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
    document.getElementById('time-screen-sub').textContent =
      days[d.getDay()] + ', ' + d.getDate() + ' ' + TR_MONTHS[d.getMonth()];
  }

  getBookedTimes(state.dateStr).then(rawBooked => {
    const bookedTimes = [...new Set([...rawBooked, ...LUNCH_BREAK])];
    grid.innerHTML = '';

    // Bugünse geçmiş saatleri bul
    const now = new Date();
    const isToday = state.dateStr === dateToStr(now);
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    ALL_SLOTS.forEach(slot => {
      const el = document.createElement('div');
      el.className = 'time-slot';
      el.textContent = slot;

      const [slotH, slotM] = slot.split(':').map(Number);
      const isPast = isToday && (slotH < currentHour || (slotH === currentHour && slotM <= currentMin));

      if (bookedTimes.includes(slot) || isPast) {
        el.classList.add('booked');
      } else {
        if (slot === state.time) el.classList.add('selected');
        el.onclick = () => selectTime(slot, el);
      }
      grid.appendChild(el);
    });
  });
}

function selectTime(time, el) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.time = time;
  document.getElementById('btn-time-next').disabled = false;
}

// ===== INFO & SUMMARY =====
function goToSummary() {
  const name  = document.getElementById('input-name').value.trim();
  const phoneRaw = document.getElementById('input-phone').value.trim();
  const phoneDigits = phoneRaw.replace(/\s/g, '');
  if (!name)  { showToast('Lütfen adını gir'); document.getElementById('input-name').focus(); return; }
  if (name.length > 40) { showToast('Ad soyad en fazla 40 karakter olabilir'); document.getElementById('input-name').focus(); return; }
  if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 11) { showToast('Geçerli bir telefon numarası gir'); document.getElementById('input-phone').focus(); return; }
  state.name  = name;
  state.phone = phoneRaw;
  state.email = document.getElementById('input-email').value.trim();
  state.note  = document.getElementById('input-note').value.trim();
  goTo('screen-summary');
}

function fillSummary() {
  document.getElementById('sum-service').textContent = state.serviceName;
  document.getElementById('sum-date').textContent    = formatDateTR(state.date);
  document.getElementById('sum-time').textContent    = state.time;
  document.getElementById('sum-name').textContent    = state.name;
  document.getElementById('sum-price').textContent   = state.servicePrice + ' ₺';
}

function formatDateTR(date) {
  if (!date) return '—';
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  return days[date.getDay()] + ', ' + date.getDate() + ' ' + TR_MONTHS[date.getMonth()] + ' ' + date.getFullYear();
}

function formatDateTRfromStr(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  return d + ' ' + TR_MONTHS[m - 1] + ' ' + y;
}

// ===== CONFIRM BOOKING =====
async function confirmBooking() {
  const btn = document.querySelector('#screen-summary .btn-primary');
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor...';

  const code = 'BL' + Date.now().toString().slice(-5);
  const appointment = {
    id: code,
    name: state.name,
    phone: state.phone,
    service: state.serviceName,
    price: state.servicePrice,
    date: state.dateStr,
    time: state.time,
    email: state.email,
    note: state.note,
    status: 'beklemede',
    createdAt: new Date().toISOString()
  };

  try {
    // Önce saatin hala boş olduğunu kontrol et (race condition koruması)
    const stillFree = await checkSlotFree(appointment.date, appointment.time);
    if (!stillFree) {
      showToast('Bu saat az önce doldu, başka saat seç');
      btn.disabled = false;
      btn.textContent = 'Randevuyu Onayla ✓';
      goTo('screen-time');
      return;
    }
    await saveAppointment(appointment);
    sendEmailNotification(appointment); // mail gönder (arka planda)
    goTo('screen-success');
  } catch (e) {
    showToast('Bağlantı hatası, tekrar dene');
    btn.disabled = false;
    btn.textContent = 'Randevuyu Onayla ✓';
  }
}

// ===== RESET =====
function resetAll() {
  state.serviceName = ''; state.servicePrice = 0; state.serviceDuration = 0;
  state.date = null; state.dateStr = ''; state.time = '';
  state.name = ''; state.phone = ''; state.email = ''; state.note = '';
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('btn-service-next').disabled = true;
  document.getElementById('btn-date-next').disabled = true;
  document.getElementById('btn-time-next').disabled = true;
  document.getElementById('input-name').value = '';
  document.getElementById('input-phone').value = '';
  document.getElementById('input-email').value = '';
  document.getElementById('input-note').value = '';
}

// ===== FIREBASE / STORAGE =====

async function saveAppointment(appt) {
  // localStorage yedek
  const list = JSON.parse(localStorage.getItem('bilal_appointments') || '[]');
  list.push(appt);
  localStorage.setItem('bilal_appointments', JSON.stringify(list));

  // Firebase varsa Firestore'a kaydet
  if (typeof db !== 'undefined') {
    await db.collection('appointments').doc(appt.id).set(appt);
  }
}

async function checkSlotFree(dateStr, time) {
  if (typeof db !== 'undefined') {
    try {
      const snap = await db.collection('appointments')
        .where('date', '==', dateStr)
        .where('time', '==', time)
        .get();
      return snap.empty;
    } catch(e) { return true; }
  }
  const list = JSON.parse(localStorage.getItem('bilal_appointments') || '[]');
  return !list.some(a => a.date === dateStr && a.time === time);
}

async function getBookedTimes(dateStr) {
  if (typeof db !== 'undefined') {
    try {
      const snap = await db.collection('appointments').where('date', '==', dateStr).get();
      return snap.docs.map(d => d.data().time);
    } catch(e) { /* fallback */ }
  }
  const list = JSON.parse(localStorage.getItem('bilal_appointments') || '[]');
  return list.filter(a => a.date === dateStr).map(a => a.time);
}

// ===== EMAİL (EmailJS) =====
// emailjs-config.js'ten PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID gelecek
async function sendEmailNotification(appt) {
  if (typeof emailjs === 'undefined') return;
  if (!window.EJS_PUBLIC_KEY || window.EJS_PUBLIC_KEY === 'BURAYA_YAZ') return;

  emailjs.init(window.EJS_PUBLIC_KEY);

  // Admin bildirimi — yeni randevu talebi
  const adminParams = {
    musteri_mail: 'bilalerhairworkshop@gmail.com',
    baslik: 'Yeni Randevu Talebi!',
    icerik: `<p><b>Müşteri:</b> ${appt.name}<br><b>Tel:</b> ${appt.phone}<br><b>Hizmet:</b> ${appt.service}<br><b>Tarih:</b> ${formatDateTRfromStr(appt.date)}<br><b>Saat:</b> ${appt.time}<br><b>Ücret:</b> ${appt.price}₺${appt.note ? '<br><b>Not:</b> ' + appt.note : ''}</p>`,
    imza: 'Bilal Er Randevu Sistemi'
  };

  try {
    await emailjs.send(window.EJS_SERVICE_ID, window.EJS_TEMPLATE_RED, adminParams);
  } catch(e) {
    console.warn('Admin mail gönderilemedi:', e);
  }
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== INIT =====
initCalendar();
