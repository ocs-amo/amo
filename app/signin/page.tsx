import { LoginForm } from "@/components/signin/SignIn"
import { Metadata } from "next"

export const generateMetadata = async () => ({title: "サインイン"})

const LoginPage = LoginForm

export default LoginPage
