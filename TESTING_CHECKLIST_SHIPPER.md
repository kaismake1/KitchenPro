# ✅ Checklist de Testes - Gerenciamento de Shipper

## 🧪 Testes Funcionais

### Frontend

#### 1. Renderização da Interface

- [ ] Página de Quản Lý Đơn Hàng carrega sem erros
- [ ] Campo "Số ĐT Shipper" aparece na seção de Thanh Toán & Giao
- [ ] Botão "Sửa Shipper" 🟢 aparece ao lado do botão "Sửa Trạng Thái"
- [ ] Ícone de caminhão (Truck) aparece no botão

#### 2. Modal de Edição

- [ ] Ao clicar em "Sửa Shipper", o modal aparece
- [ ] Modal mostra "Cập Nhật Thông Tin Shipper" como título
- [ ] Campo "Tên Shipper" está preenchido com o valor atual
- [ ] Campo "Số Điện Thoại Shipper" está preenchido com o valor atual
- [ ] Mã Đơn Hàng aparece no modal

#### 3. Interação do Modal

- [ ] Teclado no campo "Tên Shipper" funciona normalmente
- [ ] Teclado no campo "Số Điện Thoại" funciona normalmente
- [ ] Focus ring azul aparece quando campo é focado
- [ ] Botão "Đóng" fecha o modal sem salvar
- [ ] Botão "Lưu" envia os dados

#### 4. Validação

- [ ] Se deixar "Tên Shipper" vazio e clicar em "Lưu":
  - [ ] Toast vermelho aparece: "Vui lòng nhập tên và số điện thoại shipper"
  - [ ] Modal permanece aberto
- [ ] Se deixar "Số Điện Thoại" vazio e clicar em "Lưu":
  - [ ] Toast vermelho aparece: "Vui lòng nhập tên và số điện thoại shipper"
  - [ ] Modal permanece aberto
- [ ] Com ambos os campos preenchidos, "Lưu" funciona

#### 5. Feedback de Sucesso

- [ ] Ao salvar com sucesso:
  - [ ] Toast verde aparece: "Cập nhật thông tin shipper thành công"
  - [ ] Modal fecha automaticamente
  - [ ] Campos são zerados (shipperName e shipperPhone)
- [ ] Lista de pedidos atualiza com novos valores

#### 6. Feedback de Erro

- [ ] Em caso de erro de API:
  - [ ] Toast vermelho aparece: "Có lỗi xảy ra khi cập nhật thông tin shipper"
  - [ ] Modal permanece aberto para retry

---

### Backend

#### 7. Banco de Dados

- [ ] Coluna `shipper_phone` existe na tabela `orders`
- [ ] Tipo da coluna é VARCHAR/TEXT (nullável)
- [ ] Dados existentes não são afetados

#### 8. Endpoint GET /api/admin/orders

- [ ] Resposta inclui campo `shipper`
- [ ] Resposta inclui campo `shipper_phone`
- [ ] Ambos os campos retornam valores null se não definidos

#### 9. Endpoint PATCH /api/admin/orders/{order_id}

- [ ] Aceita apenas campo `shipper`:

  ```json
  { "shipper": "João Silva" }
  ```

  - [ ] Atualiza apenas shipper, mantém shipper_phone

- [ ] Aceita apenas campo `shipper_phone`:

  ```json
  { "shipper_phone": "0912345678" }
  ```

  - [ ] Atualiza apenas shipper_phone, mantém shipper

- [ ] Aceita ambos os campos:

  ```json
  { "shipper": "João Silva", "shipper_phone": "0912345678" }
  ```

  - [ ] Atualiza ambos os campos

- [ ] Pode ainda atualizar `status`:
  ```json
  { "status": "shipping", "shipper": "João Silva" }
  ```

  - [ ] Atualiza status e shipper juntos

#### 10. Autenticação

- [ ] Request sem token Authorization:
  - [ ] Retorna erro 401: "Authorization header missing"
- [ ] Request com token inválido:
  - [ ] Retorna erro 401: "Invalid or expired token"
- [ ] Request com token de usuário não-admin:
  - [ ] Retorna erro 403: "Admin access required"

#### 11. Validação de Dados

- [ ] Ordem inexistente:
  - [ ] Retorna 404: "Order not found"

---

