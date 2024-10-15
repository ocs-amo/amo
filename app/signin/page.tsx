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
  VStack,
} from "@yamada-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { signin } from "@/actions/auth/signin"
import type { SigninForm} from "@/schema/auth";
import { SigninSchema } from "@/schema/auth"

const LoginPage = () => {
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninForm>({
    resolver: zodResolver(SigninSchema),
  })

  const onSubmit = async (values: SigninForm) => {
    setError("")
    const result = await signin(values)
    if (result?.error) {
      setError(result.error)
    }
  }
  return (
    <Container m="auto" maxW="4xl" w="full" h="100dvh" as={Center}>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Heading textAlign="center">サークル管理アプリ</Heading>
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
        <Center>
          <Button type="submit" isLoading={isSubmitting}>
            サインイン
          </Button>
        </Center>
      </VStack>
    </Container>
  )
}

export default LoginPage
