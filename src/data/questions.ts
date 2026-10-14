import { Question } from '../types/math';

export const QUESTIONS: Question[] = [
  // ==========================================
  // PHẦN BÀI TẬP SGK (THEO SÁCH GIÁO KHOA)
  // ==========================================
  {
    id: 'sgk-1a',
    category: 'sgk',
    level: 1,
    title: 'Bài 1a (SGK): Tính diện tích hình vuông',
    description: 'Tính diện tích hình vuông có cạnh 9 cm.',
    questionType: 'single_choice',
    points: 10,
    options: ['81 cm²', '36 cm²', '18 cm²', '81 cm'],
    correctAnswer: '81 cm²',
    hint: 'Nhớ lại công thức: Muốn tính diện tích hình vuông, ta lấy độ dài một cạnh nhân với chính nó (S = a × a).',
    explanation:
      'Diện tích hình vuông là: 9 × 9 = 81 (cm²). Đáp số: 81 cm². (Lưu ý đơn vị đo diện tích là cm², không phải cm hay chu vi 36 cm).',
    geometry: {
      shape: 'square',
      side: 9,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Cạnh: 9 cm',
      stepSvgData: { showFormula: true, showGrid: true }
    }
  },
  {
    id: 'sgk-1b',
    category: 'sgk',
    level: 1,
    title: 'Bài 1b (SGK): Tính diện tích hình chữ nhật',
    description: 'Tính diện tích hình chữ nhật có chiều dài 9 cm và chiều rộng 6 cm.',
    questionType: 'single_choice',
    points: 10,
    options: ['54 cm²', '30 cm²', '54 cm', '15 cm²'],
    correctAnswer: '54 cm²',
    hint: 'Muốn tính diện tích hình chữ nhật, ta lấy chiều dài nhân với chiều rộng (cùng đơn vị đo): S = a × b.',
    explanation:
      'Diện tích hình chữ nhật là: 9 × 6 = 54 (cm²). Đáp số: 54 cm². Hãy chú ý phân biệt diện tích (cm²) và chu vi (9 + 6) × 2 = 30 cm nhé!',
    geometry: {
      shape: 'rectangle',
      width: 9,
      height: 6,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Dài: 9 cm, Rộng: 6 cm',
      stepSvgData: { showFormula: true, showGrid: true }
    }
  },
  {
    id: 'sgk-2',
    category: 'sgk',
    level: 2,
    title: 'Bài 2 (SGK): Chiều dài gấp đôi chiều rộng',
    description:
      'Một hình chữ nhật có chiều rộng 6 cm, chiều dài gấp đôi chiều rộng. Tính diện tích hình chữ nhật đó.',
    questionType: 'fill_in',
    unitLabel: 'cm²',
    points: 10,
    correctAnswer: 72,
    hint: 'Bài toán chưa cho biết chiều dài. Trước hết, con hãy tìm chiều dài bằng cách lấy chiều rộng nhân 2, sau đó tính diện tích!',
    explanation:
      'Bước 1: Chiều dài hình chữ nhật là: 6 × 2 = 12 (cm).\nBước 2: Diện tích hình chữ nhật là: 12 × 6 = 72 (cm²).\nĐáp số: 72 cm².',
    geometry: {
      shape: 'rectangle',
      width: 12,
      height: 6,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Rộng: 6 cm | Dài = 6 × 2 = 12 cm',
      subLabel: 'Tìm chiều dài trước khi tính diện tích',
      stepSvgData: { showFormula: true, highlightArea: true }
    }
  },
  {
    id: 'sgk-3',
    category: 'sgk',
    level: 3,
    title: 'Bài 3 (SGK): Các miếng bìa hình ngôi nhà',
    description:
      'Xem ba miếng bìa hình ngôi nhà A, B, C vẽ trên lưới ô vuông đơn vị dưới đây. Hai miếng bìa nào có diện tích bằng nhau?',
    questionType: 'single_choice',
    points: 10,
    options: [
      'Miếng bìa B và C',
      'Miếng bìa A và B',
      'Miếng bìa A và C',
      'Cả ba miếng bìa đều bằng nhau'
    ],
    correctAnswer: 'Miếng bìa B và C',
    hint: 'Con hãy đếm cẩn thận số ô vuông ở phần mái và phần thân nhà của từng hình, nhớ trừ đi phần cửa và cửa sổ bị khoét nhé!',
    explanation:
      'Cùng tính diện tích từng miếng bìa:\n- Hình A: Mái tam giác đáy 6 ô, cao 3 ô (diện tích = 9 ô). Thân nhà 4 × 3 = 12 ô. Tổng A = 9 + 12 = 21 ô vuông.\n- Hình B: Mái 9 ô; Thân nhà 6 × 3 = 18 ô, trừ cửa 2 × 2 = 4 ô. Tổng B = 9 + 18 - 4 = 23 ô vuông.\n- Hình C: Mái 9 ô; Thân nhà 6 × 3 = 18 ô, trừ 3 cửa sổ có tổng 4 ô. Tổng C = 9 + 18 - 4 = 23 ô vuông.\n=> Hình B và hình C có diện tích bằng nhau (đều bằng 23 ô vuông đơn vị).',
    geometry: {
      shape: 'house_cards',
      unit: 'ô vuông',
      unitSquare: 'ô vuông',
      label: 'Lưới ô vuông đơn vị',
      stepSvgData: { showGrid: true }
    }
  },
  {
    id: 'sgk-4',
    category: 'sgk',
    level: 2,
    title: 'Bài 4 (SGK): Vườn rau hình vuông của bác Nông Dân',
    description: 'Một vườn rau hình vuông có chu vi 36 m. Tính diện tích của vườn rau đó.',
    questionType: 'single_choice',
    points: 10,
    options: ['81 m²', '144 m²', '81 m', '36 m²'],
    correctAnswer: '81 m²',
    hint: 'Hình vuông có 4 cạnh bằng nhau. Chu vi là tổng 4 cạnh (Cạnh × 4 = 36 m). Con hãy tìm độ dài một cạnh trước, rồi tính diện tích (Cạnh × Cạnh)!',
    explanation:
      'Lời giải:\n- Cạnh của vườn rau hình vuông là: 36 : 4 = 9 (m)\n- Diện tích vườn rau đó là: 9 × 9 = 81 (m²)\nĐáp số: 81 m².',
    geometry: {
      shape: 'garden',
      side: 9,
      perimeter: 36,
      unit: 'm',
      unitSquare: 'm²',
      label: 'Chu vi vườn rau: 36 m',
      stepSvgData: { showFormula: true, highlightArea: true }
    }
  },

  // ==========================================
  // NGÂN HÀNG CÂU HỎI MỞ RỘNG (20 CÂU)
  // ==========================================
  {
    id: 'q-5',
    category: 'practice',
    level: 1,
    title: 'Câu 5: Tính diện tích hình vuông cơ bản',
    description: 'Một hình vuông có cạnh bằng 7 cm. Diện tích của hình vuông đó bằng bao nhiêu?',
    questionType: 'single_choice',
    points: 10,
    options: ['49 cm²', '28 cm²', '14 cm²', '49 cm'],
    correctAnswer: '49 cm²',
    hint: 'Áp dụng công thức tính diện tích hình vuông: S = cạnh × cạnh.',
    explanation: 'Diện tích hình vuông là: 7 × 7 = 49 (cm²).',
    geometry: {
      shape: 'square',
      side: 7,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Cạnh: 7 cm'
    }
  },
  {
    id: 'q-6',
    category: 'practice',
    level: 1,
    title: 'Câu 6: Tính diện tích hình chữ nhật',
    description: 'Một hình chữ nhật có chiều dài 12 cm và chiều rộng 4 cm. Tính diện tích hình chữ nhật đó.',
    questionType: 'single_choice',
    points: 10,
    options: ['48 cm²', '32 cm²', '16 cm²', '48 m²'],
    correctAnswer: '48 cm²',
    hint: 'Lấy chiều dài nhân với chiều rộng: S = a × b.',
    explanation: 'Diện tích hình chữ nhật là: 12 × 4 = 48 (cm²).',
    geometry: {
      shape: 'rectangle',
      width: 12,
      height: 4,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Dài: 12 cm, Rộng: 4 cm'
    }
  },
  {
    id: 'q-7',
    category: 'practice',
    level: 1,
    title: 'Câu 7: Điền số còn thiếu',
    description: 'Hình vuông có cạnh 8 cm. Hãy điền số đo diện tích vào ô trống:',
    questionType: 'fill_in',
    unitLabel: 'cm²',
    points: 10,
    correctAnswer: 64,
    hint: 'Con lấy 8 nhân với 8 nhé!',
    explanation: 'Diện tích hình vuông là: 8 × 8 = 64 (cm²). Số cần điền là 64.',
    geometry: {
      shape: 'square',
      side: 8,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Cạnh: 8 cm'
    }
  },
  {
    id: 'q-8',
    category: 'practice',
    level: 1,
    title: 'Câu 8: Chọn công thức đúng',
    description: 'Gọi a là độ dài cạnh hình vuông. Công thức đúng để tính diện tích S của hình vuông là gì?',
    questionType: 'single_choice',
    points: 10,
    options: ['S = a × a', 'S = a × 4', 'S = a + a', 'S = (a + a) × 2'],
    correctAnswer: 'S = a × a',
    hint: 'Diện tích hình vuông bằng độ dài cạnh nhân với chính nó. Đừng nhầm lẫn với chu vi là a × 4 nhé!',
    explanation: 'Công thức tính diện tích hình vuông là S = a × a. Còn S = a × 4 là công thức tính chu vi.',
    geometry: {
      shape: 'square',
      side: 6,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Cạnh a'
    }
  },
  {
    id: 'q-9',
    category: 'practice',
    level: 1,
    title: 'Câu 9: Chọn nhiều đáp án đúng - Đơn vị đo diện tích',
    description: 'Trong các đơn vị sau, những đơn vị nào là đơn vị đo diện tích? (Chọn tất cả đáp án đúng)',
    questionType: 'multi_choice',
    points: 10,
    options: ['cm', 'cm²', 'm', 'm²'],
    correctAnswer: ['cm²', 'm²'],
    hint: 'Đơn vị đo diện tích luôn có số 2 nhỏ ở phía trên (đọc là xăng-ti-mét vuông, mét vuông).',
    explanation:
      'cm² (xăng-ti-mét vuông) và m² (mét vuông) là các đơn vị đo diện tích. Còn cm và m là đơn vị đo độ dài.',
    geometry: {
      shape: 'grid',
      gridRows: 3,
      gridCols: 3,
      unit: 'cm',
      unitSquare: 'cm²',
      label: '1 ô vuông = 1 cm²'
    }
  },
  {
    id: 'q-10',
    category: 'practice',
    level: 1,
    title: 'Câu 10: Phát hiện lỗi sai',
    description:
      'Một hình chữ nhật có chiều dài 8 cm và chiều rộng 5 cm. Bạn An tính diện tích là: 8 + 5 = 13 cm². Cách tính của An đúng hay sai?',
    questionType: 'true_false',
    points: 10,
    options: ['Đúng', 'Sai'],
    correctAnswer: false,
    hint: 'Để tính diện tích hình chữ nhật ta dùng phép nhân (chiều dài nhân chiều rộng), chứ không dùng phép cộng.',
    explanation:
      'Sai! Bạn An đã nhầm phép nhân thành phép cộng. Cách tính đúng phải là: 8 × 5 = 40 (cm²).',
    geometry: {
      shape: 'rectangle',
      width: 8,
      height: 5,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Dài: 8 cm, Rộng: 5 cm'
    }
  },
  {
    id: 'q-11',
    category: 'practice',
    level: 2,
    title: 'Câu 11: Ghép cột - Cạnh hình vuông và Diện tích',
    description: 'Nối từng độ dài cạnh hình vuông ở cột bên trái với diện tích tương ứng ở cột bên phải:',
    questionType: 'match_pairs',
    points: 10,
    matchPairs: [
      { left: 'Cạnh 3 cm', right: '9 cm²' },
      { left: 'Cạnh 4 cm', right: '16 cm²' },
      { left: 'Cạnh 6 cm', right: '36 cm²' }
    ],
    correctAnswer: {
      'Cạnh 3 cm': '9 cm²',
      'Cạnh 4 cm': '16 cm²',
      'Cạnh 6 cm': '36 cm²'
    },
    hint: 'Lấy từng cạnh nhân với chính nó: 3 × 3 = ?, 4 × 4 = ?, 6 × 6 = ?',
    explanation:
      'Kết quả nối đúng:\n- Cạnh 3 cm → Diện tích: 3 × 3 = 9 cm²\n- Cạnh 4 cm → Diện tích: 4 × 4 = 16 cm²\n- Cạnh 6 cm → Diện tích: 6 × 6 = 36 cm²',
    geometry: {
      shape: 'square',
      side: 4,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Nối cạnh với diện tích tương ứng'
    }
  },
  {
    id: 'q-12',
    category: 'practice',
    level: 2,
    title: 'Câu 12: Hoàn thành phép tính',
    description:
      'Một hình chữ nhật có chiều dài 10 cm, chiều rộng 3 cm. Kéo hoặc chọn các số thích hợp vào ô trống để hoàn thiện phép tính diện tích:',
    questionType: 'drag_drop',
    points: 10,
    dragItems: ['10', '3', '30', '13', '26'],
    dragSlots: [
      { id: 's1', expected: '10', label: 'Chiều dài' },
      { id: 's2', expected: '3', label: 'Chiều rộng' },
      { id: 's3', expected: '30', label: 'Diện tích (cm²)' }
    ],
    correctAnswer: { s1: '10', s2: '3', s3: '30' },
    hint: 'Phép tính diện tích hình chữ nhật là: [Dài] × [Rộng] = [Diện tích].',
    explanation: 'Phép tính hoàn chỉnh: 10 × 3 = 30 (cm²).',
    geometry: {
      shape: 'rectangle',
      width: 10,
      height: 3,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Dài: 10 cm, Rộng: 3 cm'
    }
  },
  {
    id: 'q-13',
    category: 'practice',
    level: 1,
    title: 'Câu 13: Tính diện tích hình chữ nhật',
    description: 'Một hình chữ nhật có chiều dài 14 cm và chiều rộng 3 cm. Diện tích của hình chữ nhật là:',
    questionType: 'single_choice',
    points: 10,
    options: ['42 cm²', '34 cm²', '17 cm²', '42 cm'],
    correctAnswer: '42 cm²',
    hint: 'Thực hiện phép nhân: 14 × 3.',
    explanation: 'Diện tích hình chữ nhật là: 14 × 3 = 42 (cm²).',
    geometry: {
      shape: 'rectangle',
      width: 14,
      height: 3,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Dài: 14 cm, Rộng: 3 cm'
    }
  },
  {
    id: 'q-14',
    category: 'practice',
    level: 2,
    title: 'Câu 14: Bài toán ngược về hình vuông',
    description:
      'Một hình vuông có diện tích bằng 49 cm². Hỏi độ dài mỗi cạnh của hình vuông đó bằng bao nhiêu?',
    questionType: 'fill_in',
    unitLabel: 'cm',
    points: 10,
    correctAnswer: 7,
    hint: 'Số nào nhân với chính nó thì bằng 49? (Con hãy thử nhẩm bảng cửu chương xem nhé!)',
    explanation: 'Vì 7 × 7 = 49 nên cạnh của hình vuông có độ dài là 7 cm. (Lưu ý đơn vị độ dài cạnh là cm).',
    geometry: {
      shape: 'square',
      side: 7,
      area: 49,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Diện tích S = 49 cm²'
    }
  },
  {
    id: 'q-15',
    category: 'practice',
    level: 2,
    title: 'Câu 15: Bài toán thực tế - Mảnh đất',
    description:
      'Bác Hải có một mảnh đất hình chữ nhật dài 12 m và rộng 5 m. Diện tích mảnh đất của bác Hải là bao nhiêu mét vuông?',
    questionType: 'single_choice',
    points: 10,
    options: ['60 m²', '34 m²', '60 m', '17 m²'],
    correctAnswer: '60 m²',
    hint: 'Tính diện tích bằng cách lấy chiều dài nhân chiều rộng: 12 × 5.',
    explanation: 'Diện tích mảnh đất của bác Hải là: 12 × 5 = 60 (m²).',
    geometry: {
      shape: 'rectangle',
      width: 12,
      height: 5,
      unit: 'm',
      unitSquare: 'm²',
      label: 'Dài: 12 m, Rộng: 5 m'
    }
  },
  {
    id: 'q-16',
    category: 'practice',
    level: 2,
    title: 'Câu 16: So sánh diện tích trực quan',
    description:
      'Cho ba hình chữ nhật có kích thước lần lượt là: Hình 1 (4 × 6), Hình 2 (5 × 5), Hình 3 (8 × 2). Hình nào có diện tích bằng 24 đơn vị vuông?',
    questionType: 'single_choice',
    points: 10,
    options: ['Hình 1 (kích thước 4 × 6)', 'Hình 2 (kích thước 5 × 5)', 'Hình 3 (kích thước 8 × 2)'],
    correctAnswer: 'Hình 1 (kích thước 4 × 6)',
    hint: 'Con hãy tính diện tích của từng hình:\n- 4 × 6 = ?\n- 5 × 5 = ?\n- 8 × 2 = ?',
    explanation:
      'Ta có:\n- Diện tích Hình 1: 4 × 6 = 24\n- Diện tích Hình 2: 5 × 5 = 25\n- Diện tích Hình 3: 8 × 2 = 16\nVậy Hình 1 (4 × 6) có diện tích bằng 24 đơn vị vuông.',
    geometry: {
      shape: 'comparison',
      unit: 'ô vuông',
      unitSquare: 'ô vuông',
      label: 'So sánh diện tích 3 hình'
    }
  },
  {
    id: 'q-17',
    category: 'practice',
    level: 2,
    title: 'Câu 17: Viên gạch hoa lát nền',
    description: 'Một viên gạch hoa lát nền hình vuông có cạnh dài 20 cm. Diện tích của viên gạch đó là:',
    questionType: 'single_choice',
    points: 10,
    options: ['400 cm²', '80 cm²', '40 cm²', '200 cm²'],
    correctAnswer: '400 cm²',
    hint: 'Diện tích hình vuông = cạnh × cạnh. Ta tính: 20 × 20.',
    explanation: 'Diện tích viên gạch là: 20 × 20 = 400 (cm²).',
    geometry: {
      shape: 'square',
      side: 20,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Cạnh: 20 cm'
    }
  },
  {
    id: 'q-18',
    category: 'practice',
    level: 3,
    title: 'Câu 18: Thử thách chu vi và diện tích',
    description:
      'Một tấm bảng hình chữ nhật có chu vi là 28 cm và chiều dài là 8 cm. Hãy tính diện tích tấm bảng đó.',
    questionType: 'fill_in',
    unitLabel: 'cm²',
    points: 10,
    correctAnswer: 48,
    hint: 'Bước 1: Nửa chu vi = 28 : 2 = 14 cm. Bước 2: Chiều rộng = Nửa chu vi - Chiều dài. Bước 3: Tính diện tích!',
    explanation:
      'Bước 1: Nửa chu vi hình chữ nhật là: 28 : 2 = 14 (cm).\nBước 2: Chiều rộng hình chữ nhật là: 14 - 8 = 6 (cm).\nBước 3: Diện tích hình chữ nhật là: 8 × 6 = 48 (cm²).\nĐáp số: 48 cm².',
    geometry: {
      shape: 'rectangle',
      width: 8,
      height: 6,
      perimeter: 28,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Chu vi: 28 cm | Chiều dài: 8 cm',
      subLabel: 'Tìm chiều rộng rồi tính diện tích'
    }
  },
  {
    id: 'q-19',
    category: 'practice',
    level: 3,
    title: 'Câu 19: Diện tích hình chữ L ghép',
    description:
      'Một miếng bìa hình chữ L được ghép từ hai hình chữ nhật nhỏ: hình 1 có kích thước 5 cm × 3 cm, hình 2 có kích thước 4 cm × 3 cm (không đè lên nhau). Diện tích toàn bộ miếng bìa là:',
    questionType: 'single_choice',
    points: 10,
    options: ['27 cm²', '24 cm²', '30 cm²', '15 cm²'],
    correctAnswer: '27 cm²',
    hint: 'Diện tích hình ghép bằng tổng diện tích các hình thành phần: S = S1 + S2.',
    explanation:
      'Diện tích hình 1 là: 5 × 3 = 15 (cm²).\nDiện tích hình 2 là: 4 × 3 = 12 (cm²).\nDiện tích miếng bìa hình chữ L là: 15 + 12 = 27 (cm²).',
    geometry: {
      shape: 'composite_l',
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Ghép từ 2 hình: 5×3 cm và 4×3 cm'
    }
  },
  {
    id: 'q-20',
    category: 'practice',
    level: 1,
    title: 'Câu 20: Bảng lớp học',
    description:
      'Chiếc bảng từ trong lớp học có chiều dài 3 m và chiều rộng 2 m. Diện tích bề mặt chiếc bảng là bao nhiêu mét vuông?',
    questionType: 'fill_in',
    unitLabel: 'm²',
    points: 10,
    correctAnswer: 6,
    hint: 'Lấy chiều dài nhân với chiều rộng: 3 × 2.',
    explanation: 'Diện tích bảng lớp học là: 3 × 2 = 6 (m²).',
    geometry: {
      shape: 'rectangle',
      width: 3,
      height: 2,
      unit: 'm',
      unitSquare: 'm²',
      label: 'Dài: 3 m, Rộng: 2 m'
    }
  },
  {
    id: 'q-21',
    category: 'practice',
    level: 2,
    title: 'Câu 21: So sánh hình vuông và hình chữ nhật',
    description:
      'Hình vuông M có cạnh 6 cm. Hình chữ nhật N có chiều dài 8 cm và chiều rộng 4 cm. Nhận định nào sau đây là ĐÚNG?',
    questionType: 'single_choice',
    points: 10,
    options: [
      'Diện tích hình vuông M lớn hơn diện tích hình chữ nhật N',
      'Diện tích hình chữ nhật N lớn hơn diện tích hình vuông M',
      'Hai hình có diện tích bằng nhau'
    ],
    correctAnswer: 'Diện tích hình vuông M lớn hơn diện tích hình chữ nhật N',
    hint: 'Tính diện tích hình M (6 × 6) và hình N (8 × 4) rồi so sánh hai kết quả với nhau.',
    explanation:
      'Diện tích hình vuông M là: 6 × 6 = 36 (cm²).\nDiện tích hình chữ nhật N là: 8 × 4 = 32 (cm²).\nVì 36 cm² > 32 cm² nên diện tích hình vuông M lớn hơn hình chữ nhật N.',
    geometry: {
      shape: 'comparison',
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Hình vuông M (cạnh 6cm) vs Hình chữ nhật N (8×4cm)'
    }
  },
  {
    id: 'q-22',
    category: 'practice',
    level: 2,
    title: 'Câu 22: Khám phá diện tích trên lưới ô vuông',
    description:
      'Quan sát lưới ô vuông dưới đây. Hãy chạm hoặc bấm vào các ô vuông để tô màu đúng 12 ô vuông đơn vị!',
    questionType: 'grid_explore',
    points: 10,
    gridConfig: {
      rows: 4,
      cols: 5,
      targetCount: 12
    },
    correctAnswer: 12,
    hint: 'Mỗi ô vuông con có diện tích là 1 đơn vị vuông. Con hãy chọn đủ đúng 12 ô vuông nhé!',
    explanation:
      'Tuyệt vời! Con đã chọn đúng 12 ô vuông đơn vị. Một hình chữ nhật có kích thước 4 × 3 hoặc 6 × 2 cũng đều có diện tích là 12 ô vuông đấy!',
    geometry: {
      shape: 'grid',
      gridRows: 4,
      gridCols: 5,
      unit: 'ô vuông',
      unitSquare: 'ô vuông',
      label: 'Lưới ô vuông 4 × 5'
    }
  },
  {
    id: 'q-23',
    category: 'practice',
    level: 3,
    title: 'Câu 23: Chiếc khăn tay hình vuông',
    description:
      'Một chiếc khăn tay hình vuông có diện tích là 100 cm². Chu vi của chiếc khăn tay đó là bao nhiêu xăng-ti-mét?',
    questionType: 'single_choice',
    points: 10,
    options: ['40 cm', '25 cm', '10 cm', '40 cm²'],
    correctAnswer: '40 cm',
    hint: 'Bước 1: Tìm cạnh chiếc khăn (Số nào nhân với chính nó bằng 100?). Bước 2: Chu vi hình vuông = Cạnh × 4.',
    explanation:
      'Bước 1: Vì 10 × 10 = 100 nên độ dài cạnh chiếc khăn tay là 10 cm.\nBước 2: Chu vi chiếc khăn tay là: 10 × 4 = 40 (cm).\nĐáp số: 40 cm.',
    geometry: {
      shape: 'square',
      side: 10,
      area: 100,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Diện tích khăn tay: 100 cm²'
    }
  },
  {
    id: 'q-24',
    category: 'practice',
    level: 2,
    title: 'Câu 24: Tìm chiều dài khi biết diện tích và chiều rộng',
    description:
      'Một tấm thảm hình chữ nhật có diện tích 45 cm² và chiều rộng 5 cm. Chiều dài của tấm thảm đó là:',
    questionType: 'fill_in',
    unitLabel: 'cm',
    points: 10,
    correctAnswer: 9,
    hint: 'Vì Diện tích = Chiều dài × Chiều rộng, nên Chiều dài = Diện tích : Chiều rộng (45 : 5).',
    explanation:
      'Chiều dài tấm thảm hình chữ nhật là: 45 : 5 = 9 (cm).\nĐáp số: 9 cm.',
    geometry: {
      shape: 'rectangle',
      width: 9,
      height: 5,
      area: 45,
      unit: 'cm',
      unitSquare: 'cm²',
      label: 'Diện tích: 45 cm², Rộng: 5 cm'
    }
  }
];
