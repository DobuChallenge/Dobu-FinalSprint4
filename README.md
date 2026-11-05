# Dobu Mobile

**Cuidado que acompanha.**

O Dobu aproxima tutores e veterinários no cuidado diário dos animais. O aplicativo reúne consultas, vacinas e anotações do animal e permite acompanhar o animal por câmera externa ou pela webcam de um computador.

Este repositório contém o aplicativo mobile da Sprint 4, desenvolvido em React Native com Expo. A [API .NET](https://github.com/DobuChallenge/Dobu-Sprint4.NET) e a [Dobu-Cam](https://github.com/DobuChallenge/Dobu-Cam) são serviços separados que se integram ao aplicativo.

## Conheça o aplicativo

O responsável cadastra seus animais, consulta o caderno de cuidados e organiza os próximos atendimentos. O veterinário acompanha os animais atendidos, registra observações e conversa com o tutor para combinar a consulta. Os registros ficam vinculados ao animal, permitindo que o tutor consulte as anotações do atendimento depois.

| Área | Recursos |
| --- | --- |
| Conta | Cadastro de responsável ou veterinário, login, edição de perfil, foto e restauração da sessão |
| Animais | Cadastro, consulta, edição e exclusão, com espécie, raça e responsável |
| Agendamentos | Cadastro, consulta, edição, cancelamento e exclusão de consultas |
| Conversa da consulta | Mensagens e confirmação do horário pelos dois participantes |
| Caderno de cuidados | Anotações por animal, registro de vacinas e próxima dose |
| Informações | Pesquisa de raças e conteúdos sobre animais em fontes públicas |
| Dobu-Cams | Cadastro por animal, nome da câmera, câmera externa por IP, webcam do computador e marcação dos potes no quadro |
| Lembretes | Notificações locais no horário das consultas futuras |
| Aparência | Temas claro e escuro pelo botão no topo, com preferência salva |
| Sobre | Versão instalada e commit de referência do APK |

Os CRUDs de animais e agendamentos das entregas anteriores foram preservados. O caderno de cuidados ficou separado da pesquisa de informações. As fotos dos perfis são armazenadas no aparelho; os demais registros dessa tabela utilizam a API quando há persistência no servidor.

## Instalação no Android

A distribuição é feita pelo **Firebase App Distribution**, para as contas convidadas:

[Instalar o Dobu](https://appdistribution.firebase.google.com/testerapps/1:919066649336:android:d241bf696efeb54462d10d/releases/424a8htjn4sg0)

Abra o link usando a mesma conta Google que recebeu o convite. O Firebase apresenta a versão disponível e as instruções de instalação. O aplicativo Android utiliza o identificador `com.dobuchallenge.mobile`.

A versão publicada é a **1.0.6 (10)**, com convite de instalação enviado ao professor. O [código desse APK](https://github.com/DobuChallenge/Dobu-FinalSprint4/tree/d75834128ecc21923fa4499e8a489d4518102f6b) corresponde ao commit `d75834128ecc21923fa4499e8a489d4518102f6b`. A tela **Perfil → Sobre o Dobu** informa a versão e o hash completo do código usado na compilação. Essa referência identifica o código do APK, mesmo quando o README recebe atualizações posteriores.

A API para esta versão está disponível em HTTPS:

```text
https://dobu-sprint4-api-rm563549.azurewebsites.net
```

A API utiliza o Oracle da faculdade. A persistência de observações da câmera utiliza uma conta Azure Cosmos DB com API compatível com MongoDB. Os serviços de banco são acessados pelo servidor; suas credenciais não fazem parte do aplicativo. A hospedagem usa a camada gratuita do App Service, sujeita a limites de uso e inicialização após períodos de inatividade.

A instalação pelo Firebase e o funcionamento da API não exigem estar na rede Wi-Fi da equipe. A transmissão da câmera tem configuração própria, descrita abaixo.

## Dobu-Cam

Em **Dobu-Cams**, selecione o animal e cadastre uma câmera com um nome, como Sala. O monitor oferece duas formas de conexão:

| Fonte | Como conectar |
| --- | --- |
| Câmera externa ou celular | Abra a transmissão, informe o IP e a porta exibidos e toque em **Ligar câmera externa**. Exemplo de endereço: `http://192.168.15.5:8080/video` |
| Webcam do computador | Toque em **Usar webcam do computador**. A captura utiliza a webcam do computador que executa o serviço Dobu-Cam; o campo de IP da câmera externa não é necessário para essa opção |

O campo **Endereço da Dobu-Cam** identifica o serviço que processa a captura, separado do endereço da câmera externa. Na prévia web do próprio computador, use `http://localhost:5000`. No emulador Android, o endereço inicial é `http://10.0.2.2:5000`. Em um celular físico, informe o IPv4 do computador com a porta 5000 e mantenha os aparelhos na mesma rede.

O quadro no topo permanece visível durante a sincronização. Quando chega uma imagem, ela aparece nesse mesmo espaço. **Atualizar imagem** solicita uma nova tentativa. Para a webcam, feche outros programas que estejam usando a câmera. Para a câmera externa, confirme que a transmissão está aberta e acessível ao serviço Dobu-Cam. Os endereços ficam salvos no aparelho, separados por conta e câmera. Esta versão não oferece vídeo de demonstração.

Com a imagem carregada, marque as áreas dos potes de comida e água e salve as marcações. A análise observa a permanência de um cão ou gato identificado dentro da região marcada por pelo menos quatro segundos. Uma visita contínua conta uma vez e água e comida têm contadores separados. Sem marcação ou identificação recente do animal, não há contagem de alimentação ou hidratação.

Os eventos indicam **possível alimentação ou hidratação**; a proximidade não comprova consumo. Pouca atividade por uma hora pode indicar possível descanso. A câmera não diagnostica doenças e não substitui avaliação veterinária.

O serviço processa uma captura por vez. Cadastrar várias câmeras organiza os acessos, mas não cria transmissões simultâneas. Para acompanhar fora da rede do computador, o serviço de câmera precisa de um endereço acessível e protegido. A API de cadastros e consultas já tem seu próprio endereço HTTPS.

## Notificações das consultas

O Dobu usa **notificações locais do Android**, vinculadas a agendamentos reais. Em **Lembretes**, ative os alertas e conceda a permissão solicitada pelo sistema. Uma consulta futura com status Agendado ou Confirmado gera um lembrete para o horário cadastrado. O aviso identifica o animal e, ao ser tocado, abre o agendamento correspondente na conta autenticada.

A tela mostra quantos lembretes estão programados e qual é o próximo horário. Ao editar ou cancelar uma consulta, o aplicativo ajusta os lembretes durante a próxima sincronização da agenda. Essa consulta ocorre a cada 30 segundos enquanto o app está ativo e quando ele volta ao primeiro plano. Ao sair da conta, os lembretes daquela sessão são removidos.

O sistema operacional entrega os avisos já programados mesmo com o aplicativo em segundo plano. Alterações feitas por outra pessoa enquanto ele está fechado só chegam ao aparelho ao reabrir o app. Não há push remoto nesta versão.

Para verificar o fluxo, cadastre uma consulta para alguns minutos depois, confira o próximo lembrete e deixe o aplicativo em segundo plano. Aguarde o aviso automático e toque nele para retornar à consulta. A prévia web não entrega notificações nativas; essa verificação deve ser feita no APK instalado.

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

A suíte verifica autenticação e sessão, validação dos formulários, isolamento de cache entre contas, vacinas, marcações da câmera, leitura sem imagem recente e sincronização dos lembretes. Também compila as telas para verificar a separação das regras da interface.

Os testes de integração utilizam uma API real, criam registros temporários e removem os dados ao terminar:

```powershell
$env:EXPO_PUBLIC_API_URL = 'https://dobu-sprint4-api-rm563549.azurewebsites.net'
npm run test:integration
```

Esse fluxo cobre cadastro, login, sessão, animais, agenda, caderno, vacinas, cadastro de câmera e conversa. A suíte automatizada cobre as regras do aplicativo, as duas fontes de câmera e a proteção do token da conta nas chamadas aos dispositivos. Os testes de integração também foram executados contra a API HTTPS pública, com persistência Oracle e NoSQL. A assinatura e o commit do APK foram conferidos, e o arquivo foi instalado e iniciado no emulador Android. O recebimento e o toque na notificação ainda dependem de validação no aplicativo instalado, assim como a transmissão de uma câmera externa real. A exportação verifica os bundles Android e iOS; ela não produz um APK nem substitui os testes de interface em aparelho.

Para gerar outro APK, configure os endereços do ambiente, faça commit do código e execute `npx eas-cli build --platform android --profile preview`, após vincular o projeto à conta Expo. O perfil está em `eas.json`. A versão e o `versionCode` ficam em `app.json`; `app.config.js` inclui o commit da compilação na tela Sobre.

O script `npm run distribuir -- caminho/do/app.apk HASH` permite distribuir uma versão pelo Firebase CLI com `FIREBASE_APP_ID`, `PROFESSOR_EMAIL` e `FIREBASE_CLI_PATH` configurados no ambiente. O repositório deve estar limpo e o hash deve corresponder ao código do APK.

## Demonstração e referências

O vídeo final da Sprint 4 ainda não tem um link publicado neste repositório. O [vídeo da Sprint 3](https://youtu.be/YcE1WVLbJDI) permanece como registro da versão anterior.

- [Protótipo no Figma](https://www.figma.com/design/mOXmQd2t8nKM3tjBE9g5Dn/Challenge)
- [API Dobu — Sprint 4](https://github.com/DobuChallenge/Dobu-Sprint4.NET)
- [Serviço Dobu-Cam](https://github.com/DobuChallenge/Dobu-Cam)
- [Swagger da API publicada](https://dobu-sprint4-api-rm563549.azurewebsites.net/swagger)

## Integrantes

| Nome | RM |
| --- | --- |
| Amandha Yumi Toyota Artulino | 563549 |
| Giovanna Bardella Gomes | 561439 |
| Erick Takeshi Nakajune | 566059 |
