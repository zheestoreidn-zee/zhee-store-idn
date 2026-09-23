const OWNER_EMAIL = "zheestoreidn@gmail.com";
let currentUser = null;
let activeEditingRoomId = null;

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
  initCustomLoginModal();
  initOwnerModals();
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

  const isOwner = currentUser && currentUser.email === OWNER_EMAIL;
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
      <div class="room-action-group">
        <button class="book-btn ${isFull ? 'full' : 'active'}" onclick="handleBook(${room.id}, '${room.link}', ${isFull})">
          ${isFull ? 'FULL' : 'BOOK'}
        </button>
        ${isOwner ? `<button class="dots-owner-btn" onclick="openQuickEditRoom(${room.id})"><i class="fa-solid fa-ellipsis-vertical"></i></button>` : ''}
      </div>
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

/* CUSTOM LIQUID GLASS LOGIN MODAL */
function initCustomLoginModal() {
  const openBtn = document.getElementById('openLoginBtn');
  const closeBtn = document.getElementById('closeLoginBtn');
  const modal = document.getElementById('loginModal');
  const userAvatar = document.getElementById('userAvatar');

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  userAvatar.addEventListener('click', () => {
    if (confirm("Logout dari akun Zhee Store?")) {
      currentUser = null;
      openBtn.classList.remove('hidden');
      userAvatar.classList.add('hidden');
      document.getElementById('floatingOwnerBtn').classList.add('hidden');
      renderRooms();
      showToast("Berhasil Logout.");
    }
  });
}

function processCustomLogin() {
  const emailInput = document.getElementById('loginEmailInput').value.trim().toLowerCase();
  
  if (!emailInput) {
    showToast("Silakan masukkan email kamu!");
    return;
  }

  currentUser = { email: emailInput };
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('openLoginBtn').classList.add('hidden');
  document.getElementById('userAvatar').classList.remove('hidden');

  const floatingOwnerBtn = document.getElementById('floatingOwnerBtn');

  if (currentUser.email === OWNER_EMAIL) {
    floatingOwnerBtn.classList.remove('hidden');
    showToast("Login Berhasil sebagai OWNER!");
  } else {
    floatingOwnerBtn.classList.add('hidden');
    showToast(`Selamat datang, ${currentUser.email}!`);
  }

  renderRooms();
}

/* OWNER MODALS & QUICK EDIT */
function initOwnerModals() {
  const floatingOwnerBtn = document.getElementById('floatingOwnerBtn');
  const adminModal = document.getElementById('adminModal');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const roomEditModal = document.getElementById('roomEditModal');
  const closeRoomEditBtn = document.getElementById('closeRoomEditBtn');

  floatingOwnerBtn.addEventListener('click', () => {
    floatingOwnerBtn.classList.toggle('active');
    if (adminModal.classList.contains('hidden')) {
      renderAdminModalUI();
      adminModal.classList.remove('hidden');
    } else {
      adminModal.classList.add('hidden');
      floatingOwnerBtn.classList.remove('active');
    }
  });

  closeAdminBtn.addEventListener('click', () => {
    adminModal.classList.add('hidden');
    floatingOwnerBtn.classList.remove('active');
  });

  closeRoomEditBtn.addEventListener('click', () => {
    roomEditModal.classList.add('hidden');
  });
}

function renderAdminModalUI() {
  const f1 = document.getElementById('toggleFee1k');
  const f2 = document.getElementById('toggleFee2k');
  if (f1) { f1.className = `toggle-btn ${roomData.fee1k.status.toLowerCase()}`; f1.innerText = roomData.fee1k.status; }
  if (f2) { f2.className = `toggle-btn ${roomData.fee2k.status.toLowerCase()}`; f2.innerText = roomData.fee2k.status; }

  const activeModes = roomData[`fee${currentFee}`].modes;
  ['1v1', '2v2', '3v3', '4v4'].forEach(m => {
    const btn = document.getElementById(`toggleMode${m}`);
    if (btn) {
      btn.className = `toggle-btn ${activeModes[m].status.toLowerCase()}`;
      btn.innerText = activeModes[m].status;
    }
  });
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

/* QUICK EDIT ROOM VIA TITIK TIGA */
function openQuickEditRoom(roomId) {
  activeEditingRoomId = roomId;
  const rooms = roomData[`fee${currentFee}`].modes[currentMode].rooms;
  const room = rooms.find(r => r.id === roomId);

  if (room) {
    document.getElementById('roomEditTitle').innerText = `EDIT FEE ${currentFee.toUpperCase()} ${currentMode} - ROOM ${roomId}`;
    document.getElementById('quickSlotDisplay').innerText = `${room.slot}/4 TIM`;
    document.getElementById('quickLinkInput').value = room.link || '';
    document.getElementById('roomEditModal').classList.remove('hidden');
  }
}

function adjustQuickSlot(change) {
  if (!activeEditingRoomId) return;
  const rooms = roomData[`fee${currentFee}`].modes[currentMode].rooms;
  const room = rooms.find(r => r.id === activeEditingRoomId);

  if (room) {
    let newSlot = room.slot + change;
    if (newSlot >= 0 && newSlot <= 4) {
      room.slot = newSlot;
      document.getElementById('quickSlotDisplay').innerText = `${newSlot}/4 TIM`;
    }
  }
}

function saveQuickRoomData() {
  if (!activeEditingRoomId) return;
  const rooms = roomData[`fee${currentFee}`].modes[currentMode].rooms;
  const room = rooms.find(r => r.id === activeEditingRoomId);

  if (room) {
    const newLink = document.getElementById('quickLinkInput').value.trim();
    room.link = newLink;
    document.getElementById('roomEditModal').classList.add('hidden');
    renderRooms();
    showToast(`Data Room ${activeEditingRoomId} Berhasil Disimpan!`);
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
