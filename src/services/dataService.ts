import { AttemptRecord, LeaderboardEntry, SessionSummary, StudentProfile } from '../types/math';

export interface HealthCheckResult {
  ok: boolean;
  mode: 'demo' | 'gas';
  latencyMs: number;
  message: string;
  spreadsheetName?: string;
  timestamp: string;
}

// Sample DEMO data clearly designated as DEMO
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    studentId: 'demo-st-01',
    displayName: 'Thỏ Trắng Thông Thái (Demo)',
    school: 'Tiểu học Thăng Long',
    className: '3A1',
    points: 240,
    completedCount: 24,
    badges: ['Huy hiệu Vàng', 'Chiến binh SGK', 'Thần đồng Hình học']
  },
  {
    rank: 2,
    studentId: 'demo-st-02',
    displayName: 'Sóc Nhanh Nhẹn (Demo)',
    school: 'Tiểu học Kim Đồng',
    className: '3C',
    points: 215,
    completedCount: 22,
    badges: ['Huy hiệu Bạc', 'Chiến binh SGK']
  },
  {
    rank: 3,
    studentId: 'demo-st-03',
    displayName: 'Gấu Chăm Chỉ (Demo)',
    school: 'Tiểu học Vinschool',
    className: '4A2',
    points: 190,
    completedCount: 20,
    badges: ['Huy hiệu Đồng']
  },
  {
    rank: 4,
    studentId: 'demo-st-04',
    displayName: 'Mèo Con Học Toán (Demo)',
    school: 'Tiểu học Chu Văn An',
    className: '3B',
    points: 165,
    completedCount: 18,
    badges: ['Khám phá Diện tích']
  },
  {
    rank: 5,
    studentId: 'demo-st-05',
    displayName: 'Họa Mi Siêng Năng (Demo)',
    school: 'Tiểu học Lê Ngọc Hân',
    className: '4C',
    points: 140,
    completedCount: 15,
    badges: ['Bé Khéo Tay']
  }
];

import { GOOGLE_APPS_SCRIPT_URL } from '../config';

class DataService {
  private endpointUrl: string = GOOGLE_APPS_SCRIPT_URL.trim();
  private forceDemoMode: boolean = false;
  private offlineAttemptQueue: AttemptRecord[] = [];
  private offlineSessionQueue: SessionSummary[] = [];

  constructor() {
    // If GOOGLE_APPS_SCRIPT_URL is provided, use it directly
    if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.trim().length > 0) {
      this.endpointUrl = GOOGLE_APPS_SCRIPT_URL.trim();
    } else {
      // Fallback to localStorage if any saved previously
      const savedUrl = localStorage.getItem('vqdt_gas_endpoint');
      if (savedUrl) {
        this.endpointUrl = savedUrl.trim();
      }
    }

