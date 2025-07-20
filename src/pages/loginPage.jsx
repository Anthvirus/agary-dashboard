import LoginForm from "../components/loginForm";
import AgaryLogo from "../assets/agary_logo.png"

export default function LoginPage() {
  return (
    <div className="max-h-full w-screen bg-blue-400">
      <img src={AgaryLogo} className="w-32 rounded-full absolute top-12 left-12"/>
      <LoginForm />
    </div>
  );
}
