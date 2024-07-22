// import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"

import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../../../@/components/ui/form"
import { Input } from "../../../@/components/ui/input"



import { Button } from "../../../@/components/ui/button"
import { useForm } from "react-hook-form"
import { signUpValidation } from "../../../@/lib/validation/index.ts"
import { z } from "zod"
import Loader from "../../../@/components/shared/Loader.tsx"
import { Link, useNavigate } from "react-router-dom"

import { useToast } from "../../../@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "../../../@/lib/react-query/queriesAndMutations.ts"
import { useUserContext } from '../../context/AuthContext.tsx';




export default function SignupForm() {

const navigate = useNavigate()
const {toast} = useToast() 
const {checkAuthUser } = useUserContext()
//mutateAsync is the mutationFn in the createUserAccountNutation function 

const {mutateAsync:createUserAccount , isPending : isCreatingUser} = useCreateUserAccount()


const {mutateAsync:signInAccount } = useSignInAccount()

  // 1. Define your form.
    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
        name : "",
        username: "",
        password: ""
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit (values: z.infer<typeof signUpValidation>) {
        const newUser = await createUserAccount(values);
            if(!newUser){
                return   toast({
        title: "SignUp failed, please try again",
        })
        }


        const session = await signInAccount({
            email : values.email, 
            password : values.password
        })

        if(!session){
            return   toast({
                title: "SignIn failed, please try again",
            })
        }

        const isLoggedIn = await checkAuthUser(); 

        if(isLoggedIn){
            form.reset() ; 
            navigate("/")
        }else {
            return   toast({
                title: "SignIn failed, please try again",
            })
        }

    }



    return (
<>
    <Form {...form}>

    <div className="sm:w-420  flex-center flex-col ">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12" >Create New Account</h2>

        <p className="text-light-3 small-medium md:base-regular">To use Snapgram, please enter your details</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                <FormLabel>UserName</FormLabel>
                <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="shad-button_primary" disabled = {isCreatingUser}>
                
                {
                    isCreatingUser ? (
                        <div className="flex-center gap-2">
                            <Loader/>
                        </div>
                    ) : "SignUp"
                }
            </Button>
            <p className="text-small-regular text-light-2 text-center mt-2">
                Already have an account?
                <Link to={"/sign-in"} className="text-primary-500 text-small-semibold ml-1">
                Sign in
                </Link>
            </p>
        </form>
            </div>
    </Form>
</>
    )
}
