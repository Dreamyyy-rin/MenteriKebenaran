import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@news-portal/shared";
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function LoginPage() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  function onSubmit(values: LoginInput) {
    console.log("Login Bisa ", values);
    alert("Login Berhasil ");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    //   <Card className="w-full max-w-md shadow-lg border border-gray-200">
    //     <CardHeader>
    //       <CardTitle className="text-2xl font-bold text-center pt-4">login</CardTitle>
    //       <CardDescription className="text-center pb-4">
    //         Welcome to <span className="font-bold">!BERITA!</span>
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <Form {...form}>
    //         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //           <FormField
    //             control={form.control}
    //             name="email"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Email</FormLabel>
    //                 <FormControl>
    //                   <Input placeholder="admin@yahoo.com" {...field} />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="password"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Password</FormLabel>
    //                 <FormControl>
    //                   <Input type="password" placeholder="******" {...field} />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <Button type="submit" className="w-full font-bold">
    //             Masuk
    //           </Button>
    //         </form>
    //       </Form>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}
