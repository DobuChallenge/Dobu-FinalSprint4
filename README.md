# Dobu Mobile — Sprint 4

Aplicativo em React Native e Expo para acompanhar os cuidados dos animais, mesmo à distância. Este repositório contém o mobile; a API .NET, a Dobu-Cam e o petObserver ficam separados.

## Funcionalidades

- Cadastro e login de responsáveis e veterinários, edição de perfil e sessão persistente;
- Cadastro, consulta, edição e exclusão de animais e agendamentos;
- Conversa por agendamento, com confirmação dos dois participantes;
- Caderno de cuidados com anotações, vacinas e próxima dose;
- Pesquisa de raças, cuidados e fontes públicas sobre animais;
- Cadastro de Dobu-Cams por animal, conexão de câmera externa e marcação dos potes;
- Notificações locais dos agendamentos;
- Tema claro ou escuro pelo botão no topo; o perfil também permite seguir o tema do sistema;
- Tela Sobre com versão e commit de referência.

As fotos dos perfis ficam no dispositivo. A API atual não armazena essas imagens.

## Rodar o app

Use Node.js 22.7 ou superior e npm. Instale as dependências:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Preencha os endereços em `.env.local`:

```dotenv
EXPO_PUBLIC_API_URL=http://IP-DO-COMPUTADOR:5099
EXPO_PUBLIC_CAMERA_API_URL=http://IP-DO-COMPUTADOR:5000
```

No celular, use o IPv4 do computador e mantenha os dispositivos na mesma rede. No emulador Android, use `10.0.2.2`. Para abrir no navegador do próprio computador, pode usar `localhost`.

```powershell
npx expo start
# Prévia no navegador:
npx expo start --web
```

Para testar no emulador Android, abra um dispositivo virtual pelo Android Studio e pressione `a` no terminal do Expo. Use as URLs com `10.0.2.2` para acessar os serviços do computador.

A sessão usa SecureStore no aplicativo e localStorage na prévia web. Notificações nativas devem ser testadas no APK.

## Serviços

Inicie a [API .NET](https://github.com/DobuChallenge/Dobu-.NET) separadamente:

```powershell
dotnet run --project DOBU/Dobu.Api/Dobu.Api.csproj --urls http://0.0.0.0:5099
```

Configure o banco e a chave JWT no ambiente da API. Para desenvolvimento local ela aceita SQLite. Não coloque senhas ou chaves privadas em variáveis `EXPO_PUBLIC_`.

Na pasta da Dobu-Cam, execute `python backend.py`, com as dependências do serviço instaladas. Esta versão do mobile consulta o serviço de câmera e a API .NET; não chama diretamente a API petObserver.

Na base vazia, crie as contas de responsável e veterinário, prepare o catálogo pelo cadastro de animal e cadastre um pet. Depois ficam disponíveis agenda, conversa, caderno e câmeras vinculadas a ele.

## Dobu-Cam

A URL do serviço Dobu-Cam é diferente da URL da câmera externa, por exemplo `http://IP-DA-CAMERA:8080/video`. O aplicativo oferece somente a conexão de câmera externa.

Marque os potes no quadro e salve as áreas. O monitor mostra presença e movimento da câmera conectada. As marcações não comprovam consumo: a detecção de alimentação e hidratação ao vivo ainda não está implementada. Pouca atividade por uma hora aparece como possível descanso, sem substituir uma avaliação veterinária.

**Parar captura** interrompe a fonte no servidor. **Parar visualização** interrompe apenas as consultas do app. O servidor atual captura uma fonte por vez; cadastrar várias câmeras não cria transmissões simultâneas.

A integração usa `/status`, `/camera-frame`, `/configuracao` e `/camera-source`. O app verifica se a fonte externa continua ativa. Sem imagem recente, ele não indica presença ou descanso.

## Notificações

Em **Lembretes**, ative as notificações e autorize o sistema. Crie um agendamento para alguns minutos depois e aguarde o horário. Tocar no alerta abre os detalhes da consulta.

Alterações e cancelamentos são sincronizados quando o app consulta a agenda. Se outra pessoa alterar um atendimento enquanto o app está fechado, reabra-o para atualizar os lembretes. Sair da conta remove os alertas agendados. A implementação é local, sem push remoto.

## Organização e testes

- `screens` e `components`: interface;
- `hooks` e `services`: formulários, regras e consultas;
- `api`: comunicação HTTP;
- `auth`, `storage` e `providers`: sessão, preferências e estado;
- `navigation` e `styles`: rotas e temas.

```powershell
npm test
npm run export:android
```

Para testar contra a API real, use uma base de desenvolvimento:

```powershell
$env:EXPO_PUBLIC_API_URL = 'http://127.0.0.1:5099'
npm run test:integration
```

Os testes de integração criam e removem seus registros. Cobrem autenticação, pets, agenda, caderno, vacinas, câmeras e conversa. O comando de exportação verifica o bundle; não gera um APK nem comprova o funcionamento em aparelho físico.

## APK e Firebase App Distribution

1. Faça login com `npx eas-cli login` e vincule o projeto com `npx eas-cli init`.
2. Salve a vinculação na configuração e faça commit.
3. Configure as duas URLs no ambiente `preview` do EAS. Elas precisam estar acessíveis no aparelho do testador.
4. Com o Git limpo, execute `npx eas-cli build --platform android --profile preview`.
5. Instale o APK e confira se o hash da tela Sobre coincide com `git rev-parse HEAD`.
6. Publique esse mesmo APK no Firebase e use-o no vídeo.

O identificador Android é `com.dobuchallenge.mobile`. O plugin `withLocalNetwork` permite HTTP para a demonstração local. Para acesso fora dessa rede, disponibilize os serviços em HTTPS e revise essa permissão.

No Firebase, cadastre um aplicativo Android com esse identificador. Instale a CLI com `npm install --global firebase-tools` e faça `firebase login`. Para distribuir:

```powershell
$env:FIREBASE_APP_ID = 'ID-DO-APP-NO-FIREBASE'
$env:PROFESSOR_EMAIL = 'EMAIL-INSTITUCIONAL-DO-PROFESSOR'
$firebaseModules = npm root -g
$env:FIREBASE_CLI_PATH = Join-Path $firebaseModules 'firebase-tools/lib/bin/firebase.js'
$releaseCommit = git rev-parse HEAD
npm run distribuir -- C:/caminho/dobu.apk $releaseCommit
```

Confirme o convite e a instalação pelo professor. A publicação, o acesso dele e o vídeo final ainda estão pendentes.

No vídeo, mostre os fluxos completos: cadastro e login, animais, agenda e conversa, caderno, informações, câmera, troca de tema, notificação automática, restauração da sessão e tela Sobre. O código, o APK instalado e o APK publicado devem corresponder à mesma versão.

## Links e integrantes

- [Repositório Sprint 4](https://github.com/DobuChallenge/Dobu-FinalSprint4)
- [Vídeo da Sprint 3](https://youtu.be/YcE1WVLbJDI)
- [Protótipo no Figma](https://www.figma.com/design/mOXmQd2t8nKM3tjBE9g5Dn/Challenge)

- Amandha Yumi Toyota Artulino — RM 563549
- Giovanna Bardella Gomes — RM 561439
- Erick Takeshi Nakajune — RM 566059
