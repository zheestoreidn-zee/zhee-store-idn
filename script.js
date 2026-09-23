const OWNER_EMAIL = "zheestoreidn@gmail.com";
let currentUser = null;

// Struktur Data Independen (Terpisah Total Antar Fee & Mode)
const roomData = {
  fee1k: {
    status: 'ON',
    modes: {
      '1v1': { status: 'ON', rooms: [{ id: 1, slot: 3, link: 'https://chat.whatsapp.com/EXAMPLE1' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 1, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '2v2': { status: 'ON', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '3v3': { status: 'OFF', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
      '4v4': { status: 'ON', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] }
    }
  },
  fee2k: {
    status: 'OFF',
    modes: {
      '1v1': { status: 'ON', rooms: [{ id: 1, slot: 0, link: '' }, { id: 2, slot: 0, link: '' }, { id: 3, slot: 0, link: '' }, { id: 4, slot: 0, link: '' }, { id: 5, slot: 0, link: '' }] },
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
  initAuthSimulator();
  initAdminModal();
  updateModeDots();
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
    document.body.classList.add('sidebar-locked');
  });

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-locked');
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
  document.body.classList.remove('sidebar-locked');
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
      updateModeDots();
      renderRooms();
      if (!document.getElementById('adminModal').classList.contains('hidden')) {
        renderAdminModalUI();
      }
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode');
      updateHeaderTitle();
      renderRooms();
      if (!document.getElementById('adminModal').classList.contains('hidden')) {
        renderAdminRoomControls();
      }
    });
  });
}

function updateHeaderTitle() {
  const title = document.getElementById('currentCategoryTitle');
  title.innerText = `FEE ${currentFee.toUpperCase()} • MODE ${currentMode}`;
}

// Update Titik Indikator Mode (Hijau/Merah) Sesuai Fee Aktif
function updateModeDots() {
  const activeModes = roomData[`fee${currentFee}`].modes;
  const isFeeOn = roomData[`fee${currentFee}`].status === 'ON';

  ['1v1', '2v2', '3v3', '4v4'].forEach(m => {
    const dot = document.getElementById(`dot${m}`);
    if (dot) {
      if (isFeeOn && activeModes[m].status === 'ON') {
        dot.className = 'mode-status on';
      } else {
        dot.className = 'mode-status off';
      }
    }
  });
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

/* KONTROL OWNER LOGIN */
function initAuthSimulator() {
  const googleAuthBtn = document.getElementById('googleAuthBtn');
  const userAvatar = document.getElementById('userAvatar');
  const floatingOwnerBtn = document.getElementById('floatingOwnerBtn');

  googleAuthBtn.addEventListener('click', () => {
    const emailInput = prompt("Masukkan Email Google (Gunakan zheestoreidn@gmail.com untuk tes Owner):");
    
    if (emailInput) {
      currentUser = { email: emailInput.trim().toLowerCase() };
      
      googleAuthBtn.classList.add('hidden');
      userAvatar.src = "logo-zs.png";
      userAvatar.classList.remove('hidden');

      if (currentUser.email === OWNER_EMAIL) {
        floatingOwnerBtn.classList.remove('hidden');
        showToast("Login Berhasil sebagai OWNER!");
      } else {
        floatingOwnerBtn.classList.add('hidden');
        showToast(`Welcome, ${currentUser.email}!`);
      }
    }
  });

  userAvatar.addEventListener('click', () => {
    if (confirm("Logout dari Akun?")) {
      currentUser = null;
      googleAuthBtn.classList.remove('hidden');
      userAvatar.classList.add('hidden');
      floatingOwnerBtn.classList.add('hidden');
      showToast("Berhasil Logout.");
    }
  });
}

/* Modal Admin Owner Panel */
function initAdminModal() {
  const floatingOwnerBtn = document.getElementById('floatingOwnerBtn');
  const modal = document.getElementById('adminModal');
  const closeBtn = document.getElementById('closeAdminBtn');

  floatingOwnerBtn.addEventListener('click', () => {
    renderAdminModalUI();
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

function renderAdminModalUI() {
  // Update Tombol Fee ON/OFF di Modal
  const f1 = document.getElementById('toggleFee1k');
  const f2 = document.getElementById('toggleFee2k');
  if (f1) { f1.className = `toggle-btn ${roomData.fee1k.status.toLowerCase()}`; f1.innerText = roomData.fee1k.status; }
  if (f2) { f2.className = `toggle-btn ${roomData.fee2k.status.toLowerCase()}`; f2.innerText = roomData.fee2k.status; }

  // Update Tombol Mode ON/OFF di Modal Sesuai Fee Aktif
  const activeModes = roomData[`fee${currentFee}`].modes;
  ['1v1', '2v2', '3v3', '4v4'].forEach(m => {
    const btn = document.getElementById(`toggleMode${m}`);
    if (btn) {
      btn.className = `toggle-btn ${activeModes[m].status.toLowerCase()}`;
      btn.innerText = activeModes[m].status;
    }
  });

  renderAdminRoomControls();
}

function toggleFeeStatus(fee) {
  const activeFeeData = roomData[`fee${fee}`];
  activeFeeData.status = activeFeeData.status === 'ON' ? 'OFF' : 'ON';
  
  const badge = document.getElementById(`statusBadge${fee}`);
  if (badge) {
    badge.className = `status-indicator ${activeFeeData.status.toLowerCase()}`;
    badge.innerText = activeFeeData.status;
  }

  updateModeDots();
  renderAdminModalUI();
  renderRooms();
  showToast(`FEE ${fee.toUpperCase()} diubah jadi ${activeFeeData.status}`);
}

function toggleModeStatus(mode) {
  const modeObj = roomData[`fee${currentFee}`].modes[mode];
  modeObj.status = modeObj.status === 'ON' ? 'OFF' : 'ON';

  updateModeDots();
  renderAdminModalUI();
  renderRooms();
  showToast(`Mode ${mode} (FEE ${currentFee.toUpperCase()}) diubah jadi ${modeObj.status}`);
}

function saveSaluranLink() {
  const input = document.getElementById('inputSaluranLink').value;
  if (input) {
    document.getElementById('saluranLinkBtn').href = input;
    showToast("Link Saluran Official Diperbarui!");
  }
}

function renderAdminRoomControls() {
  const container = document.getElementById('adminRoomControlList');
  if (!container) return;
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

// Update Slot Spesifik Hanya Pada Fee & Mode Yang Aktif
function updateRoomSlot(roomId, change) {
  const rooms = roomData[`fee${currentFee}`].modes[currentMode].rooms;
  const room = rooms.find(r => r.id === roomId);

  if (room) {
    let newSlot = room.slot + change;
    if (newSlot >= 0 && newSlot <= 4) {
      room.slot = newSlot;
      renderAdminRoomControls();
      renderRooms();
      showToast(`FEE ${currentFee.toUpperCase()} ${currentMode} - Room ${roomId} diubah jadi ${newSlot}/4 Tim`);
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
