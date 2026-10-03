/* ============================================
   PYQ Tracker JavaScript
   ============================================ */

// ---------- DATA STRUCTURE ----------
const chaptersData = {
  chemistry: {
    name: "Chemistry",
    groups: [
      {
        layer: "Inorganic Chemistry",
        layerClass: "",
        chapters: [
          "Chemical Bonding",
          "Periodic Table",
          "Coordination Compounds",
          "p-Block Elements",
          "d & f Block Elements",
          "Qualitative Analysis"
        ]
      },
      {
        layer: "Physical Chemistry",
        layerClass: "",
        chapters: [
          "Mole Concept",
          "Thermodynamics",
          "Chemical & Ionic Equilibrium",
          "Electrochemistry",
          "Chemical Kinetics",
          "Solutions",
          "Atomic Structure",
          "Redox Reactions"
        ]
      },
      {
        layer: "Organic Chemistry",
        layerClass: "",
        chapters: [
          "GOC",
          "Hydrocarbons",
          "Haloalkanes & Haloarenes",
          "Alcohols, Phenols & Ethers",
          "Aldehydes, Ketones & Carboxylic Acids",
          "Amines",
          "Biomolecules",
          "Purification & Characterisation"
        ]
      }
    ]
  },
  physics: {
    name: "Physics",
    groups: [
      {
        layer: "Priority Chapters",
        layerClass: "",
        chapters: [
          "Kinematics",
          "NLM (Newton's Laws)",
          "WEP, Circular Motion",
          "Gravitation",
          "Electrostatics",
          "Capacitor",
          "Current",
          "Thermodynamics",
          "SHM",
          "MEC (Magnetic Effect)",
          "Solid State",
          "Ray Optics",
          "EMI",
          "AC",
          "Fluid",
          "Modern Physics",
          "Rotation",
          "U&D (Caliper & Gauge)",
          "Wave Optics",
          "Semiconductors",
          "Thermal Properties",
          "COM & Collision",
          "Wave Motion",
          "EM Waves"
        ]
      }
    ]
  },
  maths: {
    name: "Maths",
    groups: [
      {
        layer: "🟢 Layer 1: High Input → High Output",
        layerClass: "layer-1",
        chapters: [
          "Sequence & Series",
          "Matrices & Determinants",
          "Vectors",
         "3D Geometry",
          "Quadratic Equations",
          "Complex Numbers",
          "Binomial Theorem",
          "Statistics"
        ]
      },
      {
        layer: "🟡 Layer 2: Medium Input → High Output",
        layerClass: "layer-2",
        chapters: [
          "Limits, Continuity, Differentiability",
          "Differential Equations",
          "Area Under the Curve",
          "Integration (Indefinite + Definite)"
        ]
      },
      {
        layer: "🟠 Layer 3: High Input → High Output",
        layerClass: "layer-3",
        chapters: [
          "Permutations & Combinations",
          "Probability",
          "Sets, Relation & Functions",
          "Application of Derivatives"
        ]
      },
      {
        layer: "🔴 Layer 4: Co-ord Geometry + Trigo",
        layerClass: "layer-4",
        chapters: [
          "Straight Lines",
          "Circles",
          "Conic Sections",
          "Trigonometry & Inverse Trigo"
        ]
      }
    ]
  }
};

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

// ---------- STATE ----------
let currentSubject = "chemistry";
let progressData = {};

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", function () {
  loadProgress();
  initSubjectTabs();
  initModals();
  initDataManagement();
  renderTracker();
  updateStats();
});

// ---------- LOAD / SAVE ----------
function loadProgress() {
  try {
    const saved = localStorage.getItem("jeeTrackerProgress");
    progressData = saved ? JSON.parse(saved) : {};
  } catch (e) {
    progressData = {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem("jeeTrackerProgress", JSON.stringify(progressData));
  } catch (e) {
    alert("⚠️ Could not save data. Browser storage might be full.");
  }
}

// ---------- SUBJECT TABS ----------
function initSubjectTabs() {
  const tabs = document.querySelectorAll(".subject-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");
      currentSubject = this.getAttribute("data-subject");
      renderTracker();
      updateStats();
    });
  });
}

