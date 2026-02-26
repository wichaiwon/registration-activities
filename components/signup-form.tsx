'use client'

import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { signup } from '@/app/signup/actions'

interface FormData {
    full_name: string
    email: string
    password: string
    confirm_password: string
}

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            full_name: '',
            email: '',
            password: '',
            confirm_password: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirm_password) {
            setError('confirm_password', {
                message: 'Passwords do not match',
            })
            return
        }

        const result = await signup({
            email: data.email,
            password: data.password,
            full_name: data.full_name,
        })

        if (result?.error) {
            setError('root', { message: result.error })
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your information below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    disabled={isSubmitting}
                                    aria-invalid={!!errors.full_name || !!errors.root}
                                    {...register('full_name', {
                                        required: true,
                                        minLength: 2,
                                    })}
                                />
                            </Field>
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
                                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                                <FieldDescription>Must be at least 6 characters long.</FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    disabled={isSubmitting}
                                    aria-invalid={!!errors.confirm_password || !!errors.root}
                                    {...register('confirm_password', {
                                        required: true,
                                    })}
                                />
                                <FieldDescription>Please confirm your password.</FieldDescription>
                            </Field>
                            <FieldGroup>
                                <Field>
                                    <Button type="submit" disabled={!isValid || isSubmitting}>
                                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                    <Button variant="outline" type="button" disabled>
                                        Sign up with Google
                                    </Button>
                                    <FieldDescription className="px-6 text-center">
                                        Already have an account?{' '}
                                        <Link href="/login" className="underline">
                                            Sign in
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}