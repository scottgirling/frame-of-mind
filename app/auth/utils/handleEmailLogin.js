import signIn from "@/app/auth/signIn";

export default async function handleEmailLogin(email, password, setLoading) {
  const { error } = await signIn(email, password, setLoading);
  if (error) {
    return console.log(error);
  }
}