## 🔒 Testes de Segurança

#### 12. Autorização

- [ ] Usuários não-admin não podem acessar /api/admin/orders
- [ ] Usuários não-admin não podem fazer PATCH em pedidos
- [ ] Tokens expirados são rejeitados

#### 13. Validação de Input

- [ ] Aceita caracteres vietnamitas (João Silva)
- [ ] Aceita números de telefone com formatação (0912345678)
- [ ] Rejeita values malformados no JSON

---

## 🎨 Testes de UI/UX

#### 14. Responsividade

- [ ] Em desktop (≥ 768px):
  - [ ] Botões aparecem lado a lado
  - [ ] Modal tem tamanho apropriado
- [ ] Em tablet (≤ 768px):
  - [ ] Layout adapta para vertical
  - [ ] Botões permanecem acessíveis
- [ ] Em mobile (< 480px):
  - [ ] Modal ocupa 90% da largura
  - [ ] Teclado virtual não obstrui campos

#### 15. Acessibilidade

- [ ] Labels dos inputs são acessíveis
- [ ] Focus order é lógico
- [ ] Cores têm contraste suficiente
- [ ] Mensagens de erro são claras

#### 16. Performance

- [ ] Modal abre sem lag
- [ ] API request completa em < 2 segundos
- [ ] Lista atualiza suavemente

---

## 📱 Testes em Navegadores

#### 17. Chrome/Chromium

- [ ] Todos os testes acima passam
- [ ] Console não mostra erros

#### 18. Firefox

- [ ] Todos os testes acima passam
- [ ] Console não mostra erros

#### 19. Safari

- [ ] Todos os testes acima passam
- [ ] Inputs funcionam normalmente

#### 20. Edge

- [ ] Todos os testes acima passam
- [ ] Toast notifications funcionam

---

## 🔄 Testes de Integração

#### 21. Fluxo Completo

- [ ] Fazer login como admin ✅
- [ ] Navegar para Quản Lý Đơn Hàng ✅
- [ ] Clicar em "Sửa Shipper" em um pedido ✅
- [ ] Editar nome do shipper ✅
- [ ] Editar telefone do shipper ✅
- [ ] Clicar em "Lưu" ✅
- [ ] Ver mensagem de sucesso ✅
- [ ] Verificar que dados foram salvos ✅
- [ ] Recarregar página ✅
- [ ] Dados persistem ✅

#### 22. Compatibilidade com Recursos Existentes

- [ ] Botão "Sửa Trạng Thái" continua funcionando
- [ ] Botão "Hủy" continua funcionando
- [ ] Edição de status não afeta shipper
- [ ] Edição de shipper não afeta status

---

## 📊 Testes de Dados

#### 23. Casos de Uso

- [ ] Shipper sem nome (string vazio) → Erro
- [ ] Shipper com nome muito longo → Salva OK
- [ ] Telefone sem números → Erro de validação
- [ ] Telefone com caracteres especiais → Salva OK
- [ ] Múltiplas edições do mesmo pedido → Salva OK

---

## 🆘 Testes de Erro

#### 24. Tratamento de Erros

- [ ] Desconectar do WiFi durante save → Mostra erro
- [ ] Servidor backend offline → Mostra erro apropriado
- [ ] Banco de dados indisponível → Erro 500 capturado
- [ ] Token expirado durante save → Re-login necessário

---

## 📋 Relatório de Testes

Após completar os testes acima, preencha:

**Data:** ****\_\_\_****  
**Testador:** ****\_\_\_****  
**Navegador:** ****\_\_\_****  
**Versão:** ****\_\_\_****

**Resultado Geral:**

- [ ] ✅ TODOS OS TESTES PASSARAM
- [ ] ⚠️ ALGUNS TESTES FALHARAM (ver detalhes abaixo)
- [ ] ❌ FALHA CRÍTICA

**Detalhes de Falhas:**

```
[Espaço para notas sobre problemas encontrados]



```

**Observações:**

```
[Espaço para feedback geral]



```

---

## 🚀 Sign-off

- [ ] QA passou em todos os testes
- [ ] Código está pronto para produção
- [ ] Documentação está atualizada
- [ ] Backend está sincronizado com frontend

Data de conclusão: ****\_\_\_****  
Assinatura: ****\_\_\_****
