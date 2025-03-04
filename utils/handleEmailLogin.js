import signIn from "@/app/auth/signIn";

export default async function handleEmailLogin(email, password) {
    const { error } = await signIn(email, password);
    if (error) {
      return console.log(error);
    }
};