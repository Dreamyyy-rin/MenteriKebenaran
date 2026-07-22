import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@news-portal/shared"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginInput) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Login sukses, token:", data.token)
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        toast.success("Login Sukses!", {
          description: `Selamat datang, ${data.user.fullName}!`,
        })
        window.location.href = "/"
      } else {
        toast.error("Gagal Login", {
          description: data.error || "Terjadi kesalahan",
        })
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("Koneksi Gagal", {
        description: "Pastikan backend sudah menyala.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl shadow-primary/10 rounded-[2.5rem] border-2 border-primary/10">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 py-8 md:py-10">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome User</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your account
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@yahoo.com"
                          type="email"
                          className="h-12 rounded-xl bg-muted/30 px-4 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                          {...field}
                        />
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
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="******" 
                          className="h-12 rounded-xl bg-muted/30 px-4 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full mt-4 rounded-2xl h-14 font-extrabold text-lg shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1 bg-gradient-to-r from-primary to-blue-500 border-none">Masuk ke Portal 🚀</Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/register">Sign up</a>
              </FieldDescription>
            </FieldGroup>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://res.cloudinary.com/donpm3auk/image/upload/v1784654064/Tablet_login_hqy30f.gif"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
