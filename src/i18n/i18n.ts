
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          login: {
            title: 'Login',
            description: 'Enter your credentials to access your account',
            username: 'Username',
            password: 'Password',
            submit: 'Log in',
            loading: 'Logging in...',
            orContinueWith: 'Or continue with',
            identityServer: 'Sign in with Identity Server',
            redirecting: 'Redirecting...'
          },
          leave: {
            title: 'Leave Management',
            description: 'Request and manage your leave days',
            request: 'Request Leave',
            history: 'Leave History',
            balance: 'Leave Balance',
            days: 'days',
            vacation: 'Vacation',
            sickLeave: 'Sick Leave',
            personalLeave: 'Personal Leave'
          }
        }
      },
      es: {
        translation: {
          login: {
            title: 'Iniciar sesión',
            description: 'Ingrese sus credenciales para acceder a su cuenta',
            username: 'Usuario',
            password: 'Contraseña',
            submit: 'Iniciar sesión',
            loading: 'Iniciando sesión...',
            orContinueWith: 'O continuar con',
            identityServer: 'Iniciar sesión con Identity Server',
            redirecting: 'Redirigiendo...'
          },
          leave: {
            title: 'Gestión de Permisos',
            description: 'Solicite y administre sus días de permiso',
            request: 'Solicitar Permiso',
            history: 'Historial de Permisos',
            balance: 'Saldo de Permisos',
            days: 'días',
            vacation: 'Vacaciones',
            sickLeave: 'Baja por Enfermedad',
            personalLeave: 'Permiso Personal'
          }
        }
      },
      fr: {
        translation: {
          login: {
            title: 'Connexion',
            description: 'Entrez vos identifiants pour accéder à votre compte',
            username: 'Nom d\'utilisateur',
            password: 'Mot de passe',
            submit: 'Se connecter',
            loading: 'Connexion en cours...',
            orContinueWith: 'Ou continuer avec',
            identityServer: 'Se connecter avec Identity Server',
            redirecting: 'Redirection...'
          },
          leave: {
            title: 'Gestion des Congés',
            description: 'Demander et gérer vos jours de congé',
            request: 'Demander un Congé',
            history: 'Historique des Congés',
            balance: 'Solde de Congés',
            days: 'jours',
            vacation: 'Vacances',
            sickLeave: 'Congé Maladie',
            personalLeave: 'Congé Personnel'
          }
        }
      },
      de: {
        translation: {
          login: {
            title: 'Anmelden',
            description: 'Geben Sie Ihre Anmeldedaten ein',
            username: 'Benutzername',
            password: 'Passwort',
            submit: 'Anmelden',
            loading: 'Anmeldung läuft...',
            orContinueWith: 'Oder fortfahren mit',
            identityServer: 'Anmelden mit Identity Server',
            redirecting: 'Weiterleitung...'
          },
          leave: {
            title: 'Urlaubsverwaltung',
            description: 'Beantragen und verwalten Sie Ihre Urlaubstage',
            request: 'Urlaub beantragen',
            history: 'Urlaubsverlauf',
            balance: 'Urlaubsguthaben',
            days: 'Tage',
            vacation: 'Urlaub',
            sickLeave: 'Krankheitsurlaub',
            personalLeave: 'Persönlicher Urlaub'
          }
        }
      },
      zh: {
        translation: {
          login: {
            title: '登录',
            description: '输入您的凭据以访问您的帐户',
            username: '用户名',
            password: '密码',
            submit: '登录',
            loading: '正在登录...',
            orContinueWith: '或继续使用',
            identityServer: '使用Identity Server登录',
            redirecting: '重定向中...'
          },
          leave: {
            title: '休假管理',
            description: '申请和管理您的休假天数',
            request: '申请休假',
            history: '休假历史',
            balance: '休假余额',
            days: '天',
            vacation: '假期',
            sickLeave: '病假',
            personalLeave: '个人休假'
          }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
