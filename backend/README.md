  # App

  Focu web app.

  ## Rfs (Requisitos funcionais)

  - [x] Deve ser possível se cadastrar;
  - [x] Deve ser possível se autenticar (login);
  - [x] Deve ser possível acessar o perfil de um usuário logado;
  - [x] Deve ser possível acessar todos perfis cadastrado;
  - [x] Deve ser possível alterar senha;
  - [x] Deve ser possível criar eventos (apenas logado);
  - [x] Deve ser possível filtrar eventos por cidade;
  - [ ] Deve ser possível impulsionar eventos;
  - [ ] Deve ser possível escolher dias de impulsionamento;
  - [ ] Deve ser possível pagar por impulsionamento (PIX/cartão);
  - [ ] Deve exibir eventos impulsionados no banner e aba especial;

  ## RNs (Regras de negócio)

  - [x] O usuário não pode se cadastrar com um e-mail já em uso;
  - [x] O usuário não pode postar masi de um avatar, ou seja o antigo deve ser apagado;
  - [x] A senha alterada não pode ser a mesma da antiga;
  - [x] Se o usuario for deletado seus eventos, foto perfil, e fotos dos evento devem ser apagadas;
  - [ ] Um evento só pode ser editado ou excluído por quem o criou;
  - [x] Apenas usuários logados podem realizar postagens
  - [x] Eventos devem ter endereço completo e cidade;
  - [ ] Impulsionamento deve ser pago por dia de exibição;
  - [ ] Criador pode escolher quantidade de dias de impulsionamento;

  ## RNFs (Requisitos não-funcionais)

  - [x] A senha do usuário deve estar criptografada (bcrypt);
  - [x] O sistema deve utilizar banco de dados PostgreSQL;
  - [x] O sistema deve utilizar JWT (JSON Web Token) para autenticação e autorização;
  - [ ] O sistema deve ter responsividade para dispositivos móveis;
  - [ ] Criador pode escolher quantidade de dias de impulsionamento;

