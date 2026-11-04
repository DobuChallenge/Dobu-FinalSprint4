# Dobu Mobile — Sprint 4

**Cuidado que acompanha.**

O Dobu é um aplicativo para organizar os cuidados dos animais e facilitar o acompanhamento entre tutores e veterinários. A proposta é manter vacinas, anotações e consultas em um só lugar e permitir que o tutor observe seu animal pela Dobu-Cam, mesmo à distância.

O aplicativo foi desenvolvido em React Native com Expo e utiliza a API REST Dobu em .NET. Este repositório contém o mobile; a API .NET e os serviços de câmera ficam em projetos separados.

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

## Versão para instalar

O **Dobu 1.0.1 (5)** foi publicado no Firebase App Distribution.

- [Instalar pelo Firebase](https://appdistribution.firebase.google.com/testerapps/1:919066649336:android:d241bf696efeb54462d10d/releases/4ec8svtfnvtu0) — requer uma conta convidada;
- [Abrir a versão no console Firebase](https://console.firebase.google.com/project/dobu-sprint4-20261104-brn3dk/appdistribution/app/android:com.dobuchallenge.mobile/releases/4ec8svtfnvtu0) — acesso da equipe responsável pelo projeto;
- [Código do APK publicado](https://github.com/DobuChallenge/Dobu-FinalSprint4/tree/77dd82d21d212db44215da95f2ce650f8338de4e).

O APK foi gerado em modo release, teve a assinatura verificada e foi instalado e iniciado no emulador Android. O hash dentro do arquivo é `77dd82d21d212db44215da95f2ce650f8338de4e`. Essa é a referência do código da versão publicada; atualizações posteriores deste README não alteram o APK.

O acesso de instalação foi liberado para a conta responsável pelo projeto. O convite do professor ainda depende do e-mail institucional.

Esta versão usa os serviços da apresentação no computador `192.168.15.11`. A API e a Dobu-Cam precisam estar ligadas e acessíveis pela rede. O Firebase distribui o aplicativo; os serviços .NET e de câmera continuam separados. Para testar em outra rede, será necessário disponibilizar esses serviços em endereços acessíveis ao testador e gerar uma versão com a configuração correspondente.

## Continuidade do projeto

Os dois CRUDs da Sprint 3, **animais** e **agendamentos**, continuam integrados à API. As 16 telas presentes na versão inicial deste repositório foram mantidas; a versão atual tem 20 telas, incluindo Caderno de cuidados, conversa do agendamento, cadastro de câmeras e Sobre.

O caderno ficou separado da pesquisa de informações. A Dobu-Cam utiliza somente câmera externa e mantém os controles para ligar, parar e marcar os potes no quadro.

## Conferência dos requisitos da Sprint 4

| Requisito | O que existe nesta versão | O que falta concluir |
| --- | --- | --- |
| Telas funcionais e fluxo completo | Autenticação, CRUDs, caderno, vacinas e conversa integrados à API; telas anteriores preservadas | Ensaiar o fluxo completo no APK com os dois perfis e a câmera externa real. A detecção de alimentação e hidratação ao vivo está pendente |
| Publicação do aplicativo | APK 1.0.1 (5) publicado no Firebase App Distribution e liberado para a conta responsável pelo projeto | Adicionar o e-mail institucional do professor e confirmar que ele consegue instalar |
| Versão e código correspondentes | Versão, assinatura e hash do commit conferidos no APK publicado | Usar esse mesmo arquivo no vídeo e na avaliação |
| Notificações reais | Lembretes locais criados a partir da agenda; toque abre o agendamento da conta autenticada | Validar permissão, recebimento automático e abertura da consulta no APK, e mostrar esse fluxo no vídeo |
| Arquitetura e organização | Interface, hooks, serviços, APIs, sessão e estilos separados; TanStack Query fora das telas | Manter essa separação nos próximos ajustes |
| Vídeo da apresentação | Link da Sprint 3 mantido como referência | Gravar e disponibilizar o vídeo final com todos os fluxos da versão publicada |
| Tema claro e escuro | Botão no topo, preferência salva e opção de seguir o sistema pelo perfil | Conferir a aparência de todas as telas no aparelho da entrega |

**A entrega ainda não está concluída.** A publicação já foi feita, mas faltam o acesso do professor, a demonstração das notificações no APK e o vídeo final.

A comparação das telas foi feita com a versão inicial deste repositório, commit `10f1ef6`. Os materiais das Sprints 1 e 2 não estão incluídos aqui; a presença das telas, por si só, não comprova que todo o escopo dessas entregas foi concluído.

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

No celular, abra o aplicativo que transmite a câmera e copie o IP exibido. No Dobu, informe esse IP e toque em **Ligar câmera externa**. O campo aceita `192.168.15.5:8080` ou o endereço completo; quando necessário, completa `http://` e `/video`. Os endereços ficam salvos neste aparelho, separados por conta e câmera. A conexão só inicia quando você toca no botão.

O quadro permanece visível mesmo desconectado. A imagem pausada para marcar os potes fica preservada; o botão **Atualizar imagem** permite tentar novamente. Se não chegar imagem, o app orienta conferir o endereço, a transmissão e a rede Wi-Fi. O serviço Dobu-Cam também precisa estar rodando. A conexão com um celular real deve ser testada quando a transmissão estiver aberta.

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

Na revisão para a publicação, passaram **57 testes automatizados**; os **2 testes de integração com a API real** também passaram. O build nativo Android foi concluído, e o APK foi instalado e iniciado no emulador. Os bundles iOS e web foram verificados nas revisões anteriores. Os cliques e o recebimento das notificações ainda precisam de validação no aplicativo instalado.

## APK e Firebase App Distribution

O **APK é o arquivo de instalação do Dobu no Android**. O Firebase App Distribution permite entregar esse arquivo ao professor por convite. O enunciado exige que ele consiga instalar e avaliar o aplicativo; abrir a prévia no navegador ou no Expo Go não conclui essa parte da entrega.

1. Faça login com `npx eas-cli login` e vincule o projeto com `npx eas-cli init`.
2. Salve a vinculação na configuração e faça commit.
3. Configure as duas URLs no ambiente `preview` do EAS. Elas precisam estar acessíveis no aparelho do testador.
4. Com o Git limpo, execute `npx eas-cli build --platform android --profile preview`.
5. Instale o APK e confira se o hash da tela Sobre coincide com `git rev-parse HEAD`.
6. Publique esse mesmo APK no Firebase e use-o no vídeo.

O identificador Android é `com.dobuchallenge.mobile`. O plugin `withLocalNetwork` permite HTTP para a demonstração local. Para acesso fora dessa rede, disponibilize os serviços em HTTPS e revise essa permissão.

No console do Firebase, cadastre um aplicativo Android com esse identificador. Abra **App Distribution**, envie o APK gerado, adicione o e-mail institucional do professor como testador e clique em **Distribuir**. Ele receberá o convite para instalar. Esse envio pode ser feito pela interface, sem usar comandos.

Como alternativa, instale a CLI com `npm install --global firebase-tools` e faça `firebase login`. Para distribuir pelo terminal:

```powershell
$env:FIREBASE_APP_ID = 'ID-DO-APP-NO-FIREBASE'
$env:PROFESSOR_EMAIL = 'EMAIL-INSTITUCIONAL-DO-PROFESSOR'
$firebaseModules = npm root -g
$env:FIREBASE_CLI_PATH = Join-Path $firebaseModules 'firebase-tools/lib/bin/firebase.js'
$releaseCommit = git rev-parse HEAD
npm run distribuir -- C:/caminho/dobu.apk $releaseCommit
```

A versão atual já está publicada nos links acima. Para concluir a entrega, confirme o convite e a instalação pelo professor e disponibilize o vídeo final.

**Validar o APK** é testar o Dobu depois de instalado: cadastrar e entrar, registrar um animal, criar uma consulta, aguardar o aviso automático e tocar nele para abrir a consulta. Faça também os testes do caderno, tema e câmera. O objetivo é conferir se o aplicativo instalado funciona como a versão demonstrada.

No vídeo, mostre os fluxos completos: cadastro e login, animais, agenda e conversa, caderno, informações, câmera, troca de tema, notificação automática, restauração da sessão e tela Sobre. O código, o APK instalado e o APK publicado devem corresponder à mesma versão.

Antes de enviar, confira:

- [ ] APK instalado e fluxo completo testado com responsável e veterinário;
- [ ] Câmera externa conectada e imagem recente aparecendo no monitor;
- [ ] Notificação de um agendamento real recebida automaticamente, com abertura da consulta ao tocar;
- [x] APK publicado no Firebase App Distribution;
- [ ] Professor com convite e acesso confirmado para instalar;
- [x] Hash dentro do APK correspondente ao commit de referência do código;
- [ ] Vídeo final disponível, usando o mesmo APK da publicação;
- [ ] Serviços acessíveis durante a avaliação, sem depender de um endereço local inacessível ao professor.

## Links e integrantes

- [Repositório Sprint 4](https://github.com/DobuChallenge/Dobu-FinalSprint4)
- [Dobu no Firebase App Distribution](https://appdistribution.firebase.google.com/testerapps/1:919066649336:android:d241bf696efeb54462d10d/releases/4ec8svtfnvtu0)
- [Vídeo da Sprint 3](https://youtu.be/YcE1WVLbJDI)
- [Protótipo no Figma](https://www.figma.com/design/mOXmQd2t8nKM3tjBE9g5Dn/Challenge)

- Amandha Yumi Toyota Artulino — RM 563549
- Giovanna Bardella Gomes — RM 561439
- Erick Takeshi Nakajune — RM 566059
