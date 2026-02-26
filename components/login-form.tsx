'use client'

import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { login } from '@/app/login/actions'
import Link from 'next/link'

interface FormData {
    email: string
    password: string
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        const result = await login(data)

        if (result?.error) {
            setError('root', { message: result.error })
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    disabled={isSubmitting}
                                    aria-invalid={!!errors.email || !!errors.root}
                                    {...register('email', {
                                        required: true,
                                        pattern: /^\S+@\S+$/i,
                                    })}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={isSubmitting}
                                    aria-invalid={!!errors.password || !!errors.root}
                                    {...register('password', {
                                        required: true,
                                        minLength: 6,
                                    })}
                                />
                            </Field>
                            <Field>
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>
                                <Button variant="outline" type="button" disabled>
                                    Login with Google
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="underline">
                                    Sign up
                                </Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}