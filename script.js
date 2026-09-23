// Data Dummy untuk simulasi awal sebelum disambungkan ke Firebase
const roomData = {
  fee1k: {
    status: 'ON',
    modes: {
      '1v1': [
        { id: 1, slot: 3, link: 'https://chat.whatsapp.com/EXAMPLE1' },
        { id: 2, slot: 4, link: 'https://chat.whatsapp.com/EXAMPLE2' },
        { id: 3, slot: 1, link: 'https://chat.whatsapp.com/EXAMPLE3' },
        { id: 4, slot: 0, link: 'https://chat.whatsapp.com/EXAMPLE4' },
        { id: 5, slot: 4, link: 'https://chat.whatsapp.com/EXAMPLE5' },
      ],
      '2v2': [
        { id: 1, slot: 2, link: 'https://chat.whatsapp.com/EXAMPLE1' },
        { id: 2, slot: 0, link: 'https://chat.whatsapp.com/EXAMPLE2' },
        { id: 3, slot: 4, link: 'https://chat.whatsapp.com/EXAMPLE3' },
        { id: 4, slot: 1, link: 'https://chat.whatsapp.com/EXAMPLE4' },
        { id: 5, slot: 3, link: 'https://chat.whatsapp.com/EXAMPLE5' },
      ],
      '3v3': [
        { id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' },
        { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }
      ],
      '4v4': [
        { id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' },
        { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }
      ]
    }
  },
  fee2k: {
    status: 'ON',
    modes: {
      '1v1': [
        { id: 1, slot: 1, link: 'https://chat.whatsapp.com/EXAMPLE1' },
        { id: 2, slot: 0, link: 'https://chat.whatsapp.com/EXAMPLE2' },
        { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }
      ],
      '2v2': [
        { id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' },
        { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }
      ],
      '3v3': [
        { id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' },
        { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }
      ],
      '4v4': [
        { id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' },
        { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }
      ]
    }
  }
};

let currentFee = '1k';
let currentMode = '1v1';

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavigation();
  initTabs();
  renderRooms();
  showToast('Selamat Datang di Zhee Store!');
});

// Sidebar Controls
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');

  openBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  });

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
}

// Router Navigasi
function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  const pages = document.querySelectorAll('.page-content');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = item.getAttribute('data-page');

      menuItems.forEach(m => m.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(`page-${targetPage}`).classList.add('active');

      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').classList.remove('active');
    });
  });
}

// Tab Switcher Fee & Mode
function initTabs() {
  const feeTabs = document.querySelectorAll('.fee-tab');
  const modeBtns = document.querySelectorAll('.mode-btn');

  feeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      feeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFee = tab.getAttribute('data-fee');
      updateHeaderTitle();
      renderRooms();
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode');
      updateHeaderTitle();
      renderRooms();
    });
  });
}

function updateHeaderTitle() {
  const title = document.getElementById('currentCategoryTitle');
  title.innerText = `FEE ${currentFee.toUpperCase()} • MODE ${currentMode}`;
}

// Render Room List
function renderRooms() {
  const container = document.getElementById('roomContainer');
  container.innerHTML = '';

  const activeFeeData = roomData[`fee${currentFee}`];
  const rooms = activeFeeData.modes[currentMode];

  rooms.forEach(room => {
    const isFull = room.slot >= 4;
    const card = document.createElement('div');
    card.className = 'room-card';

    card.innerHTML = `
      <div class="room-info">
        <h4>ROOM ${room.id}</h4>
        <span>${room.slot}/4 TIM</span>
      </div>
      <button class="book-btn ${isFull ? 'full' : 'active'}" ${isFull ? 'disabled' : ''} onclick="handleBook(${room.id}, '${room.link}', ${isFull})">
        ${isFull ? 'FULL' : 'BOOK'}
      </button>
    `;

    container.appendChild(card);
  });
}

// Handler Klik Book
function handleBook(roomId, link, isFull) {
  if (isFull) return;

  if (!link || link === '') {
    showToast(`Room ${roomId} belum tersedia link!`);
    return;
  }

  showToast(`Mengarahkan ke GB Slot Room ${roomId}...`);
  setTimeout(() => {
    window.open(link, '_blank');
  }, 800);
}

// Smooth Toast Notification
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastMessage');

  toastText.innerText = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
        }
