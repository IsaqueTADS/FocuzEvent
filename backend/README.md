# App

FocuzEvent web app.

## Rfs (Requisitos funcionais)

- [ X ] Deve ser possível se cadastrar;
- [ X ] Deve ser possível se autenticar (login);
- [ ] Deve ser possível acessar o perfil de um usuário logado;
- [ ] Deve ser possível recuperar senha;
- [ ] Deve ser possível criar eventos (apenas logado);
- [ ] Deve ser possível filtrar eventos por cidade;
- [ ] Deve ser possível impulsionar eventos;
- [ ] Deve ser possível escolher dias de impulsionamento;
- [ ] Deve ser possível pagar por impulsionamento (PIX/cartão);
- [ ] Deve exibir eventos impulsionados no banner e aba especial;

## RNs (Regras de negócio)

- [ X ] O usuário não pode se cadastrar com um e-mail já em uso;
- [ X ] O usuário não pode postar masi de um avatar, ou seja o antigo deve ser apagado;
- [ ] Um evento só pode ser editado ou excluído por quem o criou;
- [ ] Apenas usuários logados podem realizar postagens
- [ ] Eventos devem ter endereço completo e cidade;
- [ ] Impulsionamento deve ser pago por dia de exibição;
- [ ] Criador pode escolher quantidade de dias de impulsionamento;

## RNFs (Requisitos não-funcionais)

- [ X ] A senha do usuário deve estar criptografada (bcrypt);
- [ X ] O sistema deve utilizar banco de dados PostgreSQL;
- [ X ] O sistema deve utilizar JWT (JSON Web Token) para autenticação e autorização;
- [ ] O sistema deve ter responsividade para dispositivos móveis;
- [ ] Criador pode escolher quantidade de dias de impulsionamento;
- [ ]