    // Load offline queues
    try {
      const q = localStorage.getItem('vqdt_offline_attempts');
      if (q) this.offlineAttemptQueue = JSON.parse(q);
      const sq = localStorage.getItem('vqdt_offline_sessions');
      if (sq) this.offlineSessionQueue = JSON.parse(sq);
    } catch {
      this.offlineAttemptQueue = [];
      this.offlineSessionQueue = [];
    }
  }

  public isDemoMode(): boolean {
    if (this.forceDemoMode) return true;
    if (this.isGoogleAppsScriptEnvironment()) return false;
    return !this.endpointUrl || this.endpointUrl.trim().length === 0;
  }

  public setDemoMode(force: boolean): void {
    this.forceDemoMode = force;
    localStorage.setItem('vqdt_force_demo', String(force));
  }

  public getApiEndpoint(): string {
    return this.endpointUrl;
  }

  public setApiEndpoint(url: string): void {
    this.endpointUrl = url.trim();
    localStorage.setItem('vqdt_gas_endpoint', this.endpointUrl);
  }

  /**
   * Check if running directly inside Google Apps Script HTML Service iframe
   */
  public isGoogleAppsScriptEnvironment(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as unknown as { google?: { script?: { run?: unknown } } }).google?.script?.run !== 'undefined'
    );
  }

  /**
   * Health Check testing connection latency and backend responsiveness
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const start = performance.now();

    if (this.isDemoMode()) {
      return {
        ok: true,
        mode: 'demo',
        latencyMs: Math.round(performance.now() - start),
        message: 'Đang hoạt động ở Chế độ Xem thử (DEMO). Dữ liệu được lưu trữ an toàn trong trình duyệt.',
        timestamp: new Date().toISOString()
      };
    }

    // In Google Apps Script environment
    if (this.isGoogleAppsScriptEnvironment()) {
      return new Promise((resolve) => {
        try {
          const gas = (window as unknown as { google: { script: { run: {
            withSuccessHandler: (fn: (res: HealthCheckResult) => void) => {
              withFailureHandler: (errFn: (err: Error) => void) => { healthCheck: () => void }
            }
          } } } }).google.script.run;

          gas
            .withSuccessHandler((res: HealthCheckResult) => {
              resolve({
                ok: true,
                mode: 'gas',
                latencyMs: Math.round(performance.now() - start),
                message: 'Kết nối thành công với Google Apps Script!',
                spreadsheetName: res?.spreadsheetName || 'Google Sheets',
                timestamp: new Date().toISOString()
              });
            })
            .withFailureHandler((err: Error) => {
              resolve({
                ok: false,
                mode: 'gas',
                latencyMs: Math.round(performance.now() - start),
                message: `Lỗi kết nối Apps Script: ${err?.message || 'Không xác định'}`,
                timestamp: new Date().toISOString()
              });
            })
            .healthCheck();
        } catch (e) {
          resolve({
            ok: false,
            mode: 'gas',
            latencyMs: Math.round(performance.now() - start),
            message: `Lỗi gọi google.script.run: ${(e as Error)?.message}`,
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    // Call deployed Web App via HTTP GET
    try {
      const pingUrl = `${this.endpointUrl}${this.endpointUrl.includes('?') ? '&' : '?'}action=healthCheck&t=${Date.now()}`;
      const res = await fetch(pingUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      const data = await res.json();
      const latencyMs = Math.round(performance.now() - start);

      if (data && data.success) {
        return {
          ok: true,
          mode: 'gas',
          latencyMs,
          message: 'Kết nối Google Sheets Web App thành công!',
          spreadsheetName: data.spreadsheetName || 'Hệ thống Vương Quốc Diện Tích',
          timestamp: new Date().toISOString()
        };
      }
      return {
        ok: false,
        mode: 'gas',
        latencyMs,
        message: data?.message || 'Phản hồi không hợp lệ từ máy chủ.',
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        ok: false,
        mode: 'gas',
        latencyMs: Math.round(performance.now() - start),
        message: `Không thể kết nối đến Web App: ${(err as Error).message}. Vui lòng kiểm tra quyền truy cập Web App hoặc dùng Chế độ Xem thử.`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Register or fetch an existing student profile
   */
  public async registerStudent(
    profile: StudentProfile
  ): Promise<{ success: boolean; profile: StudentProfile; isExisting: boolean; message: string }> {
    // Always store profile locally for instant responsiveness
    localStorage.setItem(`vqdt_profile_${profile.studentId}`, JSON.stringify(profile));
    localStorage.setItem('vqdt_last_student_id', profile.studentId);

    if (this.isDemoMode()) {
      return {
        success: true,
        profile,
        isExisting: false,
        message: 'Đăng ký hồ sơ học tập thành công (Chế độ Xem thử).'
      };
    }

    try {
      const payload = {
        action: 'registerStudent',
        studentId: profile.studentId,
        fullName: profile.fullName,
        displayName: profile.displayName || profile.fullName,
        school: profile.school,
        className: profile.className,
        avatarId: profile.avatarId,
        createdAt: profile.createdAt,
        lastActiveAt: profile.lastActiveAt
      };

      const result = await this.postToGas(payload);
      if (result && result.success) {
        return {
          success: true,
          profile: (result.profile as StudentProfile) || profile,
          isExisting: Boolean(result.isExisting),
          message: 'Đã lưu hồ sơ học sinh vào Google Sheets!'
        };
      }
      return {
        success: true, // Graceful fallback
        profile,
        isExisting: false,
        message: 'Lưu vào bộ nhớ máy, máy chủ phản hồi chậm: ' + (result?.message || '')
      };
    } catch {
      return {
        success: true,
        profile,
        isExisting: false,
        message: 'Đã ghi nhận trên máy của bạn (sẽ tự động đồng bộ khi có kết nối lại).'
      };
    }
  }

  /**
   * Record a single question attempt with idempotency
   */
  public async recordAttempt(record: AttemptRecord): Promise<{ success: boolean; message: string }> {
    // Save to local attempt log
    const key = `vqdt_attempts_${record.studentId}`;
    try {
      const existing: AttemptRecord[] = JSON.parse(localStorage.getItem(key) || '[]');
      const alreadyHas = existing.some(
        (a) => a.sessionId === record.sessionId && a.questionId === record.questionId && a.attemptNo === record.attemptNo
      );
      if (!alreadyHas) {
        existing.push(record);
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch {
      // Safe fallback
    }

    if (this.isDemoMode()) {
      return { success: true, message: 'Đã ghi nhận lượt trả lời (Chế độ Xem thử).' };
    }

    try {
      const payload = {
        action: 'recordAttempt',
        attemptId: record.attemptId,
        sessionId: record.sessionId,
        studentId: record.studentId,
        questionId: record.questionId,
        questionType: record.questionType,
        answerJson: record.answerJson,
        attemptNo: record.attemptNo,
        isCorrect: record.isCorrect,
        pointsAwarded: record.pointsAwarded,
        createdAt: record.createdAt
      };

      const result = await this.postToGas(payload);
      if (result && result.success) {
        return { success: true, message: 'Đã đồng bộ lượt trả lời lên Google Sheets!' };
      }
      this.enqueueOfflineAttempt(record);
      return { success: true, message: 'Đã lưu cục bộ (sẽ gửi lên Google Sheets khi hoàn tất bài học).' };
    } catch {
      this.enqueueOfflineAttempt(record);
      return { success: true, message: 'Đã lưu cục bộ.' };
    }
  }

  /**
   * Finish learning session & update national leaderboard
   */
  public async finishSession(
    summary: SessionSummary
  ): Promise<{ success: boolean; synced: boolean; message: string }> {
    // Save locally first
    try {
      const listKey = `vqdt_sessions_${summary.studentId}`;
      const sessions: SessionSummary[] = JSON.parse(localStorage.getItem(listKey) || '[]');
      sessions.push(summary);
      localStorage.setItem(listKey, JSON.stringify(sessions));
    } catch {
      // Ignore
    }

    if (this.isDemoMode()) {
      return {
        success: true,
        synced: false,
        message: 'Hoàn thành phiên học (Chế độ xem thử Demo).'
      };
    }

    try {
      const payload = {
        action: 'finishSession',
        ...summary,
        pendingAttempts: this.offlineAttemptQueue.filter((a) => a.studentId === summary.studentId)
      };

      const result = await this.postToGas(payload);
      if (result && result.success) {
        // Clear synced queue items
        this.offlineAttemptQueue = this.offlineAttemptQueue.filter((a) => a.studentId !== summary.studentId);
        localStorage.setItem('vqdt_offline_attempts', JSON.stringify(this.offlineAttemptQueue));

        return {
          success: true,
          synced: true,
          message: 'Tuyệt vời! Kết quả và điểm số đã được đồng bộ lên Google Sheets thành công!'
        };
      }

      this.offlineSessionQueue.push(summary);
      localStorage.setItem('vqdt_offline_sessions', JSON.stringify(this.offlineSessionQueue));

      return {
        success: true,
        synced: false,
        message: 'Đã hoàn thành! Đang chờ kết nối lại Google Sheets để xếp hạng toàn quốc.'
      };
    } catch {
      this.offlineSessionQueue.push(summary);
      localStorage.setItem('vqdt_offline_sessions', JSON.stringify(this.offlineSessionQueue));

      return {
        success: true,
        synced: false,
        message: 'Chưa thể gửi tới Google Sheets do kết nối mạng. Bạn có thể nhấn Thử lại.'
      };
    }
  }

  /**
   * Get leaderboard (today, week, or all-time)
   */
  public async getLeaderboard(
    period: 'today' | 'week' | 'all',
    currentStudent?: StudentProfile | null
  ): Promise<{ entries: LeaderboardEntry[]; isDemo: boolean; message?: string }> {
    if (this.isDemoMode()) {
      // Build simulated demo leaderboard including current student
      const list = [...DEMO_LEADERBOARD];
      if (currentStudent) {
        const studentScore = currentStudent.points || 0;
        const exists = list.some((e) => e.studentId === currentStudent.studentId);
        if (!exists) {
          list.push({
            rank: 0,
            studentId: currentStudent.studentId,
            displayName: (currentStudent.displayName || currentStudent.fullName) + ' (Bạn)',
            school: currentStudent.school,
            className: currentStudent.className,
            points: studentScore,
            completedCount: currentStudent.completedQuestions || 0,
            badges: currentStudent.badges || [],
            isCurrentUser: true
          });
        }
      }

      // Sort by points desc
      list.sort((a, b) => b.points - a.points);
      list.forEach((item, idx) => {
        item.rank = idx + 1;
        if (currentStudent && item.studentId === currentStudent.studentId) {
          item.isCurrentUser = true;
        }
      });

      return {
        entries: list,
        isDemo: true,
        message: 'Dữ liệu bảng xếp hạng mẫu (Chế độ Xem thử - DEMO).'
      };
    }

    try {
      const url = `${this.endpointUrl}${this.endpointUrl.includes('?') ? '&' : '?'}action=getLeaderboard&period=${period}&t=${Date.now()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.success && Array.isArray(data.entries)) {
        const entries: LeaderboardEntry[] = data.entries.map((item: LeaderboardEntry, idx: number) => ({
          ...item,
          rank: idx + 1,
          isCurrentUser: currentStudent?.studentId === item.studentId
        }));
        return {
          entries,
          isDemo: false
        };
      }
      throw new Error(data?.message || 'Không thể lấy dữ liệu bảng xếp hạng');
    } catch {
      // Fallback with demo notice
      return {
        entries: DEMO_LEADERBOARD,
        isDemo: true,
        message: 'Không kết nối được Google Sheets. Đang hiển thị bảng xếp hạng mẫu.'
      };
    }
  }

  /**
   * Post JSON data to Google Apps Script Web App
   */
  private async postToGas(payload: unknown): Promise<{ success: boolean; message?: string; [key: string]: unknown }> {
    if (this.isGoogleAppsScriptEnvironment()) {
      return new Promise((resolve, reject) => {
        try {
          const gas = (window as unknown as { google: { script: { run: {
            withSuccessHandler: (fn: (res: { success: boolean; message?: string }) => void) => {
              withFailureHandler: (errFn: (err: Error) => void) => { dispatchAction: (p: unknown) => void }
            }
          } } } }).google.script.run;

          gas
            .withSuccessHandler((res) => resolve(res))
            .withFailureHandler((err) => reject(err))
            .dispatchAction(payload);
        } catch (e) {
          reject(e);
        }
      });
    }

    const res = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Standard CORS safe type for GAS Web Apps
      },
      body: JSON.stringify(payload)
    });

    return await res.json();
  }

  private enqueueOfflineAttempt(record: AttemptRecord) {
    this.offlineAttemptQueue.push(record);
    try {
      localStorage.setItem('vqdt_offline_attempts', JSON.stringify(this.offlineAttemptQueue));
    } catch {
      // Ignore
    }
  }
}

export const dataService = new DataService();
