
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

import TelaInicial from './TelaInicial';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [irParaInicio, setIrParaInicio] = useState(false);

  // ABRE A SEGUNDA TELA
  if (irParaInicio) {
    return <TelaInicial />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F6F8F6"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* LOGO */}
          <View style={styles.header}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoSymbol}>⌗</Text>
            </View>

            <Text style={styles.logoText}>MoutLog</Text>
          </View>

          {/* ILUSTRAÇÃO */}
          <View style={styles.illustration}>
            <View style={styles.circle} />

            <View style={styles.receipt}>
              <Text style={styles.storeIcon}>⌂</Text>

              <View style={styles.receiptLine} />
              <View style={[styles.receiptLine, { width: '65%' }]} />
              <View style={styles.receiptSmallLine} />

              <View style={styles.barcode}>
                {[3, 5, 2, 4, 3, 5, 2, 4, 3, 5, 2, 4].map(
                  (n, index) => (
                    <View
                      key={index}
                      style={{
                        width: n + 1,
                        height: 46,
                        backgroundColor: '#18332F',
                        marginRight: 4,
                      }}
                    />
                  )
                )}
              </View>
            </View>

            <View style={styles.noteBadge}>
              <View style={styles.checkCircle}>
                <Text style={styles.check}>✓</Text>
              </View>
              <Text style={styles.noteText}>+1 nota</Text>
            </View>
          </View>

          {/* TEXTO PRINCIPAL */}
          <View style={styles.intro}>
            <Text style={styles.title}>
              Cada nota conta.{"\n"}
              Seu dia, organizado.
            </Text>

            <Text style={styles.subtitle}>
              Fotografe suas notas e acompanhe a contagem em
              um só lugar.
            </Text>
          </View>

          {/* FORMULÁRIO */}
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

            <Text style={[styles.label, { marginTop: 30 }]}>
              Senha
            </Text>

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

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eye}>◉</Text>
              </TouchableOpacity>
            </View>

            {/* ESQUECI SENHA */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            {/* BOTÃO ENTRAR */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={() => setIrParaInicio(true)}
            >
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.loginText}>Entrar</Text>
            </TouchableOpacity>

          </View>

          {/* RODAPÉ */}
          <View style={styles.footer}>
            <Text style={styles.footerDescription}>
              Primeiro acesso ou precisa de ajuda?
            </Text>

            <TouchableOpacity>
              <Text style={styles.footerLink}>
                Fale com o responsável da sua loja
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
    paddingTop: 35,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 45,
  },

  logoIcon: {
    width: 72,
    height: 72,
    backgroundColor: '#176F63',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoSymbol: {
    color: '#FFFFFF',
    fontSize: 43,
  },

  logoText: {
    fontSize: 40,
    color: '#172E2B',
    marginLeft: 18,
    letterSpacing: -1.8,
  },

  illustration: {
    height: 320,
    backgroundColor: '#E5F1ED',
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 42,
  },

  circle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderWidth: 1.5,
    borderColor: '#C5DCD4',
    borderRadius: 160,
  },

  receipt: {
    width: 185,
    height: 235,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    transform: [{ rotate: '-8deg' }],
    marginLeft: -15,
  },

  storeIcon: {
    fontSize: 35,
    color: '#176F63',
  },

  receiptLine: {
    width: '100%',
    height: 7,
    backgroundColor: '#B7D2C9',
    borderRadius: 5,
    marginTop: 15,
  },

  receiptSmallLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#E1E7E4',
    marginTop: 12,
  },

  barcode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  noteBadge: {
    position: 'absolute',
    right: '8%',
    bottom: '12%',
    width: 185,
    height: 78,
    borderRadius: 25,
    backgroundColor: '#176F63',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  checkCircle: {
    width: 35,
    height: 35,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },

  noteText: {
    color: '#FFFFFF',
    fontSize: 23,
  },

  intro: {
    marginBottom: 42,
  },

  title: {
    fontSize: 34,
    lineHeight: 47,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 19,
    lineHeight: 28,
    color: '#858D8B',
    marginTop: 18,
  },

  form: {
    width: '100%',
  },

  label: {
    color: '#172E2B',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 14,
  },

  inputContainer: {
    height: 85,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#DFE4E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    gap: 15,
  },

  inputIcon: {
    color: '#78817F',
    fontSize: 26,
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: '#253B37',
    height: '100%',
  },

  eye: {
    color: '#78817F',
    fontSize: 25,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 25,
    marginBottom: 26,
  },

  forgotText: {
    color: '#176F63',
    fontSize: 18,
    fontWeight: '700',
  },

  loginButton: {
    height: 90,
    backgroundColor: '#176F63',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 36,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  footer: {
    alignItems: 'center',
    marginTop: 48,
  },

  footerDescription: {
    color: '#858D8B',
    fontSize: 17,
    marginBottom: 14,
    textAlign: 'center',
  },

  footerLink: {
    color: '#176F63',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