// ---------- RENDER ----------
function renderTracker() {
  const container = document.getElementById("tracker-content");
  const subject = chaptersData[currentSubject];
  let html = "";

  subject.groups.forEach(function (group) {
    html += '<div class="section-header ' + group.layerClass + '">' + group.layer + '</div>';
    html += '<div class="chapter-table-wrapper">';
    html += '<table class="chapter-table">';
    html += '<thead><tr>';
    html += '<th>Chapter</th>';
    YEARS.forEach(function (y) {
      html += '<th>' + y + '</th>';
    });
    html += '<th class="total-col">Total Qs</th>';
    html += '</tr></thead><tbody>';

    group.chapters.forEach(function (chapter) {
      html += '<tr>';
      html += '<td>' + chapter + '</td>';
      YEARS.forEach(function (year) {
        html += renderCell(chapter, year);
      });
      html += renderTotalQuestionsCell(chapter);
      html += '</tr>';
    });

    html += '</tbody></table></div>';
  });

  container.innerHTML = html;
  attachCellListeners();
}

function renderCell(chapter, year) {
  const key = getKey(chapter, year);
  const data = progressData[key];

  if (data && data.locked) {
    const shortDate = formatShortDate(data.date);
    return '<td class="check-cell locked-cell" data-chapter="' + escapeAttr(chapter) + '" data-year="' + year + '">' +
      '<span class="check-icon">✅</span>' +
      '<span class="check-date">' + shortDate + '</span>' +
      '<span class="check-questions">' + data.questions + ' Qs</span>' +
      '</td>';
  }

  return '<td class="check-cell" data-chapter="' + escapeAttr(chapter) + '" data-year="' + year + '">' +
    '<span class="check-icon">⬜</span>' +
    '</td>';
}

function renderTotalQuestionsCell(chapter) {
  const total = getChapterTotalQuestions(chapter);
  return '<td class="total-questions-cell">' +
    total +
    '<span class="q-label">questions</span>' +
    '</td>';
}

// ---------- CELL LISTENERS ----------
function attachCellListeners() {
  document.querySelectorAll(".check-cell:not(.locked-cell)").forEach(function (cell) {
    cell.addEventListener("click", function () {
      openMarkModal(this.getAttribute("data-chapter"), parseInt(this.getAttribute("data-year")));
    });
  });

  document.querySelectorAll(".check-cell.locked-cell").forEach(function (cell) {
    cell.addEventListener("click", function () {
      openViewModal(this.getAttribute("data-chapter"), parseInt(this.getAttribute("data-year")));
    });
  });
}

// ---------- MODALS ----------
let currentMarkData = null;

function initModals() {
  document.getElementById("modal-cancel").addEventListener("click", closeMarkModal);
  document.getElementById("modal-save").addEventListener("click", saveMark);
  document.getElementById("view-close").addEventListener("click", closeViewModal);

  document.getElementById("modal-questions").addEventListener("keypress", function (e) {
    if (e.key === "Enter") saveMark();
  });

  document.getElementById("modal-overlay").addEventListener("click", function (e) {
    if (e.target === this) closeMarkModal();
  });

  document.getElementById("view-overlay").addEventListener("click", function (e) {
    if (e.target === this) closeViewModal();
  });
}

function openMarkModal(chapter, year) {
  currentMarkData = { chapter: chapter, year: year };

  document.getElementById("modal-chapter").textContent = chapter;
  document.getElementById("modal-year").textContent = year;
  document.getElementById("modal-date").value = formatFullDate(new Date());
  document.getElementById("modal-questions").value = "";

  document.getElementById("modal-overlay").classList.add("active");
  setTimeout(function () {
    document.getElementById("modal-questions").focus();
  }, 100);
}

function closeMarkModal() {
  document.getElementById("modal-overlay").classList.remove("active");
  currentMarkData = null;
}

