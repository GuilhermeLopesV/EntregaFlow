# EntregaFlow

Projeto de faculdade com um app feito em Expo/React Native.

## Abrir o app no navegador

1. Abra esta pasta do projeto no VS Code.
2. No VS Code, abra **Terminal > Novo Terminal**.
3. Na primeira vez, instale as dependências:

   ```powershell
   npm run setup:app
   ```

4. Inicie o app:

   ```powershell
   npm run app
   ```

O Expo mostrará no terminal o endereço local do app. Abra esse endereço no
navegador. Para encerrar o servidor, volte ao terminal e pressione `Ctrl+C`.

## Abrir no Android

Com o Android Studio e um emulador configurados, execute na pasta principal:

```powershell
npm run app:android
```

O código do app está em `frontend/android-app`. A página web antiga foi
removida; o comando `npm run app` abre a versão web do app Expo.
