# Guia de Implementação - Gerenciamento de Shipper

## Alterações Realizadas

### 1. Frontend (ManageOrders.tsx)

#### Novas Funcionalidades:

- ✅ Novo estado para gerenciar edição de Shipper: `editingShipper`, `shipperName`, `shipperPhone`
- ✅ Novo ícone `Truck` importado do lucide-react
- ✅ Handler `handleShipperEdit()` para abrir modal de edição
- ✅ Handler `handleSaveShipper()` para salvar as alterações
- ✅ Exibição do número de telefone do shipper na lista
- ✅ Novo botão "Sửa Shipper" (cor verde) próximo aos botões de ação
- ✅ Modal separado para editar informações do shipper com campos:
  - Tên Shipper (nome do shipper)
  - Số Điện Thoại Shipper (telefone)

### 2. Backend (admin.py)

#### Alterações na API:

- ✅ Atualizado modelo `OrderStatusUpdate` para aceitar campos opcionais:

  ```python
  status: Optional[str] = None
  shipper: Optional[str] = None
  shipper_phone: Optional[str] = None
  ```

- ✅ Endpoint `PATCH /api/admin/orders/{order_id}` agora:
  - Atualiza status quando fornecido
  - Atualiza nome do shipper quando fornecido
  - Atualiza telefone do shipper quando fornecido
  - Retorna todos os campos atualizados

- ✅ Endpoint `GET /api/admin/orders` agora retorna:
  - `shipper`: nome do shipper
  - `shipper_phone`: telefone do shipper

### 3. Banco de Dados (orm.py)

#### Novo Campo:

- ✅ Adicionado campo `shipper_phone` à tabela `orders`:
  ```python
  shipper_phone = Column(String, nullable=True)
  ```

### 4. Script de Migração

- ✅ Criado `migrate_shipper_phone.py` para:
  - SQLite: Adiciona coluna via ALTER TABLE
  - MySQL: Adiciona coluna com tipo VARCHAR(255)
  - PostgreSQL: Adiciona coluna com tipo VARCHAR(255)
  - Detecta automaticamente se a coluna já existe

## Instruções de Implementação

### Passo 1: Parar o Servidor Backend

```bash
# Se estiver rodando, pressione Ctrl+C
```

### Passo 2: Executar a Migração

```bash
# De dentro da pasta raiz do projeto
python backend/migrate_shipper_phone.py
```

**Ou** se preferir deletar o banco de dados (opção mais simples):

1. Delete o arquivo do banco de dados (ex: `app.db` ou `ecommerce.db`)
2. Reinicie o servidor backend
3. O banco será recriado automaticamente com o novo schema

### Passo 3: Reiniciar o Servidor Backend

```bash
cd backend
python main.py
```

### Passo 4: Testar a Funcionalidade

1. Acesse o painel admin
2. Vá para "Quản Lý Đơn Hàng" (Manage Orders)
3. Em cada pedido, você verá:
   - Campo "Số ĐT Shipper" com o número de telefone
   - Novo botão "Sửa Shipper" (cor verde)
4. Clique em "Sửa Shipper" para:
   - Editar o nome do shipper
   - Editar o número de telefone do shipper
5. Clique em "Lưu" para salvar as alterações

## Fluxo de Funcionamento

1. **Carregamento**: Quando a página carrega, os pedidos são buscados da API com os dados de shipper
2. **Edição**: Ao clicar em "Sửa Shipper", um modal aparece com os dados atuais
3. **Validação**: O sistema valida se ambos os campos (nome e telefone) estão preenchidos
4. **Salvamento**: Envia um PATCH request com os novos dados
5. **Confirmação**: Exibe mensagem de sucesso e atualiza a lista automaticamente

## Campos na API

### Request (PATCH /api/admin/orders/{order_id})

```json
{
  "status": "shipping", // Opcional
  "shipper": "João Silva", // Opcional
  "shipper_phone": "0912345678" // Opcional
}
```

### Response

```json
{
  "id": "order-123",
  "status": "shipping",
  "shipper": "João Silva",
  "shipper_phone": "0912345678",
  "message": "Order updated successfully"
}
```

## Notas Importantes

- ✅ O campo `shipper_phone` é **opcional** (nullable)
- ✅ Tanto o status quanto as informações do shipper podem ser atualizadas separadamente
- ✅ Mensagens de validação em vietnamita para melhor UX
- ✅ Toast notifications para feedback ao usuário
- ✅ Design consistente com o restante da aplicação (cores, ícones, espaçamento)

## Troubleshooting

### Erro de Migração

Se o script de migração não funcionar:

1. Vá em `backend/db.py`
2. Execute este código Python:
   ```python
   from backend.db import init_db
   init_db()  # Recria todas as tabelas
   ```

### Campo não aparece no Frontend

- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Recarregue a página (Ctrl+R ou F5)
- Certifique-se de que o servidor backend está rodando

### Dados não salvam

- Verifique se o token de autorização é válido
- Verifique se o usuário tem permissão de admin
- Consulte o console do navegador para mensagens de erro
