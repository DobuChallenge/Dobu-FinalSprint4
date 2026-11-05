<p align="center">
  <img src="assets/logo.png" alt="Dobu" width="230" />
</p>

<h1 align="center">Dobu Mobile</h1>

<p align="center"><strong>Cuidado que acompanha.</strong><br />A saúde e a rotina do seu pet, mais perto de você.</p>

<p align="center">
  <a href="https://appdistribution.firebase.google.com/testerapps/1:919066649336:android:d241bf696efeb54462d10d">Instalar no Android</a> ·
  <a href="https://youtu.be/4hmZqix_lCU">Assistir à apresentação</a> ·
  <a href="#conheça-o-aplicativo">Funcionalidades</a> ·
  <a href="#primeiro-acesso">Primeiro acesso</a> ·
  <a href="#executar-o-projeto">Como executar</a> ·
  <a href="#integrantes">Equipe</a>
</p>

---

## O projeto

O Dobu aproxima tutores e veterinários no cuidado diário dos animais. O aplicativo reúne consultas, vacinas e anotações do animal e permite acompanhar o animal por câmera externa ou pela webcam de um computador.

O objetivo é facilitar o que acontece entre os atendimentos: lembrar de uma consulta, encontrar uma orientação registrada pelo veterinário ou olhar como o pet está quando o tutor está longe.

