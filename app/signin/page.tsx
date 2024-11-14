"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Center,
  Container,
  FormControl,
  Heading,
  Input,
  Text,
  useBoolean,
  VStack,
} from "@yamada-ui/react"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { signin } from "@/actions/auth/signin"
import { demo } from "@/components/tab/tab-title"
import type { SigninForm } from "@/schema/auth"
import { SigninSchema } from "@/schema/auth"

//export const generateMetadata = () => demo("", "サインイン")

const AmoLogo = () => (
  <svg
    width="100"
    height="40"
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 0L40 40H0L20 0Z" fill="#FF6B6B" />
    <path d="M60 0L80 40H40L60 0Z" fill="#4ECDC4" />
    <text
      x="50"
      y="35"
      fontFamily="Arial"
      fontSize="24"
      fill="#333333"
      textAnchor="middle"
    >
      amo
    </text>
  </svg>
)

const LoginPage = () => {
  const [isLoading, { on: start, off: end }] = useBoolean()
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(SigninSchema),
  })

  const onSubmit = async (values: SigninForm) => {
    start()
    setError("")
    const result = await signin(values)
    if (result?.error) {
      setError(result.error)
    }
    end()
  }

  return (
    <Container m="auto" maxW="4xl" w="full" h="100dvh" as={Center}>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <AmoLogo />
        </Center>
        <Heading textAlign="center">amo</Heading>
        <FormControl
          label="メールアドレス"
          isInvalid={!!errors.email}
          errorMessage={errors.email ? errors.email.message : undefined}
        >
          <Input
            type="text"
            {...register("email")}
            placeholder="sample@email.com"
          />
        </FormControl>
        <FormControl
          label="パスワード"
          isInvalid={!!errors.password}
          errorMessage={errors.password ? errors.password.message : undefined}
        >
          <Input
            type="password"
            {...register("password")}
            placeholder="パスワード"
          />
        </FormControl>
        {error ? <Text color="danger">{error}</Text> : undefined}
        <Center as={VStack}>
          <Button
            type="submit"
            colorScheme="primary"
            width="90%"
            isLoading={isLoading}
            mt={6}
            bgGradient="linear(to-r, teal.400, blue.500)"
            _hover={{
              bgGradient: "linear(to-r, teal.600, blue.700)",
              transform: "scale(1.05)",
            }}
            color="white"
            boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
            isRounded
            transition="all 0.3s ease"
          >
            サインイン
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => signIn("microsoft-entra-id")}
          >
            Microsoftアカウントでサインイン
          </Button>
        </Center>
      </VStack>
    </Container>
  )
}

export default LoginPage
