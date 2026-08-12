(function () {
  'use strict';
alert("App.js is working!");
  /* ---------------------------------------------
     Icons — simple outline SVGs, Heroicons-style
     (24 viewBox, 1.5 stroke, currentColor)
  ---------------------------------------------- */
  var icons = {
    checkCircle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="9"></circle><polyline points="8 12.5 11 15.5 16 9"></polyline></svg>',
    alertTriangle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<polygon points="12 3 22 20 2 20"></polygon><line x1="12" y1="9" x2="12" y2="14"></line>' +
      '<circle cx="12" cy="17.3" r="0.75" fill="currentColor" stroke="none"></circle></svg>',
    flag:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="6" y1="4" x2="6" y2="20"></line><polyline points="6 4 18 4 14 8 18 12 6 12"></polyline></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="8"></circle><polyline points="12 7.5 12 12 15.5 13.5"></polyline></svg>',
    chat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="3" y="5" width="18" height="11" rx="2"></rect><polyline points="8 16 8 20 12 16"></polyline></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="9"></circle><line x1="12" y1="11" x2="12" y2="16"></line>' +
      '<circle cx="12" cy="8" r="0.75" fill="currentColor" stroke="none"></circle></svg>',
    chevron:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="9 6 15 12 9 18"></polyline></svg>'
  };

  /* ---------------------------------------------
     Mock data
  ---------------------------------------------- */
  var DEFAULT_DATA = [
    {
      id: 1, name: 'Priya Nair', course: 'CS 201 — Data Structures', courseCode: 'CS201',
      courseAvgPct: 20, total: 40, ungraded: 8, dueDate: 'Aug 14',
      severity: 'onTrack', coldStart: false, selfFlag: null, capacity: null, contestNote: null, checkIn: null
    },
    {
      id: 2, name: 'Daniel Osei', course: 'CS 340 — Web App Development', courseCode: 'CS340',
      courseAvgPct: 15, total: 35, ungraded: 4, dueDate: 'Aug 13',
      severity: 'onTrack', coldStart: false, selfFlag: null, capacity: null, contestNote: null, checkIn: null
    },
    {
      id: 3, name: 'Maya Chen', course: 'CS 201 — Data Structures', courseCode: 'CS201',
      courseAvgPct: 20, total: 40, ungraded: 14, dueDate: 'Aug 12',
      severity: 'paceCheck', coldStart: false, selfFlag: null, capacity: null, contestNote: null, checkIn: null
    },
    {
      id: 4, name: 'Ethan Brooks', course: 'CS 340 — Web App Development', courseCode: 'CS340',
      courseAvgPct: 15, total: 35, ungraded: 27, dueDate: 'Aug 11',
      severity: 'needsCheckin', coldStart: false,
      selfFlag: { active: true, date: 'Aug 9' }, capacity: null, contestNote: null, checkIn: null
    },
    {
      id: 5, name: 'Sofia Ramirez', course: 'CS 201 — Data Structures', courseCode: 'CS201',
      courseAvgPct: 20, total: 40, ungraded: 12, dueDate: 'Aug 14',
      severity: 'paceCheck', coldStart: false, selfFlag: null,
      capacity: { hours: 18, setDate: 'Jul 28' }, contestNote: null, checkIn: null
    },
    {
      id: 6, name: 'Liam Walsh', course: 'CS 340 — Web App Development', courseCode: 'CS340',
      courseAvgPct: 15, total: 35, ungraded: 15, dueDate: 'Aug 12',
      severity: 'paceCheck', coldStart: false, selfFlag: null, capacity: null,
      contestNote: { text: 'Grading these project reports carefully takes longer per submission — I\'m not behind, the rubric is just detailed this round.', date: 'Aug 6' },
      checkIn: null
    },
    {
      id: 7, name: 'Aiden Park', course: 'CS 201 — Data Structures', courseCode: 'CS201',
      courseAvgPct: 20, total: 40, ungraded: 5, dueDate: 'Aug 20',
      severity: 'onTrack', coldStart: true, selfFlag: null, capacity: null, contestNote: null, checkIn: null
    },
    {
      id: 8, name: 'Grace Kim', course: 'CS 340 — Web App Development', courseCode: 'CS340',
      courseAvgPct: 15, total: 35, ungraded: 9, dueDate: 'Aug 10',
      severity: 'checkedIn', coldStart: false, selfFlag: null, capacity: null, contestNote: null,
      checkIn: { date: 'Aug 5' }
    }
  ];

  var STORAGE_KEY = 'gradeflow-ta-tracker-checkins-v1';

  var STATUS_META = {
    onTrack: { label: 'On track', icon: icons.checkCircle },
    paceCheck: { label: 'Pace check recommended', icon: icons.alertTriangle },
    needsCheckin: { label: 'Needs check-in', icon: icons.alertTriangle },
    checkedIn: { label: 'Checked in', icon: icons.checkCircle }
  };

  var SEVERITY_RANK = { needsCheckin: 3, paceCheck: 2, checkedIn: 1, onTrack: 0 };

  /* ---------------------------------------------
     State
  ---------------------------------------------- */
  var data = buildData();
  var filterCourse = 'all';
  var expandedId = null;
  var sortState = { key: null, dir: 'asc' };

  /* ---------------------------------------------
     Persistence
  ---------------------------------------------- */
  function loadOverrides() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveOverrides(overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }

  function buildData() {
    var overrides = loadOverrides();
    return DEFAULT_DATA.map(function (ta) {
      var clone = JSON.parse(JSON.stringify(ta));
      if (overrides[clone.id]) {
        clone.severity = 'checkedIn';
        clone.checkIn = { date: overrides[clone.id].date };
      }
      clone.backlogPct = Math.round((clone.ungraded / clone.total) * 100);
      return clone;
    });
  }

  function formatToday() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /* ---------------------------------------------
     DOM refs
  ---------------------------------------------- */
  var summaryEl = document.getElementById('summary-strip');
  var tbody = document.getElementById('ta-table-body');
  var courseFilterEl = document.getElementById('course-filter');
  var announcer = document.getElementById('sr-announcer');
  var resetBtn = document.getElementById('reset-demo');

  /* ---------------------------------------------
     Derived helpers
  ---------------------------------------------- */
  function getCourses() {
    var seen = {};
    var list = [];
    DEFAULT_DATA.forEach(function (ta) {
      if (!seen[ta.courseCode]) {
        seen[ta.courseCode] = true;
        list.push({ code: ta.courseCode, name: ta.course });
      }
    });
    return list;
  }

  function getFiltered() {
    if (filterCourse === 'all') return data;
    return data.filter(function (ta) { return ta.courseCode === filterCourse; });
  }

  function getSorted(list) {
    if (!sortState.key) return list;
    var key = sortState.key;
    var dir = sortState.dir === 'asc' ? 1 : -1;
    return list.slice().sort(function (a, b) {
      var av, bv;
      if (key === 'severity') { av = SEVERITY_RANK[a.severity]; bv = SEVERITY_RANK[b.severity]; }
      else if (key === 'backlogPct') { av = a.backlogPct; bv = b.backlogPct; }
      else { av = a[key]; bv = b[key]; }
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }

  function firstName(name) { return name.split(' ')[0]; }

  function paceContext(ta) {
    var text = ta.backlogPct + '% of ' + firstName(ta.name) + "'s " + ta.course + ' submissions are ungraded, versus a ' +
      ta.courseAvgPct + '% course average.';
    if (ta.coldStart) {
      text += ' This course just started, so the comparison uses last term\'s baseline until enough data builds up here.';
    }
    return text;
  }

  /* ---------------------------------------------
     Render: summary strip
  ---------------------------------------------- */
  function renderSummary(list) {
    var needsCheckin = list.filter(function (t) { return t.severity === 'needsCheckin' || t.severity === 'paceCheck'; }).length;
    var selfFlagged = list.filter(function (t) { return t.selfFlag && t.selfFlag.active; }).length;
    var onTrack = list.filter(function (t) { return t.severity === 'onTrack'; }).length;

    summaryEl.innerHTML =
      statCard('icon-red', icons.alertTriangle, needsCheckin, 'Need a check-in') +
      statCard('icon-amber', icons.flag, selfFlagged, 'Self-flagged for help') +
      statCard('icon-green', icons.checkCircle, onTrack, 'On track');
  }

  function statCard(iconClass, iconSvg, value, label) {
    return '<div class="stat-card">' +
      '<span class="stat-icon ' + iconClass + '">' + iconSvg + '</span>' +
      '<span>' +
      '<span class="stat-value">' + value + '</span>' +
      '<div class="stat-label">' + label + '</div>' +
      '</span>' +
      '</div>';
  }

  /* ---------------------------------------------
     Render: signals
  ---------------------------------------------- */
  function renderSignals(ta) {
    var badges = '';
    if (ta.selfFlag && ta.selfFlag.active) {
      badges += '<span class="signal-icon" data-signal="self-flag" title="Self-flagged for help">' + icons.flag + '</span>';
    }
    if (ta.capacity) {
      badges += '<span class="signal-icon" data-signal="capacity" title="Private capacity constraint set">' + icons.clock + '</span>';
    }
    if (ta.contestNote) {
      badges += '<span class="signal-icon" data-signal="contest" title="TA added context to a flag">' + icons.chat + '</span>';
    }
    if (ta.coldStart) {
      badges += '<span class="signal-icon" data-signal="cold-start" title="Using historical baseline">' + icons.info + '</span>';
    }
    if (!badges) {
      return '<span class="no-signals">No signals</span>';
    }
    return '<div class="signal-icons">' + badges + '</div>';
  }

  /* ---------------------------------------------
     Render: action cell
  ---------------------------------------------- */
  function renderAction(ta, compact) {
    if (ta.checkIn) {
      return '<span class="checked-in-note">' + icons.checkCircle + 'Checked in ' + ta.checkIn.date + '</span>';
    }
    if (ta.severity === 'onTrack') {
      return '<span class="small">No action needed</span>';
    }
    return '<button type="button" class="btn btn-primary' + (compact ? ' btn-sm' : '') +
      '" data-action="log-checkin" data-ta-id="' + ta.id + '">Log check-in</button>';
  }

  /* ---------------------------------------------
     Render: table rows
  ---------------------------------------------- */
  function renderTableBody(list) {
    var html = list.map(function (ta) {
      var isExpanded = expandedId === ta.id;
      var meta = STATUS_META[ta.severity];
      var statusLabel = ta.severity === 'checkedIn' ? 'Checked in ' + ta.checkIn.date : meta.label;

      var mainRow = '<tr class="ta-row' + (isExpanded ? ' is-expanded' : '') + '">' +
        '<td>' +
          '<button type="button" class="expand-toggle" data-action="toggle" data-ta-id="' + ta.id + '" ' +
            'aria-expanded="' + isExpanded + '" aria-controls="detail-' + ta.id + '" ' +
            'aria-label="' + (isExpanded ? 'Collapse details for ' : 'Expand details for ') + ta.name + '">' +
            icons.chevron +
          '</button>' +
        '</td>' +
        '<td class="ta-name">' + ta.name + '</td>' +
        '<td class="ta-course">' + ta.course + '</td>' +
        '<td class="align-right">' + ta.ungraded + '/' + ta.total + '</td>' +
        '<td>' + renderPaceBar(ta) + '</td>' +
        '<td>' + renderSignals(ta) + '</td>' +
        '<td>' +
          '<span class="status-badge severity-' + ta.severity + '">' + meta.icon + statusLabel + '</span>' +
        '</td>' +
        '<td>' + renderAction(ta, true) + '</td>' +
      '</tr>';

      var detailRow = '';
      if (isExpanded) {
        detailRow = '<tr class="detail-row" id="detail-' + ta.id + '">' +
          '<td colspan="8">' + renderDetailPanel(ta) + '</td>' +
        '</tr>';
      }

      return mainRow + detailRow;
    }).join('');

    tbody.innerHTML = html;
  }

  function renderPaceBar(ta) {
    var fillPct = Math.min(100, ta.backlogPct);
    var avgPct = Math.min(100, ta.courseAvgPct);
    return '<div class="pace-wrap">' +
      '<div class="pace-bar">' +
        '<div class="pace-bar-fill severity-' + ta.severity + '" style="width:' + fillPct + '%"></div>' +
        '<div class="pace-bar-avg" style="left:' + avgPct + '%"></div>' +
      '</div>' +
      '<span class="pace-caption">' + ta.backlogPct + '% ungraded · course avg ' + ta.courseAvgPct + '%</span>' +
    '</div>';
  }

  function renderDetailPanel(ta) {
    var blocks = '';

    blocks += '<div class="detail-block">' +
      '<h4>Backlog</h4>' +
      '<p>' + ta.ungraded + ' of ' + ta.total + ' submissions ungraded, due ' + ta.dueDate + '.</p>' +
    '</div>';

    blocks += '<div class="detail-block">' +
      '<h4>Pace context</h4>' +
      '<p>' + paceContext(ta) + '</p>' +
    '</div>';

    if (ta.selfFlag && ta.selfFlag.active) {
      blocks += '<div class="detail-block">' +
        '<h4>Self-flag</h4>' +
        '<p>' + firstName(ta.name) + ' flagged "I need help" on ' + ta.selfFlag.date + '. They were notified their professor would see this.</p>' +
      '</div>';
    }

    if (ta.capacity) {
      blocks += '<div class="detail-block">' +
        '<h4>Private capacity constraint</h4>' +
        '<p>Max ' + ta.capacity.hours + ' hrs/week, set/changed ' + ta.capacity.setDate +
        '. Alerts compare against this limit instead of the course average. The reason isn\'t shared with you.</p>' +
      '</div>';
    }

    if (ta.contestNote) {
      blocks += '<div class="detail-block">' +
        '<h4>TA context on this flag</h4>' +
        '<p class="note-block">"' + ta.contestNote.text + '" — added ' + ta.contestNote.date + '</p>' +
      '</div>';
    }

    blocks += '<div class="detail-actions">' +
      renderAction(ta, false) +
      (ta.checkIn ? '' : '<span class="small">Logging a check-in is required follow-up — it\'s visible to you and ' + firstName(ta.name) + ', framed as a supportive touch-base, not a review.</span>') +
    '</div>';

    return '<div class="detail-panel">' + blocks + '</div>';
  }

  /* ---------------------------------------------
     Sort indicators
  ---------------------------------------------- */
  function updateSortIndicators() {
    document.querySelectorAll('.th-sort').forEach(function (btn) {
      var key = btn.getAttribute('data-sort-key');
      var span = btn.querySelector('.sort-arrow');
      if (!span) {
        span = document.createElement('span');
        span.className = 'sort-arrow';
        span.setAttribute('aria-hidden', 'true');
        btn.appendChild(span);
      }
      var th = btn.closest('th');
      if (sortState.key === key) {
        span.textContent = sortState.dir === 'asc' ? '▲' : '▼';
        th.setAttribute('aria-sort', sortState.dir === 'asc' ? 'ascending' : 'descending');
      } else {
        span.textContent = '↕';
        th.setAttribute('aria-sort', 'none');
      }
    });
  }

  /* ---------------------------------------------
     Full render
  ---------------------------------------------- */
  function render() {
    var filtered = getFiltered();
    var sorted = getSorted(filtered);
    renderSummary(filtered);
    renderTableBody(sorted);
    updateSortIndicators();
  }

  function rerenderAndFocus(taId) {
    render();
    var toggle = tbody.querySelector('[data-action="toggle"][data-ta-id="' + taId + '"]');
    if (toggle) toggle.focus();
  }

  function announce(message) {
    announcer.textContent = message;
  }

  /* ---------------------------------------------
     Events
  ---------------------------------------------- */
  tbody.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('[data-action="toggle"]');
    if (toggleBtn) {
      var toggleId = Number(toggleBtn.getAttribute('data-ta-id'));
      expandedId = expandedId === toggleId ? null : toggleId;
      rerenderAndFocus(toggleId);
      return;
    }

    var checkinBtn = e.target.closest('[data-action="log-checkin"]');
    if (checkinBtn) {
      var taId = Number(checkinBtn.getAttribute('data-ta-id'));
      var overrides = loadOverrides();
      var dateStr = formatToday();
      overrides[taId] = { date: dateStr };
      saveOverrides(overrides);
      data = buildData();
      var ta = data.filter(function (t) { return t.id === taId; })[0];
      announce('Check-in logged for ' + (ta ? ta.name : 'TA') + '. Status updated to checked in.');
      rerenderAndFocus(taId);
    }
  });

  document.querySelectorAll('.th-sort').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-sort-key');
      if (sortState.key === key) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.key = key;
        sortState.dir = 'asc';
      }
      render();
    });
  });

  courseFilterEl.addEventListener('change', function () {
    filterCourse = courseFilterEl.value;
    render();
  });

  resetBtn.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_KEY);
    data = buildData();
    expandedId = null;
    sortState = { key: null, dir: 'asc' };
    filterCourse = 'all';
    courseFilterEl.value = 'all';
    announce('Demo data reset.');
    render();
  });

  /* ---------------------------------------------
     Init
  ---------------------------------------------- */
  getCourses().forEach(function (course) {
    var opt = document.createElement('option');
    opt.value = course.code;
    opt.textContent = course.name;
    courseFilterEl.appendChild(opt);
  });

  render();
})();