Este repositório contém a entrega da **Sprint 4 de Mobile Application Development**, desenvolvida em **React Native com Expo**. A [API REST Dobu em .NET](https://github.com/DobuChallenge/Dobu-Sprint4.NET) e a [Dobu-Cam](https://github.com/DobuChallenge/Dobu-Cam) são serviços separados que se integram ao aplicativo.

## Conheça o aplicativo

O responsável cadastra seus animais, consulta o caderno de cuidados e organiza os próximos atendimentos. O veterinário acompanha os animais atendidos, registra observações e conversa com o tutor para combinar a consulta. Os registros ficam vinculados ao animal, permitindo que o tutor consulte as anotações do atendimento depois.

| Área | Recursos |
| --- | --- |
| Conta | Cadastro de responsável ou veterinário, login, edição de perfil, foto e restauração da sessão |
| Animais | Cadastro, consulta, edição e exclusão, com espécie, raça e responsável |
| Agendamentos | Cadastro, consulta, edição, cancelamento e exclusão de consultas, com horários do dia inteiro e opção de digitar hora e minuto |
| Conversa da consulta | Mensagens e confirmação do horário pelos dois participantes |
| Caderno de cuidados | Anotações por animal, registro de vacinas e próxima dose |
| Informações | Pesquisa de raças e conteúdos sobre animais em fontes públicas |
| Dobu-Cams | Cadastro por animal, nome da câmera, câmera externa por IP, webcam do computador e marcação dos potes no quadro |
| Lembretes | Notificações locais no horário das consultas futuras |
| Aparência | Temas claro e escuro pelo botão no topo, com preferência salva |
| Sobre | Versão instalada e commit de referência do APK |

Os cadastros de animais e agendamentos das entregas anteriores continuam integrados à API. O caderno de cuidados guarda os registros do pet, enquanto a área Informações reúne a pesquisa de conteúdos. As fotos dos perfis ficam no aparelho e não são enviadas ao servidor.

## Primeiro acesso

1. Crie uma conta de **responsável** ou **veterinário** e entre no aplicativo.
2. No perfil de responsável, cadastre seu animal. Em uma base nova, use **Preparar catálogo básico** caso ainda não existam espécies e raças.
3. Abra o **Caderno de cuidados** para guardar uma observação ou registrar uma vacina e sua próxima dose.
4. Crie uma consulta com um veterinário cadastrado. A conversa do agendamento permite combinar o atendimento e confirmar a disponibilidade dos dois participantes.
5. Em **Lembretes**, ative os alertas e aceite a permissão do Android.
6. Para acompanhar o pet por imagem, cadastre uma Dobu-Cam e conecte a câmera.

O botão no topo alterna entre os temas claro e escuro. A preferência fica salva para o próximo acesso.

## Instalação no Android

A distribuição é feita pelo **Firebase App Distribution**, para as contas convidadas:

[Instalar o Dobu](https://appdistribution.firebase.google.com/testerapps/1:919066649336:android:d241bf696efeb54462d10d)

Abra o link usando a mesma conta Google que recebeu o convite. O Firebase apresenta a versão disponível e as instruções de instalação. O aplicativo Android utiliza o identificador `com.dobuchallenge.mobile`.

A versão publicada é a **1.0.8 (12)**, com convite de instalação enviado ao professor. O [código desse APK](https://github.com/DobuChallenge/Dobu-FinalSprint4/tree/v1.0.8-sprint4) está identificado pela tag `v1.0.8-sprint4`. A tela **Perfil → Sobre o Dobu** informa a versão e o hash completo do código usado na compilação. Essa referência identifica o código do APK, mesmo quando o README recebe atualizações posteriores.

A API para esta versão está disponível em HTTPS:

```text
https://dobu-sprint4-api-rm563549.azurewebsites.net
```

A API utiliza **Oracle** para os dados relacionais e **Azure Cosmos DB com API compatível com MongoDB** para as observações da câmera. As conexões com os bancos ficam no backend; suas credenciais não fazem parte do aplicativo. A hospedagem no Azure App Service utiliza a camada gratuita, sujeita a limites de uso e maior tempo de resposta após períodos de inatividade.

A instalação pelo Firebase e o funcionamento da API não exigem estar na rede Wi-Fi da equipe. A transmissão da câmera tem configuração própria, descrita abaixo.

## Dobu-Cam

Em **Dobu-Cams**, selecione o animal e cadastre uma câmera com um nome, como Sala. O monitor oferece duas formas de conexão:

| Fonte | Como conectar |
| --- | --- |
| Câmera externa ou celular | Abra a transmissão, informe o IP e a porta exibidos e toque em **Ligar câmera externa**. Exemplo de endereço: `http://192.168.15.5:8080/video` |
| Webcam do computador | Toque em **Usar webcam do computador**. A captura utiliza a webcam do computador que executa o serviço Dobu-Cam; o campo de IP da câmera externa não é necessário para essa opção |

O campo **Endereço da Dobu-Cam** identifica o serviço que processa a captura, separado do endereço da câmera externa. Na prévia web do próprio computador, use `http://localhost:5000`. No emulador Android, o endereço inicial é `http://10.0.2.2:5000`. Em um celular físico, informe o IPv4 do computador com a porta 5000 e mantenha os aparelhos na mesma rede.

O quadro da câmera permanece visível durante a sincronização. Quando chega uma imagem, ela aparece nesse mesmo espaço. A web recebe a transmissão contínua MJPEG e o Android exibe imagens atualizadas do serviço. **Atualizar imagem** solicita uma nova tentativa.

Para a webcam, feche outros programas que estejam usando a câmera. Para a câmera externa, confirme que a transmissão está aberta e acessível ao serviço Dobu-Cam. Os endereços ficam salvos no aparelho, separados por conta e câmera. O monitor utiliza a captura da câmera conectada, sem vídeo de exemplo como fonte.

### Marcação dos potes e leituras

Com a imagem carregada, marque as áreas dos potes de comida e água e salve as marcações. A análise observa a permanência de um cão ou gato identificado dentro da região marcada por pelo menos quatro segundos. Uma visita contínua conta uma vez e água e comida têm contadores separados. Sem marcação ou identificação recente do animal, não há contagem de alimentação ou hidratação.

Os eventos indicam **possível alimentação ou hidratação**; a proximidade não comprova consumo. Pouca atividade por uma hora pode indicar possível descanso. A câmera não diagnostica doenças e não substitui avaliação veterinária.

O serviço processa uma captura por vez. Cadastrar várias câmeras organiza os acessos, mas não cria transmissões simultâneas. Para acompanhar fora da rede do computador, o serviço de câmera precisa de um endereço acessível e protegido. A API de cadastros e consultas já tem seu próprio endereço HTTPS.

## Notificações das consultas

O Dobu usa **notificações locais do Android**, vinculadas a agendamentos reais. Em **Lembretes**, ative os alertas e conceda a permissão solicitada pelo sistema. No formulário da consulta, o seletor oferece horários a cada cinco minutos ou **Digitar horário (HH:MM)** para informar um horário exato. Uma consulta futura com status Agendado ou Confirmado gera um lembrete para o horário cadastrado. O aviso identifica o animal e, ao ser tocado, abre o agendamento correspondente na conta autenticada.

A tela mostra quantos lembretes estão programados e qual é o próximo horário. Ao editar ou cancelar uma consulta, o aplicativo ajusta os lembretes durante a próxima sincronização da agenda. Essa consulta ocorre a cada 30 segundos enquanto o app está ativo e quando ele volta ao primeiro plano. Ao sair da conta, os lembretes daquela sessão são removidos.

O sistema operacional entrega os avisos já programados mesmo com o aplicativo em segundo plano. Alterações feitas por outra pessoa enquanto ele está fechado só chegam ao aparelho ao reabrir o app. Não há push remoto nesta versão.

Para verificar o fluxo, cadastre uma consulta alguns minutos à frente, considerando a **data e o relógio do aparelho**. Confira o próximo lembrete e deixe o aplicativo em segundo plano. Aguarde o aviso automático e toque nele para retornar à consulta. A prévia web não entrega notificações nativas; essa verificação deve ser feita no APK instalado.

## Tecnologias

| Aplicativo | Integrações e armazenamento |
| --- | --- |
| React Native 0.81 e React 19 | API REST .NET com autenticação JWT |
| Expo SDK 54 e JavaScript | Oracle e persistência NoSQL no backend |
| React Navigation | Expo SecureStore para a sessão Android |
| TanStack Query | AsyncStorage para preferências locais |
| Expo Notifications e Image Picker | Serviço Dobu-Cam para captura e processamento |

## Arquitetura

A interface foi separada das regras e da comunicação HTTP. As telas recebem o estado e as ações dos hooks, enquanto os serviços concentram validação, filtros e opções das consultas do TanStack Query. As chamadas HTTP ficam em `src/api`.

```mermaid
flowchart LR
    Telas[Telas e componentes] --> Hooks[Hooks e serviços]
    Hooks --> Query[TanStack Query]
    Query --> HTTP[Cliente HTTP]
    HTTP --> API[API Dobu .NET]
    API --> Oracle[(Oracle)]
    API --> Mongo[(Persistência NoSQL)]
    Hooks --> Camera[Serviço Dobu-Cam]
    Camera --> Externa[Câmera externa ou webcam]
    Hooks --> Local[SecureStore e AsyncStorage]
    Hooks --> Avisos[Notificações locais Android]
```

| Diretório | Responsabilidade |
| --- | --- |
| `src/screens` | Telas e composição da interface |
| `src/components` | Componentes reutilizáveis, campos, cartões e quadro da câmera |
| `src/hooks` | Estado dos formulários, carregamento e ações usadas pelas telas |
| `src/services` | Regras, validações, consultas e planejamento dos lembretes |
| `src/api` | Endpoints, cliente HTTP, autenticação das requisições e erros |
| `src/auth`, `src/storage` e `src/providers` | Sessão, preferências e estado compartilhado |
| `src/navigation` e `src/styles` | Navegação, tema e estilos |
| `tests` | Testes automatizados de regras e integrações |
| `plugins` | Configuração nativa de rede local |

A sessão usa SecureStore no Android e armazenamento local na prévia web. Senhas não são persistidas no aparelho. Preferências de tema, fotos locais e endereços de câmera são mantidos por conta. O cliente HTTP trata erros e timeouts sem apresentar o conteúdo interno das respostas do servidor.

## Executar o projeto

É necessário Node.js 22.7 ou superior, npm e, para o emulador, Android Studio com um dispositivo virtual configurado.

```powershell
git clone https://github.com/DobuChallenge/Dobu-FinalSprint4.git
cd Dobu-FinalSprint4
npm ci
Copy-Item .env.example .env.local
npx expo start
```

A API HTTPS é o endereço padrão. Para usar serviços próprios, configure `.env.local`:

```dotenv
EXPO_PUBLIC_API_URL=https://dobu-sprint4-api-rm563549.azurewebsites.net
EXPO_PUBLIC_CAMERA_API_URL=
```

O endereço da Dobu-Cam também pode ser informado na própria tela da câmera. Variáveis `EXPO_PUBLIC_` entram no aplicativo e devem conter apenas configurações públicas, nunca credenciais.

No terminal do Expo, pressione `a` para abrir no emulador Android ou `w` para a prévia web. Também é possível iniciar diretamente com `npm run android` ou `npm run web`. Se a API estiver no computador local, use `http://10.0.2.2:5100` no emulador; em um celular físico, use o IPv4 desse computador.

As instruções de instalação dos serviços e configuração do Oracle, MongoDB e JWT estão no [repositório da API](https://github.com/DobuChallenge/Dobu-Sprint4.NET). O serviço de câmera é iniciado com `python backend.py` na [Dobu-Cam](https://github.com/DobuChallenge/Dobu-Cam), após instalar suas dependências.

## Testes e compilação

```powershell
npm test
npm run export:android
npm run export:ios
```

A versão 1.0.8 passou em **66 testes automatizados**. A suíte verifica autenticação e sessão, validação dos formulários e horários, isolamento de cache entre contas, vacinas, marcações da câmera, leitura sem imagem recente e sincronização dos lembretes. Também compila as telas para verificar a separação das regras da interface.

Os testes de integração utilizam uma API real, criam registros temporários e removem os dados ao terminar:

```powershell
$env:EXPO_PUBLIC_API_URL = 'https://dobu-sprint4-api-rm563549.azurewebsites.net'
npm run test:integration
```

Os **dois testes de integração** passaram contra a API HTTPS real. O fluxo cobre cadastro, login, sessão, animais, agenda, caderno, vacinas, cadastro de câmera e conversa. As verificações automatizadas também incluem as duas fontes de câmera e a proteção do token da conta nas chamadas aos dispositivos.

A assinatura e o commit do APK foram conferidos, e o arquivo foi instalado e iniciado no emulador Android. O recebimento e o toque na notificação ainda dependem de validação no aplicativo instalado, assim como a transmissão de uma câmera externa real. A exportação verifica os bundles Android e iOS; ela não produz um APK nem substitui os testes de interface em aparelho.

<details>
<summary><strong>Compilar e distribuir outra versão</strong></summary>

Para gerar outro APK, configure os endereços do ambiente, faça commit do código e execute `npx eas-cli build --platform android --profile preview`, após vincular o projeto à conta Expo. O perfil está em `eas.json`. A versão e o `versionCode` ficam em `app.json`; `app.config.js` inclui o commit da compilação na tela Sobre.

O script `npm run distribuir -- caminho/do/app.apk HASH` permite distribuir uma versão pelo Firebase CLI com `FIREBASE_APP_ID`, `PROFESSOR_EMAIL` e `FIREBASE_CLI_PATH` configurados no ambiente. O repositório deve estar limpo e o hash deve corresponder ao código do APK.

</details>

## Demonstração e referências

[**Assistir à apresentação final da Sprint 4 no YouTube →**](https://youtu.be/4hmZqix_lCU)

O vídeo da Sprint 3 permanece como registro da evolução do projeto.

| Material | Link |
| --- | --- |
| Apresentação final — Sprint 4 | [Assistir no YouTube](https://youtu.be/4hmZqix_lCU) |
| Instalação Android | [Firebase App Distribution](https://appdistribution.firebase.google.com/testerapps/1:919066649336:android:d241bf696efeb54462d10d) |
| Código do APK 1.0.8 | [Tag v1.0.8-sprint4](https://github.com/DobuChallenge/Dobu-FinalSprint4/tree/v1.0.8-sprint4) |
| Protótipo | [Figma](https://www.figma.com/design/mOXmQd2t8nKM3tjBE9g5Dn/Challenge) |
| Vídeo da Sprint 3 | [YouTube](https://youtu.be/YcE1WVLbJDI) |
| Backend | [API .NET](https://github.com/DobuChallenge/Dobu-Sprint4.NET) |
| Documentação da API | [Swagger](https://dobu-sprint4-api-rm563549.azurewebsites.net/swagger) |
| Monitoramento | [Dobu-Cam](https://github.com/DobuChallenge/Dobu-Cam) |

## Integrantes

| Nome | RM |
| --- | --- |
| Amandha Yumi Toyota Artulino | 563549 |
| Giovanna Bardella Gomes | 561439 |
| Erick Takeshi Nakajune | 566059 |