function saveMark() {
  if (!currentMarkData) return;

  const questionsInput = document.getElementById("modal-questions").value.trim();
  const questions = parseInt(questionsInput);

  if (!questionsInput || isNaN(questions) || questions < 1) {
    alert("⚠️ Please enter the number of questions solved (1 or more).");
    document.getElementById("modal-questions").focus();
    return;
  }

  const key = getKey(currentMarkData.chapter, currentMarkData.year);
  const today = new Date();

  progressData[key] = {
    date: today.toISOString(),
    questions: questions,
    locked: true
  };

  saveProgress();
  closeMarkModal();
  renderTracker();
  updateStats();
}

function openViewModal(chapter, year) {
  const key = getKey(chapter, year);
  const data = progressData[key];
  if (!data) return;

  document.getElementById("view-title").textContent = chapter + " — " + year;
  document.getElementById("view-date").textContent = formatFullDate(new Date(data.date));
  document.getElementById("view-questions").textContent = data.questions;

  document.getElementById("view-overlay").classList.add("active");
}

function closeViewModal() {
  document.getElementById("view-overlay").classList.remove("active");
}

// ---------- HELPERS ----------
function getKey(chapter, year) {
  return currentSubject + "|" + chapter + "|" + year;
}

function formatShortDate(isoString) {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  return day + " " + month;
}

function formatFullDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return day + " " + month + " " + year;
}

function escapeAttr(str) {
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ---------- STATS HELPERS ----------
function getChapterTotalQuestions(chapter) {
  let total = 0;
  YEARS.forEach(function (year) {
    const key = getKey(chapter, year);
    if (progressData[key] && progressData[key].locked) {
      total += progressData[key].questions || 0;
    }
  });
  return total;
}

function getSubjectStats(subjectKey) {
  const subject = chaptersData[subjectKey];
  let totalQuestions = 0;
  let chaptersSolved = 0;

  subject.groups.forEach(function (group) {
    group.chapters.forEach(function (chapter) {
      let chapterHasSolved = false;
      YEARS.forEach(function (year) {
        const key = subjectKey + "|" + chapter + "|" + year;
        if (progressData[key] && progressData[key].locked) {
          chapterHasSolved = true;
          totalQuestions += progressData[key].questions || 0;
        }
      });
      if (chapterHasSolved) chaptersSolved++;
    });
  });

  return { questions: totalQuestions, chapters: chaptersSolved };
}

// ---------- UPDATE STATS DASHBOARD ----------
function updateStats() {
  // Chemistry
  const chemStats = getSubjectStats("chemistry");
  document.getElementById("chem-questions").textContent = chemStats.questions;
  document.getElementById("chem-chapters").textContent = chemStats.chapters;

  // Physics
  const physStats = getSubjectStats("physics");
  document.getElementById("phys-questions").textContent = physStats.questions;
  document.getElementById("phys-chapters").textContent = physStats.chapters;

  // Maths
  const mathsStats = getSubjectStats("maths");
  document.getElementById("maths-questions").textContent = mathsStats.questions;
  document.getElementById("maths-chapters").textContent = mathsStats.chapters;
}

// ---------- DATA MANAGEMENT ----------
function initDataManagement() {
  document.getElementById("export-btn").addEventListener("click", exportData);
  document.getElementById("import-btn").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });
  document.getElementById("import-file").addEventListener("change", importData);
  document.getElementById("pdf-btn").addEventListener("click", function () {
    window.print();
  });
}

function exportData() {
  const dataStr = JSON.stringify(progressData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = "jee-tracker-backup-" + today + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (typeof imported === "object" && imported !== null) {
        if (confirm("⚠️ Importing will replace your current progress. Continue?")) {
          progressData = imported;
          saveProgress();
          renderTracker();
          updateStats();
          alert("✅ Progress imported successfully!");
        }
      } else {
        alert("❌ Invalid file format.");
      }
    } catch (err) {
      alert("❌ Could not read file. Please provide a valid JSON file.");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}
