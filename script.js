const roomData = {
  fee1k: {
    status: 'ON',
    modes: {
      '1v1': { status: 'ON', rooms: [{ id: 1, slot: 3, link: 'https://chat.whatsapp.com/EXAMPLE1' }, { id: 2, slot: 4, link: '' }, { id: 3, slot: 1, link: 'https://chat.whatsapp.com/EXAMPLE3' }, { id: 4, slot: 0, link: 'https://chat.whatsapp.com/EXAMPLE4' }, { id: 5, slot: 4, link: '' }] },
      '2v2': { status: 'ON', rooms: [{ id: 1, slot: 2, link: 'https://chat.whatsapp.com/EXAMPLE1' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 4, link: '' }, { id: 4, slot: 1, link: '' }, { id: 5, slot: 3, link: '' }] },
      '3v3': { status: 'OFF', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '4v4': { status: 'ON', rooms: [{ id: 1, slot: 0, link: 'https://chat.whatsapp.com/EXAMPLE1' }, { id: 2, slot: 4, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] }
    }
  },
  fee2k: {
    status: 'ON',
    modes: {
      '1v1': { status: 'ON', rooms: [{ id: 1, slot: 1, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '2v2': { status: 'ON', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '3v3': { status: 'OFF', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '4v4': { status: 'OFF', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] }
    }
  }
};

let currentFee = '1k';
let currentMode = '1v1';

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavigation();
  initTabs();
  initAdminModal();
  renderRooms();
});

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

function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = item.getAttribute('data-page');
      navigateToPage(targetPage);
    });
  });
}

function navigateToPage(pageName) {
  const menuItems = document.querySelectorAll('.menu-item');
  const pages = document.querySelectorAll('.page-content');

  menuItems.forEach(m => m.classList.remove('active'));
  pages.forEach(p => p.classList.remove('active'));

  const activeMenu = document.querySelector(`.menu-item[data-page="${pageName}"]`);
  if (activeMenu) activeMenu.classList.add('active');

  document.getElementById(`page-${pageName}`).classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

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

function renderRooms() {
  const container = document.getElementById('roomContainer');
  container.innerHTML = '';

  const activeFeeData = roomData[`fee${currentFee}`];
  
  if (activeFeeData.status === 'OFF') {
    container.innerHTML = `<div class="glass-card" style="text-align:center; padding:30px;"><i class="fa-solid fa-lock" style="font-size:1.5rem; color:var(--neon-red); margin-bottom:10px;"></i><p>FEE ${currentFee.toUpperCase()} SEMENTARA TUTUP / OFF</p></div>`;
    return;
  }

  const modeObj = activeFeeData.modes[currentMode];

  if (modeObj.status === 'OFF') {
    container.innerHTML = `<div class="glass-card" style="text-align:center; padding:30px;"><i class="fa-solid fa-lock" style="font-size:1.5rem; color:var(--neon-red); margin-bottom:10px;"></i><p>MODE ${currentMode} SEMENTARA TUTUP / OFF</p></div>`;
    return;
  }

  const rooms = modeObj.rooms;
  rooms.forEach(room => {
    const isFull = room.slot >= 4;
    const card = document.createElement('div');
    card.className = 'room-card';

    card.innerHTML = `
      <div class="room-info">
        <h4>ROOM ${room.id}</h4>
        <span>${room.slot}/4 TIM</span>
      </div>
      <button class="book-btn ${isFull ? 'full' : 'active'}" onclick="handleBook(${room.id}, '${room.link}', ${isFull})">
        ${isFull ? 'FULL' : 'BOOK'}
      </button>
    `;

    container.appendChild(card);
  });
}

function handleBook(roomId, link, isFull) {
  if (isFull) {
    showToast(`Room ${roomId} Sudah Full! Silakan pilih room lain.`);
    return;
  }

  if (!link || link === '') {
    showToast(`Room ${roomId} belum tersedia link!`);
    return;
  }

  showToast(`Mengarahkan ke GB Room ${roomId}...`);
  setTimeout(() => {
    window.open(link, '_blank');
  }, 800);
}

/* Modal Admin Functions */
function initAdminModal() {
  const adminBtn = document.getElementById('adminAuthBtn');
  const modal = document.getElementById('adminModal');
  const closeBtn = document.getElementById('closeAdminBtn');

  adminBtn.addEventListener('click', () => {
    renderAdminRoomControls();
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

function toggleFeeStatus(fee) {
  const activeFeeData = roomData[`fee${fee}`];
  activeFeeData.status = activeFeeData.status === 'ON' ? 'OFF' : 'ON';
  
  const btn = document.getElementById(`toggleFee${fee}`);
  btn.className = `toggle-btn ${activeFeeData.status.toLowerCase()}`;
  btn.innerText = activeFeeData.status;

  const badge = document.getElementById(`statusBadge${fee}`);
  badge.className = `status-indicator ${activeFeeData.status.toLowerCase()}`;
  badge.innerText = activeFeeData.status;

  showToast(`Status FEE ${fee.toUpperCase()} diubah jadi ${activeFeeData.status}`);
  renderRooms();
}

function toggleModeStatus(mode) {
  const modeObj = roomData[`fee${currentFee}`].modes[mode];
  modeObj.status = modeObj.status === 'ON' ? 'OFF' : 'ON';

  const btn = document.getElementById(`toggleMode${mode}`);
  btn.className = `toggle-btn ${modeObj.status.toLowerCase()}`;
  btn.innerText = modeObj.status;

  const dot = document.getElementById(`dot${mode}`);
  dot.className = `mode-status ${modeObj.status.toLowerCase()}`;

  showToast(`Mode ${mode} (FEE ${currentFee.toUpperCase()}) diubah jadi ${modeObj.status}`);
  renderRooms();
}

function renderAdminRoomControls() {
  const container = document.getElementById('adminRoomControlList');
  container.innerHTML = '';

  const rooms = roomData[`fee${currentFee}`].modes[currentMode].rooms;

  rooms.forEach(room => {
    const row = document.createElement('div');
    row.className = 'admin-room-row';
    row.innerHTML = `
      <span>Room ${room.id} (${room.slot}/4 Tim)</span>
      <div>
        <button class="admin-room-btn" onclick="updateRoomSlot(${room.id}, -1)">-</button>
        <button class="admin-room-btn" onclick="updateRoomSlot(${room.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function updateRoomSlot(roomId, change) {
  const rooms = roomData[`fee${currentFee}`].modes[currentMode].rooms;
  const room = rooms.find(r => r.id === roomId);

  if (room) {
    let newSlot = room.slot + change;
    if (newSlot >= 0 && newSlot <= 4) {
      room.slot = newSlot;
      renderAdminRoomControls();
      renderRooms();
      showToast(`Room ${roomId} diubah jadi ${newSlot}/4 Tim`);
    }
  }
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastMessage');

  toastText.innerText = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
  }

