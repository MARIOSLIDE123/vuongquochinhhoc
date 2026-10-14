/**
 * =========================================================================
 * VƯƠNG QUỐC DIỆN TÍCH - GOOGLE APPS SCRIPT BACKEND
 * Hệ thống máy chủ xử lý dữ liệu và Bảng xếp hạng toàn quốc
 * =========================================================================
 */

var SHEET_HOC_SINH = 'HOC_SINH';
var SHEET_LUOT_TRA_LOI = 'LUOT_TRA_LOI';
var SHEET_PHIEN_HOC = 'PHIEN_HOC';
var SHEET_XEP_HANG = 'XEP_HANG';

/**
 * Khởi tạo cấu trúc các trang tính và tiêu đề cột
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet HOC_SINH
  var sHocSinh = ss.getSheetByName(SHEET_HOC_SINH);
  if (!sHocSinh) {
    sHocSinh = ss.insertSheet(SHEET_HOC_SINH);
    sHocSinh.appendRow([
      'studentId',
      'fullName',
      'displayName',
      'school',
      'className',
      'avatarId',
      'points',
      'completedQuestions',
      'createdAt',
      'lastActiveAt'
    ]);
    formatHeaderRow(sHocSinh);
  }

  // 2. Sheet LUOT_TRA_LOI
  var sLuot = ss.getSheetByName(SHEET_LUOT_TRA_LOI);
  if (!sLuot) {
    sLuot = ss.insertSheet(SHEET_LUOT_TRA_LOI);
    sLuot.appendRow([
      'attemptId',
      'sessionId',
      'studentId',
      'questionId',
      'questionType',
      'answerJson',
      'attemptNo',
      'isCorrect',
      'pointsAwarded',
      'createdAt'
    ]);
    formatHeaderRow(sLuot);
  }

  // 3. Sheet PHIEN_HOC
  var sPhien = ss.getSheetByName(SHEET_PHIEN_HOC);
  if (!sPhien) {
    sPhien = ss.insertSheet(SHEET_PHIEN_HOC);
    sPhien.appendRow([
      'sessionId',
      'studentId',
      'startedAt',
      'completedAt',
      'totalQuestions',
      'correctFirstTry',
      'correctSecondTry',
      'wrongCount',
      'totalPoints',
      'xp',
      'durationSeconds'
    ]);
    formatHeaderRow(sPhien);
  }

  // 4. Sheet XEP_HANG (bộ nhớ đệm)
  var sXepHang = ss.getSheetByName(SHEET_XEP_HANG);
  if (!sXepHang) {
    sXepHang = ss.insertSheet(SHEET_XEP_HANG);
    sXepHang.appendRow([
      'studentId',
      'displayName',
      'school',
      'className',
      'totalPoints',
      'completedCount',
      'lastUpdatedAt'
    ]);
    formatHeaderRow(sXepHang);
  }

  return { success: true, message: 'Đã khởi tạo thành công 4 bảng tính!' };
}

function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  range.setBackground('#0284c7');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Health check kết nối hệ thống
 */
function healthCheck() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    success: true,
    mode: 'gas',
    spreadsheetName: ss.getName(),
    timestamp: new Date().toISOString(),
    message: 'Hệ thống máy chủ Google Apps Script đang hoạt động ổn định!'
  };
}

/**
 * Đăng ký hoặc lấy thông tin học sinh
 */
