import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as Crypto from 'expo-crypto';
import TelaInicial from './TelaInicial';


const BARRAS_CODIGO = Array.of(3, 5, 2, 4, 3, 5, 2, 4, 3, 5, 2, 4);

export default function App() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [irParaInicio, setIrParaInicio] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [usuarios, setUsuarios] = useState(Array.of());

  function emailValido(textoEmail) {
    const posicaoArroba = textoEmail.indexOf('@');
    const posicaoCom = textoEmail.indexOf('.com', posicaoArroba);
    return (
      posicaoArroba > 0 &&
      posicaoCom > posicaoArroba + 1 &&
      !textoEmail.includes(' ')
    );
  }

  async function criptografarSenha(textoSenha) {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      textoSenha
    );
  }

  async function handleCadastro() {
    const emailLimpo = email.toLowerCase().trim();

    if (!emailLimpo || !password.trim() || !confirmPassword.trim()) {
      setMensagem({ texto: 'Preencha todos os campos.', tipo: 'erro' });
      return;
    }

    if (!emailValido(emailLimpo)) {
      setMensagem({
        texto: 'E-mail inválido! Precisa ter @ e .com (ex: nome@gmail.com).',
        tipo: 'erro',
      });
      return;
    }

    if (password !== confirmPassword) {
      setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
      return;
    }

    if (usuarios.some((u) => u.email === emailLimpo)) {
      setMensagem({ texto: 'Este e-mail já está cadastrado.', tipo: 'erro' });
      return;
    }

    const senhaHash = await criptografarSenha(password);
    setUsuarios(usuarios.concat({ email: emailLimpo, senhaHash }));

    setPassword('');
    setConfirmPassword('');
    setModoCadastro(false);
    setMensagem({
      texto: 'Cadastro realizado com criptografia! Agora faça login.',
      tipo: 'sucesso',
    });
  }

  async function handleLogin() {
    const emailLimpo = email.toLowerCase().trim();

    if (!emailLimpo || !password.trim()) {
      setMensagem({ texto: 'Preencha o e-mail e a senha.', tipo: 'erro' });
      return;
    }

    if (!emailValido(emailLimpo)) {
      setMensagem({
        texto: 'Digite um e-mail válido (ex: nome@gmail.com).',
        tipo: 'erro',
      });
      return;
    }

    const usuarioEncontrado = usuarios.find((u) => u.email === emailLimpo);

    if (!usuarioEncontrado) {
      setMensagem({
        texto: 'E-mail não cadastrado. Crie uma conta primeiro.',
        tipo: 'erro',
      });
      return;
    }

    const senhaDigitadaHash = await criptografarSenha(password);

    if (usuarioEncontrado.senhaHash === senhaDigitadaHash) {
      setMensagem({ texto: '', tipo: '' });
      setIrParaInicio(true);
    } else {
      setMensagem({ texto: 'Senha incorreta.', tipo: 'erro' });
    }
  }

  function alternarModo() {
    setModoCadastro(!modoCadastro);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMensagem({ texto: '', tipo: '' });
  }

  if (irParaInicio) {
    return <TelaInicial />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F6" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoSymbol}>⌗</Text>
            </View>
            <Text style={styles.logoText}>MoutLog</Text>
          </View>

          {!modoCadastro && (
            <View style={styles.illustration}>
              <View style={styles.circle} />

              <View style={styles.receipt}>
                <Text style={styles.storeIcon}>⌂</Text>
                <View style={styles.receiptLine} />
                <View style={Array.of(styles.receiptLine, { width: '65%' })} />
                <View style={styles.receiptSmallLine} />

                <View style={styles.barcode}>
                  {BARRAS_CODIGO.map((n, index) => (
                    <View
                      key={index}
                      style={{
                        width: n + 1,
                        height: 46,
                        backgroundColor: '#18332F',
                        marginRight: 4,
                      }}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.noteBadge}>
                <View style={styles.checkCircle}>
                  <Text style={styles.check}>✓</Text>
                </View>
                <Text style={styles.noteText}>+1 nota</Text>
              </View>
            </View>
          )}

          <View style={styles.intro}>
            <Text style={styles.title}>
              {modoCadastro
                ? 'Crie sua conta.\nComece a registrar.'
                : 'Cada nota conta.\nSeu dia, organizado.'}
            </Text>

            <Text style={styles.subtitle}>
              {modoCadastro
                ? 'Cadastre seu e-mail e crie uma senha criptografada.'
                : 'Fotografe suas notas e acompanhe a contagem em um só lugar.'}
            </Text>
          </View>

          {mensagem.texto !== '' && (
            <View
              style={Array.of(
                styles.alertBox,
                mensagem.tipo === 'sucesso' ? styles.alertSuccess : styles.alertError
              )}
            >
              <Text
                style={Array.of(
                  styles.alertText,
                  mensagem.tipo === 'sucesso'
                    ? styles.alertTextSuccess
                    : styles.alertTextError
                )}
              >
                {mensagem.texto}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉</Text>

              <TextInput
                style={styles.input}
                placeholder="seuemail@empresa.com.br"
                placeholderTextColor="#858D8B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={Array.of(styles.label, { marginTop: 22 })}>Senha</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>▣</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#858D8B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eye}>{showPassword ? '⊘' : '◉'}</Text>
              </TouchableOpacity>
            </View>

            {modoCadastro && (
              <>
                <Text style={Array.of(styles.label, { marginTop: 22 })}>
                  Confirmar senha
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>▣</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Repita sua senha"
                    placeholderTextColor="#858D8B"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
              </>
            )}

            {!modoCadastro && (
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={Array.of(styles.loginButton, modoCadastro && { marginTop: 28 })}
              activeOpacity={0.85}
              onPress={modoCadastro ? handleCadastro : handleLogin}
            >
              <Text style={styles.arrow}>{modoCadastro ? '✓' : '→'}</Text>
              <Text style={styles.loginText}>
                {modoCadastro ? 'Finalizar cadastro' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={alternarModo}
            >
              <Text style={styles.secondaryButtonText}>
                {modoCadastro ? 'Já tenho conta (Voltar)' : 'Criar conta'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F8F6',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: '9%',
    paddingTop: 30,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoIcon: {
    width: 60,
    height: 60,
backgroundColor: '#176F63',
borderRadius: 16,
alignItems: 'center',
justifyContent: 'center',
},
logoSymbol: {
color: '#FFFFFF',
fontSize: 36,
},
logoText: {
fontSize: 34,
fontWeight: '700',
color: '#172E2B',
marginLeft: 14,
letterSpacing: -1.5,
},
illustration: {
height: 260,
backgroundColor: '#E5F1ED',
borderRadius: 32,
alignItems: 'center',
justifyContent: 'center',
overflow: 'hidden',
marginBottom: 30,
},
circle: {
position: 'absolute',
width: 240,
height: 240,
borderWidth: 1.5,
borderColor: '#C5DCD4',
borderRadius: 140,
},
receipt: {
width: 165,
height: 205,
backgroundColor: '#FFFFFF',
borderRadius: 18,
padding: 20,
transform: Array.of({ rotate: '-8deg' }),
marginLeft: -15,
},
storeIcon: {
fontSize: 30,
color: '#176F63',
},
receiptLine: {
width: '100%',
height: 7,
backgroundColor: '#B7D2C9',
borderRadius: 5,
marginTop: 12,
},
receiptSmallLine: {
width: '100%',
height: 2,
backgroundColor: '#E1E7E4',
marginTop: 10,
},
barcode: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 10,
},
noteBadge: {
position: 'absolute',
right: '8%',
bottom: '12%',
width: 165,
height: 66,
borderRadius: 20,
backgroundColor: '#176F63',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 10,
},
checkCircle: {
width: 30,
height: 30,
borderWidth: 2.5,
borderColor: '#FFFFFF',
borderRadius: 20,
alignItems: 'center',
justifyContent: 'center',
},
check: {
color: '#FFFFFF',
fontSize: 18,
fontWeight: 'bold',
},
noteText: {
color: '#FFFFFF',
fontSize: 19,
fontWeight: '600',
},
intro: {
marginBottom: 24,
},
title: {
fontSize: 30,
lineHeight: 38,
fontWeight: '800',
color: '#142C29',
letterSpacing: -1,
},
subtitle: {
fontSize: 16,
lineHeight: 24,
color: '#858D8B',
marginTop: 10,
},
alertBox: {
padding: 14,
borderRadius: 14,
marginBottom: 20,
borderWidth: 1,
},
alertError: {
backgroundColor: '#FDECEC',
borderColor: '#F5C2C2',
},
alertSuccess: {
backgroundColor: '#E5F1ED',
borderColor: '#B7D2C9',
},
alertText: {
fontSize: 15,
fontWeight: '600',
},
alertTextError: {
color: '#B91C1C',
},
alertTextSuccess: {
color: '#176F63',
},
form: {
width: '100%',
},
label: {
color: '#172E2B',
fontSize: 16,
fontWeight: '700',
marginBottom: 8,
},
inputContainer: {
height: 64,
borderRadius: 18,
borderWidth: 1.5,
borderColor: '#DFE4E1',
backgroundColor: '#FFFFFF',
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 16,
gap: 12,
},
inputIcon: {
color: '#78817F',
fontSize: 20,
},
input: {
flex: 1,
fontSize: 16,
color: '#253B37',
height: '100%',
},
eye: {
fontSize: 20,
color: '#78817F',
padding: 4,
},
forgotButton: {
alignSelf: 'flex-end',
marginTop: 12,
marginBottom: 20,
},
forgotText: {
color: '#176F63',
fontSize: 14,
fontWeight: '600',
},
loginButton: {
height: 64,
backgroundColor: '#176F63',
borderRadius: 18,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 10,
},
arrow: {
color: '#FFFFFF',
fontSize: 22,
fontWeight: 'bold',
},
loginText: {
color: '#FFFFFF',
fontSize: 19,
fontWeight: '700',
},
secondaryButton: {
height: 60,
backgroundColor: '#E5F1ED',
borderWidth: 1.5,
borderColor: '#176F63',
borderRadius: 18,
alignItems: 'center',
justifyContent: 'center',
marginTop: 14,
},
secondaryButtonText: {
color: '#176F63',
fontSize: 18,
fontWeight: '700',
},
});