# 🎨 Guia Visual - Gerenciamento de Shipper

## Interface do Painel Admin - Antes e Depois

### ❌ ANTES (Original)

```
┌────────────────────────────────────────────────────────┐
│ Quản Lý Đơn Hàng                                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Mã Đơn Hàng: ORD-001                                  │
│ Ngày: 22/05/2026                                      │
│ Khách Hàng: Nguyễn Văn A                             │
│ Tổng Cộng: 500.000 ₫                                 │
│                                                        │
│ Sản Phẩm trong Đơn Hàng:                             │
│ • Product X x2 → 200.000 ₫                          │
│                                                        │
│ ──────────────────────────────────────────────────── │
│                                                        │
│ Thông Tin Vận Chuyển:      │  Thanh Toán & Giao:    │
│ • Nguyễn Văn A             │  • Thanh Toán: COD     │
│ • 0987654321               │  • Nhân Viên: John     │
│ • 123 Đường ABC, TP HCM    │  • Trạng thái: Pending │
│                            │                        │
│                            │  [Sửa Trạng Thái]      │
│                            │  [Hủy]                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### ✅ DEPOIS (Nova Versão)

```
┌────────────────────────────────────────────────────────┐
│ Quản Lý Đơn Hàng                                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Mã Đơn Hàng: ORD-001                                  │
│ Ngày: 22/05/2026                                      │
│ Khách Hàng: Nguyễn Văn A                             │
│ Tổng Cộng: 500.000 ₫                                 │
│                                                        │
│ Sản Phẩm trong Đơn Hàng:                             │
│ • Product X x2 → 200.000 ₫                          │
│                                                        │
│ ──────────────────────────────────────────────────── │
│                                                        │
│ Thông Tin Vận Chuyển:      │  Thanh Toán & Giao:    │
│ • Nguyễn Văn A             │  • Thanh Toán: COD     │
│ • 0987654321               │  • Nhân Viên: João     │
│ • 123 Đường ABC, TP HCM    │  • Số ĐT Shipper: ✨  │
│                            │    0912345678          │
│                            │  • Trạng thái: Pending │
│                            │                        │
│                            │  [Sửa Trạng Thái]      │
│                            │  [Sửa Shipper] 🟢 ✨  │
│                            │  [Hủy]                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Modal de Edição - Novo!

### Interface do Modal

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║    Cập Nhật Thông Tin Shipper                 ✨     ║
║                                                        ║
║  Mã Đơn Hàng: ORD-001                                 ║
║                                                        ║
║  Tên Shipper                                          ║
║  ┌────────────────────────────────────────────────┐  ║
║  │ João Silva                                     │  ║
║  └────────────────────────────────────────────────┘  ║
║                                                        ║
║  Số Điện Thoại Shipper                               ║
║  ┌────────────────────────────────────────────────┐  ║
║  │ 0912345678                                     │  ║
║  └────────────────────────────────────────────────┘  ║
║                                                        ║
║           ┌────────────┐     ┌──────────────┐        ║
║           │   Đóng     │     │  Lưu ✓      │        ║
║           └────────────┘     └──────────────┘        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## 🎨 Componentes Visuais

### Botão "Sửa Shipper"

```
┌──────────────────────────────┐
│ 🚚 Sửa Shipper              │  ← Verde escuro (#16a34a)
└──────────────────────────────┘
   Hover: Verde mais escuro
   Icon: Truck (Lucide React)
```

### Entrada de Texto (Input Fields)

```
Tên Shipper
┌────────────────────────────────────────┐
│ João Silva                             │  ← Cursor aqui
└────────────────────────────────────────┘
Focus: Anel azul (#1E90FF)

Số Điện Thoại
┌────────────────────────────────────────┐
│ 0912345678                             │  ← Cursor aqui
└────────────────────────────────────────┘
Focus: Anel azul (#1E90FF)
```

### Botões do Modal

```
┌────────────────┐     ┌──────────────────────┐
│     Đóng       │     │   Lưu (Salvar)      │
│  (Cinza)       │     │  (Azul Gradient)    │
└────────────────┘     └──────────────────────┘
Hover: bg-gray-50      Hover: shadow-lg
```

---

## 📱 Responsividade

### Desktop (≥ 768px)

```
┌──────────────────┬──────────────────┐
│ Thông Tin VanC   │ Thanh Toán & Giao│
│ (1/3)            │ (1/3)            │
└──────────────────┴──────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────┐
│ Thông Tin VanC   │
├──────────────────┤
│ Thanh Toán & Giao│
├──────────────────┤
│ Botões           │
└──────────────────┘
```

---

## 🎬 Fluxo de Interação

```
1. Usuário vê lista de pedidos
                ↓
2. Clica em botão "Sửa Shipper" 🟢
                ↓
3. Modal aparece com animação
                ↓
4. Campos pré-preenchidos
                ↓
5. Usuário edita dados
                ↓
6. Clica em "Lưu"
                ↓
7. Validação:
   ✓ Ambos campos preenchidos?
   ✗ Mostra erro: "Vui lòng nhập..."
                ↓
8. API PATCH é enviada
                ↓
9. Sucesso! Modal fecha
                ↓
10. Toast de sucesso aparece
                ↓
11. Lista atualiza com novos dados
```

---

## 💡 Estados do Modal

### 1️⃣ Fechado (Estado Padrão)

- Modal não é renderizado
- Botão "Sửa Shipper" está visível

### 2️⃣ Aberto (Edição)

- Modal aparece com fade-in
- Campos preenchidos com dados atuais
- Focus no primeiro campo

### 3️⃣ Enviando (Loading)

- Botão "Lưu" fica desabilitado (pode adicionar loading)
- Usuário espera resposta da API

### 4️⃣ Sucesso (Confirmation)

- Modal fecha
- Toast verde aparece: "Cập nhật thông tin shipper thành công"
- Dados na lista atualizam

### 5️⃣ Erro (Error)

- Modal permanece aberto
- Toast vermelho mostra erro
- Usuário pode tentar novamente

---

## 🎨 Esquema de Cores

```
├─ Primária: #0A3D62 (Azul escuro)
├─ Secundária: #1E90FF (Azul brilhante)
├─ Sucesso: Verde #16a34a (Botão Sửa Shipper)
├─ Aviso: Amarelo #EAB308
├─ Erro: Vermelho #dc2626
├─ Fundo: #F5F5F5 (Cinza claro)
└─ Texto: #333333 (Cinza escuro)
```

---

## 🔄 Integração de Dados

### Fluxo de Sincronização

```
Frontend (React)
    ↓
useState: editingShipper ✨
    ↓
Modal renderizado (editingShipper != null)
    ↓
handleSaveShipper()
    ↓
PATCH /api/admin/orders/{order_id}
    ↓
Backend (FastAPI)
    ↓
order.shipper = newValue
order.shipper_phone = newValue
db.commit()
    ↓
Response: { shipper, shipper_phone }
    ↓
Frontend atualiza estado
    ↓
setOrders() atualiza lista
    ↓
UI re-renderiza com novos dados
```

---

Desenvolvido com ❤️
Última atualização: 22/05/2026