function registerStudent(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_HOC_SINH);
    if (!sheet) {
      setupSheets();
      sheet = ss.getSheetByName(SHEET_HOC_SINH);
    }

    var data = sheet.getDataRange().getValues();
    var studentId = payload.studentId;
    var existingRow = -1;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == studentId) {
        existingRow = i + 1;
        break;
      }
    }

    var now = new Date().toISOString();
    if (existingRow > 0) {
      // Cập nhật hoạt động
      sheet.getRange(existingRow, 10).setValue(now);
      var currentPoints = Number(data[existingRow - 1][6]) || 0;
      var completedCount = Number(data[existingRow - 1][7]) || 0;

      return {
        success: true,
        isExisting: true,
        profile: {
          studentId: studentId,
          fullName: data[existingRow - 1][1],
          displayName: data[existingRow - 1][2],
          school: data[existingRow - 1][3],
          className: data[existingRow - 1][4],
          avatarId: data[existingRow - 1][5],
          points: currentPoints,
          completedQuestions: completedCount,
          lastActiveAt: now
        }
      };
    } else {
      // Thêm mới
      sheet.appendRow([
        studentId,
        payload.fullName,
        payload.displayName || payload.fullName,
        payload.school,
        payload.className,
        payload.avatarId || 'be_vuong',
        0,
        0,
        now,
        now
      ]);

      return {
        success: true,
        isExisting: false,
        profile: {
          studentId: studentId,
          fullName: payload.fullName,
          displayName: payload.displayName || payload.fullName,
          school: payload.school,
          className: payload.className,
          avatarId: payload.avatarId || 'be_vuong',
          points: 0,
          completedQuestions: 0,
          createdAt: now,
          lastActiveAt: now
        }
      };
    }
  } catch (err) {
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Ghi nhận một lượt trả lời (có chống ghi trùng bằng attemptId)
 */
function recordAttempt(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_LUOT_TRA_LOI);
    if (!sheet) {
      setupSheets();
      sheet = ss.getSheetByName(SHEET_LUOT_TRA_LOI);
    }

    // Kiểm tra trùng attemptId
    var attemptId = payload.attemptId;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == attemptId) {
        return { success: true, message: 'Lượt trả lời đã được lưu trước đó.' };
      }
    }

    sheet.appendRow([
      attemptId,
      payload.sessionId,
      payload.studentId,
      payload.questionId,
      payload.questionType,
      JSON.stringify(payload.answerJson || ''),
      payload.attemptNo,
      payload.isCorrect ? true : false,
      payload.pointsAwarded || 0,
      payload.createdAt || new Date().toISOString()
    ]);

    return { success: true, message: 'Đã lưu lượt trả lời thành công.' };
  } catch (err) {
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Hoàn thành phiên học và cập nhật điểm tích lũy + bảng xếp hạng
 */
function finishSession(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sPhien = ss.getSheetByName(SHEET_PHIEN_HOC);
    var sHocSinh = ss.getSheetByName(SHEET_HOC_SINH);
    if (!sPhien || !sHocSinh) {
      setupSheets();
      sPhien = ss.getSheetByName(SHEET_PHIEN_HOC);
      sHocSinh = ss.getSheetByName(SHEET_HOC_SINH);
    }

    // 1. Ghi nhận phiên học
    sPhien.appendRow([
      payload.sessionId,
      payload.studentId,
      payload.startedAt,
      payload.completedAt || new Date().toISOString(),
      payload.totalQuestions,
      payload.correctFirstTry,
      payload.correctSecondTry,
      payload.wrongCount,
      payload.totalPoints,
      payload.xp,
      payload.durationSeconds
    ]);

    // 2. Cập nhật điểm cho học sinh
    var studentData = sHocSinh.getDataRange().getValues();
    var studentRow = -1;
    for (var i = 1; i < studentData.length; i++) {
      if (studentData[i][0] == payload.studentId) {
        studentRow = i + 1;
        break;
      }
    }

    if (studentRow > 0) {
      var oldPoints = Number(studentData[studentRow - 1][6]) || 0;
      var oldCount = Number(studentData[studentRow - 1][7]) || 0;
      var newPoints = oldPoints + (Number(payload.totalPoints) || 0);
      var newCount = oldCount + (Number(payload.totalQuestions) || 0);

      sHocSinh.getRange(studentRow, 7).setValue(newPoints);
      sHocSinh.getRange(studentRow, 8).setValue(newCount);
      sHocSinh.getRange(studentRow, 10).setValue(new Date().toISOString());
    }

    // 3. Cập nhật bảng xếp hạng cache
    updateLeaderboardCache();

    return {
      success: true,
      message: 'Đã hoàn tất đồng bộ phiên học và cập nhật Bảng Xếp Hạng!'
    };
  } catch (err) {
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Cập nhật bảng xếp hạng từ dữ liệu học sinh thực tế
 */
function updateLeaderboardCache() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sHocSinh = ss.getSheetByName(SHEET_HOC_SINH);
  var sXepHang = ss.getSheetByName(SHEET_XEP_HANG);
  if (!sHocSinh || !sXepHang) return;

  var data = sHocSinh.getDataRange().getValues();
  if (data.length <= 1) return;

  var list = [];
  for (var i = 1; i < data.length; i++) {
    var pts = Number(data[i][6]) || 0;
    list.push({
      studentId: data[i][0],
      displayName: data[i][2] || data[i][1],
      school: data[i][3],
      className: data[i][4],
      totalPoints: pts,
      completedCount: Number(data[i][7]) || 0
    });
  }

  // Sắp xếp điểm giảm dần
  list.sort(function (a, b) {
    return b.totalPoints - a.totalPoints;
  });

  // Ghi lại bảng xếp hạng
  sXepHang.clearContents();
  sXepHang.appendRow([
    'studentId',
    'displayName',
    'school',
    'className',
    'totalPoints',
    'completedCount',
    'lastUpdatedAt'
  ]);
  formatHeaderRow(sXepHang);

  var rowsToInsert = [];
  var now = new Date().toISOString();
  for (var j = 0; j < Math.min(100, list.length); j++) {
    rowsToInsert.push([
      list[j].studentId,
      list[j].displayName,
      list[j].school,
      list[j].className,
      list[j].totalPoints,
      list[j].completedCount,
      now
    ]);
  }

  if (rowsToInsert.length > 0) {
    sXepHang.getRange(2, 1, rowsToInsert.length, 7).setValues(rowsToInsert);
  }
}

/**
 * Lấy dữ liệu bảng xếp hạng
 */
function getLeaderboard(period) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sHocSinh = ss.getSheetByName(SHEET_HOC_SINH);
  if (!sHocSinh) {
    setupSheets();
    return { success: true, entries: [] };
  }

  var data = sHocSinh.getDataRange().getValues();
  var entries = [];

  for (var i = 1; i < data.length; i++) {
    entries.push({
      rank: 0,
      studentId: data[i][0],
      displayName: data[i][2] || data[i][1],
      school: data[i][3],
      className: data[i][4],
      points: Number(data[i][6]) || 0,
      completedCount: Number(data[i][7]) || 0,
      badges: ['Huy hiệu Học Tập']
    });
  }

  // Sắp xếp theo điểm
  entries.sort(function (a, b) {
    return b.points - a.points;
  });

  entries = entries.slice(0, 50).map(function (item, idx) {
    item.rank = idx + 1;
    return item;
  });

  return { success: true, entries: entries };
}

/**
 * Dispatcher cho các hàm gọi từ google.script.run
 */
function dispatchAction(payload) {
  if (!payload || !payload.action) {
    return { success: false, message: 'Thiếu tham số action' };
  }

  switch (payload.action) {
    case 'healthCheck':
      return healthCheck();
    case 'registerStudent':
      return registerStudent(payload);
    case 'recordAttempt':
      return recordAttempt(payload);
    case 'finishSession':
      return finishSession(payload);
    case 'getLeaderboard':
      return getLeaderboard(payload.period);
    default:
      return { success: false, message: 'Action không hợp lệ: ' + payload.action };
  }
}

/**
 * Xử lý HTTP GET (cho Web App endpoint)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'healthCheck';
  var result;

  if (action === 'healthCheck') {
    result = healthCheck();
  } else if (action === 'getLeaderboard') {
    var period = (e.parameter && e.parameter.period) || 'all';
    result = getLeaderboard(period);
  } else {
    result = { success: false, message: 'Action không hỗ trợ qua GET: ' + action };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Xử lý HTTP POST (cho Web App endpoint)
 */
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    var payload = JSON.parse(raw);
    var result = dispatchAction(payload);

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: 'Lỗi xử lý POST: ' + err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
